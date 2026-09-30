/**
 * Static class strings per marketplace role. Tailwind only ships classes it
 * can see written out in full, so these can't be built with template strings.
 */
export const ROLE_TONE = {
  supplier: {
    text: "text-role-supplier",
    soft: "bg-role-supplier-soft",
    dot: "bg-role-supplier",
    border: "border-role-supplier/40",
    ring: "ring-role-supplier/40",
  },
  distributor: {
    text: "text-role-distributor",
    soft: "bg-role-distributor-soft",
    dot: "bg-role-distributor",
    border: "border-role-distributor/40",
    ring: "ring-role-distributor/40",
  },
  contractor: {
    text: "text-role-contractor",
    soft: "bg-role-contractor-soft",
    dot: "bg-role-contractor",
    border: "border-role-contractor/40",
    ring: "ring-role-contractor/40",
  },
};

export const toneFor = (role) => ROLE_TONE[role] ?? ROLE_TONE.supplier;
