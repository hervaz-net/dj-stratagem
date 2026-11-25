import { Link, useParams } from "react-router-dom";
import AdminLayout, { Panel, Pill } from "./AdminLayout";
import { MEMBER_LABEL, MEMBER_TONE } from "./adminStyles";
import useAdminData from "./useAdminData";
import { MemberActions } from "./AdminMembers";
import { fetchMember } from "../../api/admin";
import { JOB_STATUS_LABEL } from "../../api/jobs";
import { formatValue, formatWhen } from "../../components/dashboard/jobFormat";

const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function AdminMemberDetail() {
  const { id } = useParams();
  const { data, error, loading, setData } = useAdminData(({ signal }) => fetchMember(id, { signal }), id);
  const m = data?.member;

  return (
    <AdminLayout
      title={m ? m.name || m.email : loading ? "Loading…" : "Member"}
      subtitle={m ? `${m.email}${m.company ? ` · ${m.company}` : ""}` : undefined}
      actions={<Link to="/admin/members" className="text-sm font-semibold text-fg-muted hover:text-fg">← All members</Link>}
    >
      {error && <Panel className="mb-4 px-5 py-3"><p className="text-sm text-danger">{error.message}</p></Panel>}
      {m && (
        <>
          <Panel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
                <div><dt className="text-fg-muted">Status</dt><dd className="mt-1"><Pill tone={MEMBER_TONE[m.status]}>{MEMBER_LABEL[m.status]}</Pill></dd></div>
                <div><dt className="text-fg-muted">Role</dt><dd className="mt-1 font-semibold text-fg">{m.role === "admin" ? "Admin" : "Member"}</dd></div>
                <div><dt className="text-fg-muted">Signed up</dt><dd className="mt-1 font-semibold text-fg">{formatWhen(m.createdAt, { withTime: false })}</dd></div>
                <div><dt className="text-fg-muted">Last sign-in</dt><dd className="mt-1 font-semibold text-fg">{m.lastLoginAt ? formatWhen(m.lastLoginAt) : "Never"}</dd></div>
                {m.phone && <div><dt className="text-fg-muted">Phone</dt><dd className="mt-1 font-semibold text-fg">{m.phone}</dd></div>}
              </dl>
              <MemberActions member={m} size="detail" onChanged={(next) => setData((d) => ({ ...d, member: { ...d.member, ...next } }))} />
            </div>
          </Panel>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-semibold text-fg">Job postings ({data.jobs.length})</h2>
                <Link to={`/admin/jobs?q=${encodeURIComponent(m.name || m.company || "")}`} className="text-sm font-semibold text-fg-muted hover:text-fg">In job queue</Link>
              </div>
              <ul className="divide-y divide-line">
                {data.jobs.map((j) => (
                  <li key={j.id}>
                    <Link to={`/admin/jobs?open=${j.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-black/[0.02]">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-fg">{j.title}</span>
                        <span className="block truncate text-xs text-fg-muted">{j.ref} · {formatWhen(j.createdAt, { withTime: false })}{j.value !== null && ` · ${formatValue(j.value)}`}</span>
                      </span>
                      <Pill>{JOB_STATUS_LABEL[j.status]}</Pill>
                    </Link>
                  </li>
                ))}
              </ul>
              {!data.jobs.length && <p className="px-5 py-8 text-center text-sm text-fg-muted">No jobs posted.</p>}
            </Panel>

            <Panel>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-semibold text-fg">Catalog ({data.listings.length})</h2>
                <Link to={`/admin/catalog?owner=${m.id}`} className="text-sm font-semibold text-fg-muted hover:text-fg">Manage catalog</Link>
              </div>
              <ul className="divide-y divide-line">
                {data.listings.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-fg">{l.name}</span>
                      <span className="block truncate text-xs text-fg-muted">{l.sku} · {money(l.price)} / {l.unit} · {l.stock} in stock</span>
                    </span>
                    <Pill tone={l.status === "active" ? "success" : "neutral"}>{l.status === "active" ? "Active" : "Draft"}</Pill>
                  </li>
                ))}
              </ul>
              {!data.listings.length && <p className="px-5 py-8 text-center text-sm text-fg-muted">No catalog listings.</p>}
            </Panel>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
