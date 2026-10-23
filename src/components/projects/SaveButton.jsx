import { IconBookmark } from "../icons";
import Button from "../Button";
import { useSavedProjects } from "../../lib/savedProjects";

/**
 * Bookmark toggle backed by the shared saved-projects store.
 * `full` renders a labelled Button (detail header); the default is an
 * icon-only chamfered square for list cards.
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
      <Button
        type="button"
        variant="secondary"
        aria-pressed={saved}
        aria-label={`Save ${project.title}`}
        onClick={() => toggle(project.slug)}
        className={`${saved ? "text-brand!" : ""} ${className}`}
      >
        {icon}
        {saved ? "Saved" : "Save project"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${project.title}`}
      title={saved ? "Remove from saved" : "Save project"}
      onClick={() => toggle(project.slug)}
      className={`inline-flex h-9 w-9 items-center justify-center chamfer-sm bg-ink-2 transition-colors hover:bg-ink-3 ${
        saved ? "text-brand" : "text-steel hover:text-paper"
      } ${className}`}
    >
      {icon}
    </button>
  );
}
