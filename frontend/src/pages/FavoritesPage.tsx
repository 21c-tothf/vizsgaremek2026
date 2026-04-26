import { useEffect, useMemo, useState } from "react";
import { favoritesApi } from "@/api/favoritesApi";
import { listingsApi } from "@/api/listingsApi";
import type { FavoriteItem } from "@/types/favorites";
import type { ListingSummaryResponse } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";
import ListingGrid from "@/components/listings/ListingGrid";
import Button from "@/components/ui/Button";
import { formatHuf } from "@/utils/currency";

interface FavoriteListing {
  favorite: FavoriteItem;
  listing: ListingSummaryResponse;
}

function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function hydrateListings(favorites: FavoriteItem[]) {
    const settled = await Promise.allSettled(
      favorites.map(async (favorite) => {
        const details = await listingsApi.getListingById(favorite.listingId);
        const summary: ListingSummaryResponse = {
          id: details.id,
          title: details.title,
          price: Number(details.price),
          brand: details.brand,
          model: details.model,
          manufactureYear: details.manufactureYear,
          mileage: details.mileage,
          location: details.location,
          coverImageUrl: details.images?.[0]?.imageUrl || details.images?.[0]?.imagePath,
          isFeatured: details.isFeatured,
          createdAt: details.createdAt
        };
        return {
          favorite,
          listing: summary
        };
      })
    );

    const successItems = settled
      .filter((result): result is PromiseFulfilledResult<FavoriteListing> => result.status === "fulfilled")
      .map((result) => result.value);

    const fallbackItems = favorites
      .filter((favorite) => !successItems.some((item) => item.favorite.listingId === favorite.listingId))
      .map((favorite) => ({
        favorite,
        listing: {
          id: favorite.listingId,
          title: favorite.listingTitle || `Listing #${favorite.listingId}`,
          price: Number(favorite.listingPrice || 0),
          brand: "-",
          model: "-",
          manufactureYear: 0,
          mileage: 0,
          location: "-",
          coverImageUrl: favorite.listingImageUrl
        }
      }));

    setFavoriteListings([...successItems, ...fallbackItems]);
  }

  async function loadFavorites() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await favoritesApi.getFavorites();
      setItems(data);
      await hydrateListings(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "A kedvencek betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFavorites();
  }, []);

  async function removeFavorite(listingId: number) {
    setRemovingId(listingId);
    setError(null);
    setSuccess(null);

    try {
      await favoritesApi.removeFavorite(listingId);
      const next = items.filter((item) => item.listingId !== listingId);
      setItems(next);
      setFavoriteListings((prev) => prev.filter((item) => item.favorite.listingId !== listingId));
      setSuccess("Eltávolítva a kedvencekből.");
    } catch (removeError) {
      const parsed = parseApiError(removeError, "A kedvenc eltávolítása sikertelen.");
      setError(parsed.message);
    } finally {
      setRemovingId(null);
    }
  }

  const listingsOnly = useMemo(() => favoriteListings.map((item) => item.listing), [favoriteListings]);

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Kedvencek</h1>
        <p className="text-sm text-zinc-100 sm:text-base">Mentett hirdetések, amelyeket gyorsan újra megnyithatsz.</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      <ListingGrid
        listings={listingsOnly}
        loading={loading}
        emptyTitle="Még nincs kedvenc"
        emptyDescription="Adj hozzá hirdetéseket a kedvencekhez a részletező oldalról, és itt megjelennek."
        hideEmptyAction
      />

      {favoriteListings.length > 0 ? (
        <div className="card-base p-4 sm:p-5">
          <h2 className="text-lg font-bold text-black">Kedvencek kezelése</h2>
          <div className="mt-3 space-y-2">
            {favoriteListings.map(({ favorite, listing }) => (
              <div key={favorite.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-600">{formatHuf(Number(listing.price))}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-danger-500 text-danger-500 hover:bg-red-50"
                  disabled={removingId === favorite.listingId}
                  onClick={() => void removeFavorite(favorite.listingId)}
                >
                  {removingId === favorite.listingId ? "Eltávolítás..." : "Eltávolítás"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default FavoritesPage;