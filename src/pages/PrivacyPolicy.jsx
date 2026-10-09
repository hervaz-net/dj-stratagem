import { DocPage } from "../components/DocFrame";
import Seo from "../components/Seo";

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" description="What D&J Stratagem collects, how it is used, and the choices you have." />
      <DocPage src="/privacy.html" title="Privacy Policy" eyebrow="Legal" lede="What D&J Stratagem collects, how it is used, and the choices you have." />
    </>
  );
}
