import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import Seo from "../components/Seo";

export default function Resources() {
  return (
    <>
      <Seo title="Resources" description="FAQs, guides, and how to reach D&J Stratagem." />
      <PageHeader eyebrow="Resources" title="Help center" lede="FAQs, guides, and ways to reach us." />
      <Section band="white"><p className="text-steel">Coming together.</p></Section>
    </>
  );
}
