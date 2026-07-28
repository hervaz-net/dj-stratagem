import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fetches once, then re-fetches on an interval to keep the dashboard live.
 *
 * Polling pauses while the tab is hidden (no point burning requests on a
 * background tab) and resumes with an immediate refresh on return. In-flight
 * requests are aborted on unmount and between polls.
 *
 * @param {(opts: {signal: AbortSignal}) => Promise<any>} fetcher
 * @param {object}  options
 * @param {number}  [options.intervalMs=30000] Set 0 to disable polling.
 * @param {any}     [options.initialData=null]
 */
export default function usePolledResource(fetcher, { intervalMs = 30000, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await fetcherRef.current({ signal: controller.signal });
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
      setUpdatedAt(Date.now());
    } catch (err) {
      if (controller.signal.aborted || err?.name === "AbortError") return;
      // Keep the last good data on screen rather than blanking the dashboard.
      setError(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  useEffect(() => {
    if (!intervalMs) return undefined;

    let timer = null;
    const start = () => {
      stop();
      timer = window.setInterval(load, intervalMs);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        load();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, load]);

  return { data, error, loading, updatedAt, refresh: load };
}
