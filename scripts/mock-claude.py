#!/usr/bin/env python3
"""A stand-in for the Claude Messages API, for testing the AI subagents
without an API key or spend.

Usage: python3 scripts/mock-claude.py [port]   (default 8765)
Point the server at it with 'ai' => ['api_key' => 'test', 'base_url' => 'http://127.0.0.1:8765']

It answers every request by calling the forced tool, and exercises recursion:
  Supply (depth 0)   calls Exchange back
  Exchange (depth 1) calls Capital back
  Capital (depth 2)  calls Fleet back
  Fleet (depth 3)    is offered no handoffs (the server enforces the cap)
Jobs whose notes contain these words change behaviour:
  MOCK_OVERLOAD_ONCE  the first Projects call gets HTTP 529, then succeeds
  MOCK_BAD_KEY        every call gets HTTP 401 (non-retryable)
  MOCK_LOOP           every subagent asks for two call-backs (tests the caps)
  MOCK_SLOW           every call takes 4 seconds (tests cancelling mid-call)
  MOCK_BAD_MODEL      every call gets HTTP 404 model not found
Every request is appended to mock-claude.log (JSON lines) next to this file,
or to $MOCK_CLAUDE_LOG.
"""
import json
import os
import re
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
LOG = os.environ.get("MOCK_CLAUDE_LOG", os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock-claude.log"))
CHAIN = {("supply", 0): "exchange", ("exchange", 1): "capital", ("capital", 2): "fleet"}
overloaded_once = set()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, body):
        raw = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        system = req.get("system", "")
        prompt = req["messages"][0]["content"]
        tool = req["tools"][0]
        m = re.search(r"You are the (\w+) subagent", system)
        name = m.group(1) if m else "Unknown"
        key = name.lower()
        called = "YOU WERE CALLED BACK BY" in prompt
        has_handoffs = "handoffs" in tool["input_schema"]["properties"]
        depth = len(re.findall(r"\(call-back\)", prompt)) if called else 0
        ref = re.search(r"JOB (JOB-\d+)", prompt).group(1)
        with open(LOG, "a") as f:
            f.write(json.dumps({"ref": ref, "subagent": key, "called_back": called, "handoffs_offered": has_handoffs,
                                "headers_ok": self.headers.get("x-api-key") == "test"
                                and self.headers.get("anthropic-version") == "2023-06-01",
                                "forced_tool": req.get("tool_choice") == {"type": "tool", "name": tool["name"]},
                                "saw_earlier": prompt.count("\n--- ")}) + "\n")

        if "MOCK_SLOW" in prompt:
            time.sleep(4)
        if "MOCK_BAD_MODEL" in prompt:
            return self.reply(404, {"type": "error", "error": {"type": "not_found_error", "message": f"model: {req.get('model')}"}})
        if self.headers.get("x-api-key") != "test" or "MOCK_BAD_KEY" in prompt:
            return self.reply(401, {"type": "error", "error": {"type": "authentication_error", "message": "invalid x-api-key"}})
        if "MOCK_OVERLOAD_ONCE" in prompt and key == "projects" and ref not in overloaded_once:
            overloaded_once.add(ref)
            return self.reply(529, {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}})

        handoffs = []
        if has_handoffs:
            if "MOCK_LOOP" in prompt:
                others = [k for k in tool["input_schema"]["properties"]["handoffs"]["items"]["properties"]["subagent"]["enum"]]
                handoffs = [{"subagent": others[0], "request": f"{name} needs more from {others[0]}"},
                            {"subagent": others[1], "request": f"{name} needs more from {others[1]}"}]
            else:
                # Depth of this task: count how deep the chain is by subagent.
                for (who, d), target in CHAIN.items():
                    if who == key and ((d == 0 and not called) or (d > 0 and called)):
                        handoffs = [{"subagent": target, "request": f"{name} needs {target} to confirm details for the plan."}]
        out = (f"## {name} plan for {ref}\n\n- Built on {prompt.count(chr(10) + '--- ')} earlier deliverables.\n"
               f"- {'Answering a call-back.' if called else 'Pipeline step.'}\n\n| Item | Estimate |\n|---|---|\n| Example | 1 |\n")
        self.reply(200, {
            "id": "msg_mock", "type": "message", "role": "assistant", "model": req.get("model"),
            "stop_reason": "tool_use",
            "content": [{"type": "tool_use", "id": "toolu_mock", "name": tool["name"],
                         "input": {"summary": f"{name} drafted its part of {ref}.", "output": out, "handoffs": handoffs}}],
            "usage": {"input_tokens": len(prompt) // 4, "output_tokens": len(out) // 4},
        })


if __name__ == "__main__":
    print(f"mock Claude on :{PORT}, log {LOG}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
