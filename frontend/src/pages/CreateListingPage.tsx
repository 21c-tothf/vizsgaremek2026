import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingForm from "@/components/listings/ListingForm";
import Button from "@/components/ui/Button";
import { listingsApi } from "@/api/listingsApi";
import type { ListingCreateRequest, ListingResponse, ListingUpdateRequest } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";

function CreateListingPage() {
  const navigate = useNavigate();
  const [createdListing, setCreatedListing] = useState<ListingResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const MAX_IMAGES_PER_LISTING = 8;

  async function handleCreate(payload: ListingCreateRequest | ListingUpdateRequest) {
    if (selectedImages.length === 0) {
      setError("Legalább 1 kép feltöltése kötelező a hirdetés feladásához.");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await listingsApi.createListing(payload as ListingCreateRequest);
      try {
        for (const file of selectedImages) {
          await listingsApi.uploadListingImage(created.id, file);
        }
      } catch (uploadError) {
        // Enforce "image required": if upload fails, remove the just-created listing.
        try {
          await listingsApi.deleteListing(created.id);
        } catch {
          // Best effort rollback.
        }
        const parsedUpload = parseApiError(uploadError, "A kép feltöltése sikertelen.");
        throw new Error(`Kép feltöltése kötelező. ${parsedUpload.message}`);
      }
      setCreatedListing(created);
      setSuccess(`A hirdetés sikeresen létrejött ${selectedImages.length} képpel.`);
      setSelectedImages([]);
    } catch (submitError) {
      const parsed = parseApiError(submitError, "A hirdetés létrehozása sikertelen.");
      setError(parsed.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Hirdetés létrehozása</h1>
          <p className="text-sm text-zinc-100 sm:text-base">Add fel a járműved teljes adatokkal és képgalériával.</p>
        </div>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      <div className="card-base p-5 space-y-3">
        <h2 className="text-lg font-bold text-black">Kötelező borítókép</h2>
        <p className="text-sm text-slate-700">Hirdetés feladáshoz legalább 1 kép kötelező (max. {MAX_IMAGES_PER_LISTING}).</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="btn-base btn-secondary btn-sm cursor-pointer">
            Kép(ek) kiválasztása
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                if (files.length === 0) {
                  return;
                }
                setSelectedImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES_PER_LISTING));
              }}
              disabled={submitting}
            />
          </label>
          <span className="text-sm text-slate-700">
            {selectedImages.length > 0
              ? `${selectedImages.length} kép kiválasztva`
              : "Nincs kiválasztott kép"}
          </span>
          {selectedImages.length > 0 ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedImages([])} disabled={submitting}>
              Képek törlése
            </Button>
          ) : null}
        </div>
        {selectedImages.length > 0 ? (
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {selectedImages.map((file) => (
              <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="card-base p-5">
        <ListingForm mode="create" isSubmitting={submitting} onSubmit={handleCreate} />
      </div>

      {createdListing ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/edit-listing/${createdListing.id}`)}
            className="btn-base btn-secondary btn-md"
          >
            Szerkesztés folytatása
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default CreateListingPage;