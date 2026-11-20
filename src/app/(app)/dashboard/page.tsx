import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Construction } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { eyebrow } from "@/lib/ui";

export default function DashboardEntryPage() {
  return (
    <section className="flex min-h-svh flex-col px-5 py-6 sm:px-10">
      <div className="flex items-center justify-between">
        <BrandMark />
        <Link className="link inline-flex items-center gap-1 text-sm" href="/login">
          Sign in <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="card mx-auto my-auto w-full max-w-xl border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <span className="grid size-11 place-items-center rounded-box bg-primary/15 text-primary">
            <Construction size={22} />
          </span>
          <p className={`${eyebrow} mt-4`}>Your construction desk</p>
          <h1 className="text-4xl font-semibold tracking-tight">The workspace is being prepared.</h1>
          <p className="text-sm leading-relaxed text-base-content/75">
            The public site and account access are ready to explore. The signed-in workspace is a separate app area and will connect here as it comes online.
          </p>
          <div className="card-actions mt-2 items-center">
            <Link className="btn btn-primary" href="/login">
              Sign in <ArrowUpRight size={15} />
            </Link>
            <Link className="btn btn-ghost" href="/">
              <ArrowLeft size={14} /> Back to D&amp;J
            </Link>
          </div>
        </div>
      </div>
      <p className="text-center font-mono text-[0.65rem] tracking-[0.14em] text-base-content/45">
        D&amp;J STRATAGEM · LOS ANGELES
      </p>
    </section>
  );
}
