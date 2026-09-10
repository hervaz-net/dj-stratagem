/**
 * Flat corporate card surface — hairline border, minimal shadow, no blur.
 * `as` lets it render as a section/article without losing the styling.
 */
export default function GlassCard({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`card-corp rounded-md ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
