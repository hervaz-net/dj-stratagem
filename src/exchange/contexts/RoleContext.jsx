import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ROLES } from "../brand";

const STORAGE_KEY = "djs-role";
const RoleContext = createContext(null);

function readStoredRole() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && ROLES[v] ? v : null;
  } catch {
    return null;
  }
}

/**
 * Which side of the marketplace the signed-in user is working as. A company
 * can act as more than one (a distributor buys and sells), so this is a view
 * switch, not an account type. Persisted per browser only.
 */
export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(() => readStoredRole() ?? "contractor");

  const setRole = useCallback((next) => {
    if (!ROLES[next]) return;
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* blocked storage: role still applies for this session */
    }
  }, []);

  const value = useMemo(() => ({ role, roleInfo: ROLES[role], setRole }), [role, setRole]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}
