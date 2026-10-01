import CollateralFrame from "../components/collateral/CollateralFrame";
import { PRODUCT } from "../brand";

export default function Receipts() {
  return (
    <CollateralFrame
      src="/receipts.html"
      title="Receipts"
      description={`Thermal and emailed receipt templates in the ${PRODUCT} brand.`}
    >
      Receipt templates for {PRODUCT}: an 80 mm thermal print and an emailed receipt. Every name,
      number, and amount on them is sample data.
    </CollateralFrame>
  );
}
