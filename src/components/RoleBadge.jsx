import { ROLES } from "../brand";

const tones = {
  supplier: "bg-role-supplier-soft text-role-supplier",
  distributor: "bg-role-distributor-soft text-role-distributor",
  contractor: "bg-role-contractor-soft text-role-contractor",
};

/** Colored pill naming one side of the marketplace. */
export default function RoleBadge({ role, label, className = "" }) {
  const info = ROLES[role];
  if (!info) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[role]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label ?? info.short}
    </span>
  );
}
