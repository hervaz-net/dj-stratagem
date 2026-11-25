import { createPersistedStore } from "./persistedStore";

const store = createPersistedStore("djs-saved-projects-v1", { slugs: [] });

export function toggleSaved(slug) {
  store.set((s) => ({
    ...s,
    slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
  }));
}

export function useSavedProjects() {
  const { slugs } = store.useStore();
  return { slugs, count: slugs.length, isSaved: (slug) => slugs.includes(slug), toggle: toggleSaved };
}
