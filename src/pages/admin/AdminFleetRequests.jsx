import { useState } from "react";
import AdminLayout, { Panel } from "./AdminLayout";
import { btn, input } from "./adminStyles";

/**
 * Staff lookup for fleet reservation references. The number on the
 * customer's confirmation is the same one stored with the request.
 */
export default function AdminFleetRequests() {
  const [ref, setRef] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);

  async function load(reference) {
    setBusy(true);
    setError("");
    const params = new URLSearchParams();
    if (reference) params.set("ref", reference);
    try {
      const res = await fetch(`/api/fleet-requests.php?${params}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setRows([]);
        setError(data.message || "Could not load fleet requests.");
        return;
      }
      setRows(data.request ? [data.request] : data.requests ?? []);
    } catch {
      setRows([]);
      setError("Could not load fleet requests.");
    } finally {
      setBusy(false);
      setSearched(true);
    }
  }

  return (
    <AdminLayout title="Fleet requests" subtitle="Look up a reservation reference from the customer's confirmation.">
      <form
        className="mb-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          load(ref.trim().toUpperCase());
        }}
      >
        <label className="sr-only" htmlFor="fleet-ref">Reference number</label>
        <input
          id="fleet-ref"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="FLT-ABCD-2345"
          className={input + " sm:max-w-xs"}
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit" className={btn.dark} disabled={busy}>
          {busy ? "Looking…" : "Look up"}
        </button>
        <button
          type="button"
          className={btn.ghost}
          disabled={busy}
          onClick={() => {
            setRef("");
            load("");
          }}
        >
          Recent
        </button>
      </form>
      {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
      <Panel>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-fg-muted">
            {searched ? "No request matches that reference." : "Search by reference, or show the latest saved requests."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((row) => (
              <li key={row.reference} className="px-5 py-4">
                <p className="font-mono text-base font-semibold tracking-wide text-fg">{row.reference}</p>
                <p className="mt-1 text-sm text-fg">
                  {row.name}{row.company ? ` · ${row.company}` : ""} · {row.email}
                </p>
                <p className="mt-1 text-xs text-fg-muted">{row.createdAt}</p>
                {row.message && (
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg-muted">{row.message}</pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AdminLayout>
  );
}
