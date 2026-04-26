import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { AdminListingItem } from "@/types/admin";
import { parseApiError } from "@/utils/apiError";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatHuf } from "@/utils/currency";

function formatCreatedAt(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [nameFilter, setNameFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [workingListingId, setWorkingListingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminListingItem | null>(null);

  async function loadListings() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getListings();
      setListings(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "Az admin hirdetések betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadListings();
  }, []);

  const filtered = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase();
    return listings.filter((listing) => {
      const active = listing.isActive ?? true;
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? active : !active;
      const seller = (listing.sellerName || "").toLowerCase();
      const matchesName = normalizedName ? seller.includes(normalizedName) : true;
      return matchesStatus && matchesName;
    });
  }, [listings, statusFilter, nameFilter]);

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setWorkingListingId(deleteTarget.id);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.deleteListing(deleteTarget.id);
      setListings((prev) => prev.filter((listing) => listing.id !== deleteTarget.id));
      setSuccess("A hirdetés sikeresen törölve.");
    } catch (deleteError) {
      const parsed = parseApiError(deleteError, "A hirdetés törlése sikertelen.");
      setError(parsed.message);
    } finally {
      setDeleteTarget(null);
      setWorkingListingId(null);
    }
  }

  async function toggleListingStatus(listing: AdminListingItem) {
    const isActive = listing.isActive ?? true;
    setWorkingListingId(listing.id);
    setError(null);
    setSuccess(null);

    try {
      const updated = isActive
        ? await adminApi.disableListing(listing.id)
        : await adminApi.enableListing(listing.id);
      setListings((prev) => prev.map((item) => (item.id === listing.id ? updated : item)));
      setSuccess(isActive ? "A hirdetés deaktiválva." : "A hirdetés aktiválva.");
    } catch (statusError) {
      const parsed = parseApiError(statusError, "A hirdetés állapotának frissítése sikertelen.");
      setError(parsed.message);
    } finally {
      setWorkingListingId(null);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Admin hirdetések</h1>
          <p className="text-sm text-zinc-100 sm:text-base">Hirdetések moderálása és láthatóságuk kezelése.</p>
        </div>
        <div className="flex w-full -translate-x-6 flex-col items-center justify-center gap-2 sm:w-auto sm:-translate-x-14 sm:flex-row sm:items-center">
          <input
            type="text"
            className="input-base w-full sm:w-64"
            placeholder="Keresés név alapján"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
          />
          <select className="input-base w-full sm:w-52" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "inactive")}>
            <option value="all">Minden állapot</option>
            <option value="active">Csak aktív</option>
            <option value="inactive">Csak inaktív</option>
          </select>
        </div>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      {loading ? (
        <div className="card-base h-72 animate-pulse" />
      ) : (
        <AdminTable headers={["Hirdetés", "Ár", "Eladó", "Állapot", "Létrehozva", "Műveletek"]}>
          {filtered.map((listing) => {
            const isActive = listing.isActive ?? true;
            return (
              <tr key={listing.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <p className="text-xs text-slate-500">#{listing.id} {listing.brand ? `- ${listing.brand} ${listing.model || ""}` : ""}</p>
                </td>
                <td className="px-4 py-3">{listing.price != null ? formatHuf(Number(listing.price)) : "-"}</td>
                <td className="px-4 py-3">{listing.sellerName || "-"}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={isActive ? "Aktív" : "Inaktív"} tone={isActive ? "success" : "danger"} />
                </td>
                <td className="px-4 py-3">{formatCreatedAt(listing.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="min-w-[108px]"
                      disabled={workingListingId === listing.id}
                      onClick={() => void toggleListingStatus(listing)}
                    >
                      {isActive ? "Deaktiválás" : "Aktiválás"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="min-w-[80px] border-danger-500 text-danger-500 hover:bg-red-50"
                      disabled={workingListingId === listing.id}
                      onClick={() => setDeleteTarget(listing)}
                    >
                      Törlés
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hirdetés törlése"
        description={`Biztosan törölni szeretnéd ezt a hirdetést: "${deleteTarget?.title || "ismeretlen"}"? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        isConfirming={Boolean(deleteTarget && workingListingId === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}

export default AdminListingsPage;