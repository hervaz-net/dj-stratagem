/**
 * Frosted-glass surface with an optional luminous rim and depth shadow.
 * `as` lets it render as a section/article without losing the styling.
 */
export default function GlassCard({
  as: Tag = "div",
  luminous = true,
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`panel ${luminous ? "panel-lum" : ""} rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
