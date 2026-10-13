import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Loads admin data and reloads whenever `key` changes (a search or filter).
 * Keeps the last good result on screen while the next one loads.
 */
export default function useAdminData(fetcher, key) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const reload = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const result = await fetcherRef.current({ signal: controller.signal });
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (controller.signal.aborted || err?.name === "AbortError") return;
      setError(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    return () => abortRef.current?.abort();
  }, [key, reload]);

  return { data, error, loading, reload, setData };
}

/** A value that settles `ms` after the last change, for search boxes. */
export function useDebounced(value, ms = 250) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return settled;
}
