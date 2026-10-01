import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { CompactDashboard } from "../../components/CompactDashboard";
import Seo from "../../components/Seo";

export default function BidsCompact() {
  return (
    <>
      <Seo title="Bids — Compact Console" description="Power-user compact bid console with inline editing." noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bids (Compact)" }]}
        title="Bid Console"
        subtitle="Compact power-user dashboard with inline editors and keyboard shortcuts."
      >
        <CompactDashboard />
      </DashboardLayout>
    </>
  );
}
