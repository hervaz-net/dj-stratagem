import { IconBookmark } from "../../exchange/components/icons";
import Button from "../../exchange/components/Button";
import { useSavedProjects } from "../../lib/savedProjects";

/**
 * Bookmark toggle backed by the shared saved-projects store.
 * `full` renders a labelled Button (detail header); the default is an
 * icon-only round button for board cards.
 */
export default function SaveButton({ project, full = false, className = "" }) {
  const { isSaved, toggle } = useSavedProjects();
  const saved = isSaved(project.slug);
  const icon = (
    <IconBookmark width={16} height={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
  );

  if (full) {
    return (
      <Button
        type="button"
        variant={saved ? "soft" : "secondary"}
        aria-pressed={saved}
        aria-label={`Save ${project.title}`}
        onClick={() => toggle(project.slug)}
        className={className}
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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        saved
          ? "border-brand bg-brand-soft text-brand"
          : "border-line bg-surface text-fg-muted hover:border-brand hover:text-brand"
      } ${className}`}
    >
      {icon}
    </button>
  );
}
