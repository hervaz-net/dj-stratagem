"""Fail unless a cPanel UAPI response reports success. Reads JSON from stdin."""

import json
import sys

raw = sys.stdin.read()
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    print("::error::non-JSON UAPI response:", raw[:300])
    sys.exit(1)
if not data.get("status") or data.get("errors"):
    errors = data.get("errors") or ["status=0"]
    print("::error::UAPI failed:", "; ".join(map(str, errors)))
    sys.exit(1)
print("  ok")
