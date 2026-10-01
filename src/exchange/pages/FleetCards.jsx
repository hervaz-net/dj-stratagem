import CollateralFrame from "../components/collateral/CollateralFrame";
import { PRODUCT } from "../brand";

export default function FleetCards() {
  return (
    <CollateralFrame
      src="/fleet-cards.html"
      title="Fleet cards"
      description={`Design concept for ${PRODUCT} fleet cards: card faces, controls layout, and a sample statement.`}
    >
      A design concept for fleet cards carrying the {PRODUCT} mark: card faces, the controls a fleet
      manager would set, and a statement layout. It is a brand exercise, not a card program you can
      apply for.
    </CollateralFrame>
  );
}
