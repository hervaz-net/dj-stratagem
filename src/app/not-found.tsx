import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span className="eyebrow">404 · Not on this set</span>
      <h1>Looks like this page took a different route.</h1>
      <p>The page may have moved. Let’s get you back to the work.</p>
      <div>
        <Link className="button button-primary" href="/">
          <ArrowLeft size={15} /> Back home
        </Link>
        <Link className="text-link" href="/contact">
          Talk to a person <ArrowUpRight size={15} />
        </Link>
      </div>
    </main>
  );
}
