import EmptyState from "@/components/ui/EmptyState";
import type { ListingSummaryResponse } from "@/types/listings";
import ListingCard from "@/components/listings/ListingCard";

interface ListingGridProps {
  listings: ListingSummaryResponse[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  hideEmptyAction?: boolean;
}

function ListingGrid({
  listings,
  loading = false,
  emptyTitle = "Nincs találat",
  emptyDescription = "Próbáld módosítani a szűrőket, hogy elérhető autókat láss.",
  hideEmptyAction = false
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-base overflow-hidden">
            <div className="h-48 animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={hideEmptyAction ? undefined : "Szűrők törlése"}
        actionTo={hideEmptyAction ? undefined : "/listings"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default ListingGrid;