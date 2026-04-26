import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import ListingGrid from "@/components/listings/ListingGrid";
import ImageGallery from "@/components/listing-details/ImageGallery";
import SellerInfoCard from "@/components/listing-details/SellerInfoCard";
import { listingsApi } from "@/api/listingsApi";
import { favoritesApi } from "@/api/favoritesApi";
import { useAuth } from "@/hooks/useAuth";
import type { ListingResponse, ListingSummaryResponse } from "@/types/listings";
import { formatHuf } from "@/utils/currency";
import { parseApiError } from "@/utils/apiError";

function ListingDetailsPage() {
  const { id } = useParams();
  const listingId = Number(id);
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [similarListings, setSimilarListings] = useState<ListingSummaryResponse[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) {
      setError("Érvénytelen hirdetés azonosító.");
      setLoading(false);
      return;
    }

    async function loadDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await listingsApi.getListingById(listingId);
        if (data.isActive === false) {
          throw new Error("Pillanatnyilag nem elérhető.");
        }
        setListing(data);

        const similar = await listingsApi.searchListings({
          brand: data.brand,
          model: data.model,
          sort: "createdAt,desc",
          size: 8
        });
        setSimilarListings(similar.filter((item) => item.id !== data.id && item.isActive !== false).slice(0, 3));
      } catch (loadError) {
        const parsed = parseApiError(loadError, "A hirdetés részleteinek betöltése sikertelen.");
        setError(parsed.message);
      } finally {
        setLoading(false);
      }
    }

    void loadDetails();
  }, [listingId]);

  useEffect(() => {
    if (!isAuthenticated || !listingId) {
      setIsFavorite(false);
      return;
    }

    async function loadFavoriteStatus() {
      try {
        const favorites = await favoritesApi.getFavorites();
        setIsFavorite(favorites.some((favorite) => favorite.listingId === listingId));
      } catch {
        setIsFavorite(false);
      }
    }

    void loadFavoriteStatus();
  }, [isAuthenticated, listingId]);

  async function toggleFavorite() {
    if (!listingId || !isAuthenticated) {
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(listingId);
        setIsFavorite(false);
      } else {
        await favoritesApi.addFavorite(listingId);
        setIsFavorite(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  }

  const technicalRows = useMemo(() => {
    if (!listing) return [];

    return [
      { label: "Márka", value: listing.brand },
      { label: "Modell", value: listing.model },
      { label: "Évjárat", value: String(listing.manufactureYear) },
      { label: "Futásteljesítmény", value: `${Number(listing.mileage).toLocaleString("hu-HU")} km` },
      { label: "Üzemanyag", value: listing.fuelType },
      { label: "Váltó", value: listing.transmission },
      { label: "Ajtók száma", value: listing.bodyType },
      { label: "Szín", value: listing.color || "-" },
      { label: "Motor", value: listing.engineSize ? `${listing.engineSize} L` : "-" },
      { label: "Lóerő", value: listing.horsepower ? `${listing.horsepower} LE` : "-" }
    ];
  }, [listing]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </section>
    );
  }

  if (error || !listing) {
    return (
      <section className="space-y-4">
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error || "A hirdetés nem található."}</p>
        <Link to="/listings" className="btn-base btn-secondary btn-md">
          Vissza a hirdetésekhez
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{listing.title}</h1>
          <p className="text-sm text-zinc-100 sm:text-base">{`${listing.brand} ${listing.model} - ${listing.location}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-black text-white">{formatHuf(Number(listing.price))}</p>
          <Button variant={isFavorite ? "secondary" : "accent"} onClick={toggleFavorite} disabled={!isAuthenticated || favoriteLoading}>
            {isFavorite ? "Kedvenc" : "Kedvencekhez adás"}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="space-y-5">
          <ImageGallery images={listing.images || []} fallbackTitle={listing.title} />
        </article>

        <aside className="space-y-4">
          <SellerInfoCard
            sellerName={listing.sellerName}
            sellerEmail={listing.sellerEmail}
            location={listing.location}
            showEmail={isAuthenticated}
          />

          {!isAuthenticated ? (
            <p className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
              Jelentkezz be, hogy lásd az eladó e-mail címét és kedvenceket ments.
            </p>
          ) : null}
        </aside>
      </div>

      <div className="card-base p-6">
        <h2 className="text-xl font-bold text-black">Műszaki adatok</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          {technicalRows.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-1 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-base p-6">
        <h2 className="text-xl font-bold text-black">Leírás</h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{listing.description}</p>
      </div>

      {similarListings.length > 0 ? (
        <section className="space-y-4">
          <header className="space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Hasonló hirdetések</h2>
          </header>
          <ListingGrid listings={similarListings} />
        </section>
      ) : null}

      <div className="pt-1">
        <Link to="/listings" className="btn-base btn-secondary btn-md">
          Vissza a hirdetésekhez
        </Link>
      </div>
    </section>
  );
}

export default ListingDetailsPage;