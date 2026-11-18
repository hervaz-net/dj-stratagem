import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Construction } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function DashboardEntryPage() {
  return (
    <section className="dashboard-entry">
      <div className="dashboard-entry-top">
        <BrandMark />
        <Link href="/login">Sign in <ArrowUpRight size={15} /></Link>
      </div>
      <div className="dashboard-entry-card">
        <span className="dashboard-entry-icon"><Construction size={23} /></span>
        <span className="eyebrow">Your construction desk</span>
        <h1>The workspace is being prepared.</h1>
        <p>
          The public site and account access are ready to explore. The signed-in
          workspace is a separate app area and will connect here as it comes
          online.
        </p>
        <div className="dashboard-entry-actions">
          <Link className="button button-primary" href="/login">
            Sign in <ArrowUpRight size={15} />
          </Link>
          <Link className="text-link" href="/">
            <ArrowLeft size={14} /> Back to D&amp;J
          </Link>
        </div>
      </div>
      <span className="dashboard-entry-foot">D&amp;J STRATAGEM · LOS ANGELES</span>
    </section>
  );
}
