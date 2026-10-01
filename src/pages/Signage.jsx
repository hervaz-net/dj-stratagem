import CollateralFrame from "../components/collateral/CollateralFrame";
import { PRODUCT } from "../brand";

export default function Signage() {
  return (
    <CollateralFrame
      src="/signage.html"
      title="Signage"
      description={`Exhibit banner, will-call counter sign, and vehicle panel templates for ${PRODUCT}.`}
    >
      Large-format templates for {PRODUCT}: a trade-show banner, a will-call counter sign for a
      distributor branch, and a vehicle door panel.
    </CollateralFrame>
  );
}
