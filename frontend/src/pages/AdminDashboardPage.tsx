import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api/adminApi";
import type { AdminDashboardResponse } from "@/types/admin";
import { parseApiError } from "@/utils/apiError";
import DashboardStatCard from "@/components/admin/DashboardStatCard";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getDashboard();
        setStats(data);
      } catch (loadError) {
        const parsed = parseApiError(loadError, "Az admin vezérlőpult betöltése sikertelen.");
        setError(parsed.message);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const inactiveListings = useMemo(() => {
    if (stats?.inactiveListings != null) {
      return stats.inactiveListings;
    }
    if (stats?.activeListings != null && stats?.totalListings != null) {
      return Math.max(0, stats.totalListings - stats.activeListings);
    }
    return 0;
  }, [stats]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="card-base h-32 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Admin vezérlőpult</h1>
        <p className="text-sm text-zinc-100 sm:text-base">Platformszintű piactér statisztikák és állapotáttekintés.</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Összes felhasználó"
          value={stats?.totalUsers ?? 0}
          subtitle="Kattints a felhasználók megtekintéséhez és törléséhez"
          onClick={() => navigate("/admin/users")}
        />
        <DashboardStatCard title="Összes hirdetés" value={stats?.totalListings ?? 0} />
        <DashboardStatCard
          title="Aktív hirdetések"
          value={stats?.activeListings ?? 0}
          subtitle="Kattints az aktív hirdetések megtekintéséhez"
          onClick={() => navigate("/admin/listings")}
        />
        <DashboardStatCard title="Inaktív hirdetések" value={inactiveListings} />
        <DashboardStatCard title="Összes kedvenc" value={stats?.totalFavorites ?? 0} />
      </div>
    </section>
  );
}

export default AdminDashboardPage;