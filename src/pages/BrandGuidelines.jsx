import DocFrame from "../components/DocFrame";
import Seo from "../components/Seo";
import SubagentMarkSheet from "../shared/SubagentMarkSheet";

export default function BrandGuidelines() {
  return (
    <>
      <Seo
        title="Brand guidelines"
        description="How to use the D&J Stratagem name, mark, and color. Printable sheet for partners and press."
      />
      <SubagentMarkSheet />
      <DocFrame src="/brand-guidelines.html" title="Brand Guidelines" />
    </>
  );
}
