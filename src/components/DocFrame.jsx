/** Embeds a static document from /public without overflowing the marketing chrome. */
export default function DocFrame({ src, title }) {
  return (
    <iframe
      src={src}
      title={title}
      className="block w-full border-0 bg-paper"
      style={{ height: "calc(100dvh - 8rem)", minHeight: "32rem" }}
    />
  );
}
