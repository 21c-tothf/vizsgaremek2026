import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListingForm, { mapListingToFormValues } from "@/components/listings/ListingForm";
import ImageUploadSection from "@/components/listings/ImageUploadSection";
import { listingsApi } from "@/api/listingsApi";
import type { ListingCreateRequest, ListingResponse, ListingUpdateRequest } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";

function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const listingId = Number(id);

  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadListing() {
    if (!listingId) {
      setError("Érvénytelen hirdetés azonosító.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await listingsApi.getListingById(listingId);
      setListing(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "A hirdetés betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadListing();
  }, [listingId]);

  async function handleSave(payload: ListingCreateRequest | ListingUpdateRequest) {
    if (!listingId) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await listingsApi.updateListing(listingId, payload as ListingUpdateRequest);
      setListing(updated);
      setSuccess("A hirdetés sikeresen frissítve.");
    } catch (submitError) {
      const parsed = parseApiError(submitError, "A hirdetés frissítése sikertelen.");
      setError(parsed.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-12 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="card-base h-96 animate-pulse" />
      </section>
    );
  }

  if (error && !listing) {
    return (
      <section className="space-y-4">
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
        <Link to="/my-listings" className="btn-base btn-secondary btn-md">
          Vissza a hirdetéseimhez
        </Link>
      </section>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Hirdetés szerkesztése</h1>
          <p className="text-sm text-zinc-100 sm:text-base">Frissítsd az adatokat, az állapotot és a képgalériát.</p>
        </div>
        <button type="button" onClick={() => navigate("/my-listings")} className="btn-base btn-secondary btn-md">
          Vissza
        </button>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      <div className="card-base p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Hirdetés adatai</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {listing.isActive === false ? "Inaktív" : "Aktív"}
          </span>
        </div>

        <ListingForm
          mode="edit"
          initialValues={mapListingToFormValues(listing)}
          isSubmitting={submitting}
          submitLabel="Hirdetés frissítése"
          onSubmit={handleSave}
        />
      </div>

      <ImageUploadSection listingId={listing.id} images={listing.images || []} onChanged={loadListing} />
    </section>
  );
}

export default EditListingPage;