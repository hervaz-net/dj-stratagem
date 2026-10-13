import { useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";
import { usePolledResource } from "../../api/usePolledResource";
import { cancelOrders } from "../../api/dashboard";
import { useAuth } from "../../contexts/AuthContext";

export default function Orders() {
  const { toast } = useToast();
  const { csrf } = useAuth();
  const resource = usePolledResource("/api/orders.php", { interval: 30000 });
  const orders = resource.data || [];
  const [selected, setSelected] = useState(new Set());
  const [cancelling, setCancelling] = useState(false);

  const pending = orders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status));
  const pendingValue = pending.reduce((s, o) => s + o.value, 0);

  const toggleSelect = (id) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const next = await cancelOrders({ ids: [...selected], csrf });
      resource.refresh();
      if (Array.isArray(next) && next.length) {
        toast("Orders cancelled");
      }
      setSelected(new Set());
    } catch (e) {
      toast(e.message || "Could not cancel", "error");
    } finally {
      setCancelling(false);
    }
  };

  // ... rest of the component would follow; this is a partial for the update demonstration
  return (
    <DashboardLayout title="Orders">
      <Seo title="Orders" noindex />
      {/* component body */}
    </DashboardLayout>
  );
}
