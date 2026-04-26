import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { listingsApi } from "@/api/listingsApi";
import type { ListingSummaryResponse } from "@/types/listings";
import { formatHuf } from "@/utils/currency";
import { parseApiError } from "@/utils/apiError";
import EmptyState from "@/components/ui/EmptyState";
import { resolveAssetUrl } from "@/utils/assetUrl";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function MyListingsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ListingSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ListingSummaryResponse | null>(null);

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const data = await listingsApi.getMyListings();
      setItems(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "A hirdetéseid betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      await listingsApi.deleteListing(id);
      setSuccess("A hirdetés sikeresen törölve.");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (deleteError) {
      const parsed = parseApiError(deleteError, "A hirdetés törlése sikertelen.");
      setError(parsed.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Hirdetéseim</h1>
          <p className="text-sm text-zinc-100 sm:text-base">Kezeld a közzétett és  hirdetéseidet.</p>
        </div>
        <Button onClick={() => navigate("/create-listing")}>Hirdetés létrehozása</Button>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card-base h-44 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Még nincs hirdetésed"
          description="Hozd létre az első hirdetésedet, és kezdd el az autód értékesítését."
          actionLabel="Hirdetés létrehozása"
          actionTo="/create-listing"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="card-base overflow-hidden">
              <div className="h-36 bg-slate-200">
                {item.coverImageUrl ? (
                  <img src={resolveAssetUrl(item.coverImageUrl)} alt={item.title} className="h-full w-full bg-slate-100 object-contain" />
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.brand} {item.model} - {item.manufactureYear}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {(item as { isActive?: boolean }).isActive === false ? "Inaktív" : "Aktív"}
                  </span>
                </div>

                <p className="text-xl font-black text-brand-900">{formatHuf(Number(item.price))}</p>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <Link to={`/listings/${item.id}`} className="btn-base btn-ghost btn-sm rounded-lg border border-slate-200">
                    Megnyitás
                  </Link>
                  <Link to={`/edit-listing/${item.id}`} className="btn-base btn-secondary btn-sm rounded-lg">
                    Szerkesztés
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg border-danger-500 text-danger-500 hover:bg-red-50"
                    disabled={deletingId === item.id}
                    onClick={() => setDeleteTarget(item)}
                  >
                    {deletingId === item.id ? "Törlés..." : "Törlés"}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hirdetés törlése"
        description={`Biztosan törölni szeretnéd ezt a hirdetést: "${deleteTarget?.title || "ismeretlen"}"? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        isConfirming={Boolean(deleteTarget && deletingId === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}

export default MyListingsPage;