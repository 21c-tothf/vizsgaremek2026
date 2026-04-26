import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import type { ListingSummaryResponse } from "@/types/listings";
import { formatHuf } from "@/utils/currency";
import { resolveAssetUrl } from "@/utils/assetUrl";

interface ListingCardProps {
  listing: ListingSummaryResponse;
}

function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = resolveAssetUrl(listing.coverImageUrl);
  const isActive = listing.isActive ?? true;

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 ease-out ${
        isActive ? "hover:-translate-y-1 hover:shadow-card-lg hover:ring-1 hover:ring-slate-200/50" : "opacity-85"
      }`}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/90">
        {listing.isFeatured ? (
          <span className="absolute left-3 top-3 z-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            Kiemelt
          </span>
        ) : null}
        {!isActive ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 px-4 text-center text-sm font-semibold text-white backdrop-blur-[2px]">
            Pillanatnyilag nem elérhető
          </div>
        ) : null}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className={`h-full w-full object-cover transition duration-500 ease-out ${
              isActive ? "group-hover:scale-[1.04]" : "blur-[1.5px] grayscale-[20%]"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">A kép nem érhető el</div>
        )}
      </div>

      <CardContent className="space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {listing.brand} {listing.model}
          </p>
          <h3 className="font-heading line-clamp-2 text-lg font-bold leading-snug text-slate-900">{listing.title}</h3>
        </div>

        <p className="text-2xl font-black text-slate-900">
          {formatHuf(Number(listing.price))}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          <span>{listing.manufactureYear}</span>
          <span className="text-right sm:text-left">{Number(listing.mileage).toLocaleString("hu-HU")} km</span>
          <span className="col-span-2 text-slate-500">{listing.location}</span>
        </div>

        <div className="pt-1">
          {isActive ? (
            <Link
              to={`/listings/${listing.id}`}
              className="btn-base btn-primary btn-sm w-full rounded-xl"
            >
              Részletek
            </Link>
          ) : (
            <span className="btn-base btn-sm w-full cursor-not-allowed rounded-xl border border-zinc-400 bg-zinc-300/60 text-center text-zinc-700">
              Pillanatnyilag nem elérhető
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ListingCard;