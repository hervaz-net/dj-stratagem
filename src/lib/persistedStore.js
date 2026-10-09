import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store with a React hook. Several unrelated
 * components (navbar badge, catalog cards, quote page) read the same state,
 * and a Context provider would mean wiring it into App for each one — a
 * module-level store plus useSyncExternalStore gives the same sharing with
 * no provider, and syncs across browser tabs through the `storage` event.
 *
 * Storage can throw (private windows, blocked site data); every access is
 * guarded and the store keeps working in memory when it does.
 */
export function createPersistedStore(key, initial) {
  let state = initial;
  let loaded = false;
  const listeners = new Set();

  const load = () => {
    if (loaded) return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      state = initial;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const onStorage = (e) => {
    if (e.key !== key) return;
    try {
      state = e.newValue ? { ...initial, ...JSON.parse(e.newValue) } : initial;
    } catch {
      state = initial;
    }
    emit();
  };

  const subscribe = (listener) => {
    load();
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  };

  const getSnapshot = () => {
    load();
    return state;
  };

  const set = (next) => {
    load();
    state = typeof next === "function" ? next(state) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* in-memory only */
    }
    emit();
  };

  const useStore = () => useSyncExternalStore(subscribe, getSnapshot, () => initial);

  return { useStore, set, get: getSnapshot };
}
