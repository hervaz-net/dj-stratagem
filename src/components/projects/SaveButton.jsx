import { IconBookmark } from "../icons";
import { useSavedProjects } from "../../lib/savedProjects";

/**
 * Bookmark toggle backed by the shared saved-projects store.
 * `full` renders a labelled button (detail header); the default is an
 * icon-only square for dense rows.
 */
export default function SaveButton({ project, full = false, className = "" }) {
  const { isSaved, toggle } = useSavedProjects();
  const saved = isSaved(project.slug);
  const icon = (
    <IconBookmark
      width={full ? 16 : 17}
      height={full ? 16 : 17}
      fill={saved ? "currentColor" : "none"}
      aria-hidden="true"
    />
  );

  if (full) {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={`Save ${project.title}`}
        onClick={() => toggle(project.slug)}
        className={`button secondary ${saved ? "is-saved" : ""} mb-0! inline-flex items-center justify-center gap-2 ${className}`}
      >
        {icon}
        {saved ? "Saved" : "Save project"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${project.title}`}
      title={saved ? "Remove from saved" : "Save project"}
      onClick={() => toggle(project.slug)}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
        saved
          ? "border-amber bg-ink text-amber"
          : "border-line-2 bg-ink-2 text-steel hover:border-amber hover:text-paper"
      } ${className}`}
    >
      {icon}
    </button>
  );
}
