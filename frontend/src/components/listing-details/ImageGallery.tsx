import { useEffect, useMemo, useState } from "react";
import type { ListingImage } from "@/types/listings";
import { resolveAssetUrl } from "@/utils/assetUrl";

interface ImageGalleryProps {
  images: ListingImage[];
  fallbackTitle: string;
}

function ImageGallery({ images, fallbackTitle }: ImageGalleryProps) {
  const imageUrls = useMemo(
    () =>
      images
        .map((image) => resolveAssetUrl(image.imageUrl || image.imagePath))
        .filter((value): value is string => Boolean(value)),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = imageUrls.length > 1;

  useEffect(() => {
    if (activeIndex >= imageUrls.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, imageUrls.length]);

  const activeImage = imageUrls[activeIndex];

  function showPrevious() {
    if (!hasMultipleImages) {
      return;
    }
    setActiveIndex((current) => (current - 1 + imageUrls.length) % imageUrls.length);
  }

  function showNext() {
    if (!hasMultipleImages) {
      return;
    }
    setActiveIndex((current) => (current + 1) % imageUrls.length);
  }

  return (
    <section className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {activeImage ? (
          <img src={activeImage} alt={fallbackTitle} className="h-80 w-full object-cover sm:h-[420px]" />
        ) : (
          <div className="flex h-80 items-center justify-center text-sm text-slate-500 sm:h-[420px]">Nincs feltöltött kép</div>
        )}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/75"
              aria-label="Előző kép"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/75"
              aria-label="Következő kép"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={imageUrl + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-lg border ${
                index === activeIndex ? "border-brand-600" : "border-slate-200"
              }`}
            >
              <img src={imageUrl} alt={`${fallbackTitle} ${index + 1}`} className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ImageGallery;