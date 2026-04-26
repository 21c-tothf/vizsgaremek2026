import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { listingsApi } from "@/api/listingsApi";
import type { ListingImage } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";
import { resolveAssetUrl } from "@/utils/assetUrl";

interface ImageUploadSectionProps {
  listingId: number;
  images?: ListingImage[];
  onChanged?: () => Promise<void> | void;
}

const MAX_IMAGES_PER_LISTING = 8;

function ImageUploadSection({ listingId, images = [], onChanged }: ImageUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (images.length >= MAX_IMAGES_PER_LISTING) {
      setError(`Hirdetésenként legfeljebb ${MAX_IMAGES_PER_LISTING} kép tölthető fel.`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedFiles = Array.from(files);
      const remainingSlots = Math.max(0, MAX_IMAGES_PER_LISTING - images.length);
      const filesToUpload = selectedFiles.slice(0, remainingSlots);
      if (filesToUpload.length === 0) {
        setError(`Hirdetésenként legfeljebb ${MAX_IMAGES_PER_LISTING} kép tölthető fel.`);
        return;
      }

      for (const file of filesToUpload) {
        await listingsApi.uploadListingImage(listingId, file);
      }

      if (selectedFiles.length > filesToUpload.length) {
        setSuccess(`${filesToUpload.length} kép feltöltve. A többi fájl kihagyva a ${MAX_IMAGES_PER_LISTING} képes limit miatt.`);
      } else {
        setSuccess(`${filesToUpload.length} kép sikeresen feltöltve.`);
      }
      if (onChanged) {
        await onChanged();
      }
    } catch (uploadError) {
      const parsed = parseApiError(uploadError, "A képfeltöltés sikertelen.");
      setError(parsed.message);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleDelete(imageId: number) {
    setDeletingImageId(imageId);
    setError(null);
    setSuccess(null);

    try {
      await listingsApi.deleteImage(imageId);
      setSuccess("A kép törölve.");
      if (onChanged) {
        await onChanged();
      }
    } catch (deleteError) {
      const parsed = parseApiError(deleteError, "A kép törlése sikertelen.");
      setError(parsed.message);
    } finally {
      setDeletingImageId(null);
    }
  }

  return (
    <section className="card-base p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Képek</h2>
        <label className="btn-base btn-secondary btn-sm cursor-pointer">
          Kép(ek) feltöltése
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={images.length >= MAX_IMAGES_PER_LISTING || uploading}
          />
        </label>
      </div>

      <p className="mt-1 text-sm text-slate-600">Hirdetésenként legfeljebb {MAX_IMAGES_PER_LISTING} kép csatolható.</p>

      {uploading ? <p className="mt-3 text-sm text-slate-700">Képek feltöltése...</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-success-500">{success}</p> : null}

      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => {
            const url = resolveAssetUrl(image.imageUrl || image.imagePath) || "";
            return (
              <div key={image.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {url ? (
                  <img src={url} alt={`Hirdetés kép ${image.id}`} className="h-24 w-full object-cover" />
                ) : (
                  <div className="flex h-24 items-center justify-center text-xs text-slate-500">Kép</div>
                )}
                <div className="p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled={deletingImageId === image.id}
                    onClick={() => handleDelete(image.id)}
                  >
                    {deletingImageId === image.id ? "Törlés..." : "Törlés"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Még nincs feltöltött kép.</p>
      )}
    </section>
  );
}

export default ImageUploadSection;