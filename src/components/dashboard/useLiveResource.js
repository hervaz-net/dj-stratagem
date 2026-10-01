import { useCallback, useEffect, useRef, useState } from "react";
import { markConfigured } from "../../api/client";

/**
 * Loads from the API and reports whether the answer is live. When the API
 * can't be reached (local Vite, no PHP) it settles on `fallback` with
 * live = false, so the page can keep its sample data and say so. 401 is
 * rethrown on purpose: a signed-out session must not look like sample mode.
 */
export default function useLiveResource(load, fallback) {
  const [state, setState] = useState({ data: null, live: false, loading: true, error: null });
  const fallbackRef = useRef(fallback);

  const reload = useCallback(
    async (signal) => {
      try {
        const data = await load({ signal });
        setState({ data, live: true, loading: false, error: null });
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (err?.status === 401) {
          setState((s) => ({ ...s, loading: false, error: err }));
          return;
        }
        markConfigured(false);
        setState({ data: fallbackRef.current, live: false, loading: false, error: null });
      }
    },
    [load],
  );

  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  const setData = useCallback((data) => setState((s) => ({ ...s, data })), []);
  return { ...state, reload, setData };
}
