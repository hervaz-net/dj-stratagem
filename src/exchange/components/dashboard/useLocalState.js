import { useCallback, useState } from "react";

/**
 * useState that also persists to localStorage. For dashboard features with no
 * endpoint yet: data stays in this browser, and pages must say so on screen.
 */
export default function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch {
      /* unreadable or blocked storage: fall back to the initial value */
    }
    return typeof initial === "function" ? initial() : initial;
  });

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage full or blocked: keep the in-memory value */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}
