import { Link } from "react-router-dom";
import PreviewNotice from "../PreviewNotice";

/** PreviewNotice with copy for catalog, equipment, and listing previews. */
export default function SampleNotice({ title = "Preview: sample listings", children, className = "" }) {
  return (
    <PreviewNotice title={title} className={className}>
      {children ?? (
        <>
          Every seller, SKU, price, and stock level on this page is an illustrative example of how
          listings appear on the marketplace. <strong className="font-semibold">Nothing here can be ordered.</strong>{" "}
          The live catalog opens to early users first.{" "}
          <Link to="/register" className="font-semibold text-brand underline hover:text-brand-hover">
            Request access
          </Link>
          .
        </>
      )}
    </PreviewNotice>
  );
}
