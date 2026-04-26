import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchFilters, { type SearchFilterValues } from "@/components/listings/SearchFilters";
import SortBar from "@/components/listings/SortBar";
import ListingGrid from "@/components/listings/ListingGrid";
import { listingsApi } from "@/api/listingsApi";
import type { ListingSearchParams, ListingSummaryResponse } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";

const defaultFilters: SearchFilterValues = {
  brand: "",
  model: "",
  minPrice: "",
  maxPrice: "",
  minYear: "",
  maxYear: "",
  minMileage: "",
  maxMileage: "",
  fuelType: ""
};

function filtersFromSearchParams(searchParams: URLSearchParams): SearchFilterValues {
  return {
    brand: searchParams.get("brand") || "",
    model: searchParams.get("model") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    minMileage: searchParams.get("minMileage") || "",
    maxMileage: searchParams.get("maxMileage") || "",
    fuelType: searchParams.get("fuelType") || ""
  };
}

function hasAnyFilter(f: SearchFilterValues): boolean {
  if (f.brand.trim() || f.model.trim()) return true;
  if (f.minPrice !== "" || f.maxPrice !== "") return true;
  if (f.minYear !== "" || f.maxYear !== "") return true;
  if (f.minMileage !== "" || f.maxMileage !== "") return true;
  if (f.fuelType.trim()) return true;
  return false;
}

function buildRequestParams(
  appliedFilters: SearchFilterValues,
  sort: string
): { params: ListingSearchParams; hasSearchFilters: boolean } {
  const last = sort.lastIndexOf("_");
  const sortBy = last > 0 ? sort.slice(0, last) : "createdAt";
  const sortDirection = (last > 0 ? sort.slice(last + 1) : "desc") as "asc" | "desc";
  const params: ListingSearchParams = {
    sort: `${sortBy},${sortDirection}`,
    sortBy,
    sortDirection
  };

  if (appliedFilters.brand.trim()) params.brand = appliedFilters.brand.trim();
  if (appliedFilters.model.trim()) params.model = appliedFilters.model.trim();
  if (appliedFilters.minPrice !== "" && !Number.isNaN(Number(appliedFilters.minPrice))) {
    params.minPrice = Number(appliedFilters.minPrice);
  }
  if (appliedFilters.maxPrice !== "" && !Number.isNaN(Number(appliedFilters.maxPrice))) {
    params.maxPrice = Number(appliedFilters.maxPrice);
  }
  if (appliedFilters.minYear !== "" && !Number.isNaN(Number(appliedFilters.minYear))) {
    params.minYear = Number(appliedFilters.minYear);
  }
  if (appliedFilters.maxYear !== "" && !Number.isNaN(Number(appliedFilters.maxYear))) {
    params.maxYear = Number(appliedFilters.maxYear);
  }
  if (appliedFilters.minMileage !== "" && !Number.isNaN(Number(appliedFilters.minMileage))) {
    params.minMileage = Number(appliedFilters.minMileage);
  }
  if (appliedFilters.maxMileage !== "" && !Number.isNaN(Number(appliedFilters.maxMileage))) {
    params.maxMileage = Number(appliedFilters.maxMileage);
  }
  if (appliedFilters.fuelType) params.fuelType = appliedFilters.fuelType;

  return { params, hasSearchFilters: hasAnyFilter(appliedFilters) };
}

function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftFilters, setDraftFilters] = useState<SearchFilterValues>(() => filtersFromSearchParams(searchParams));
  const [appliedFilters, setAppliedFilters] = useState<SearchFilterValues>(() => filtersFromSearchParams(searchParams));
  const [sort, setSort] = useState("price_asc");
  const [listings, setListings] = useState<ListingSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = filtersFromSearchParams(searchParams);

    setDraftFilters(fromUrl);
    setAppliedFilters(fromUrl);
  }, [searchParams]);

  const { params: requestParams, hasSearchFilters } = useMemo(
    () => buildRequestParams(appliedFilters, sort),
    [appliedFilters, sort]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const data = hasSearchFilters
          ? await listingsApi.getListings(requestParams)
          : await listingsApi.getListings({
              sort: requestParams.sort,
              sortBy: requestParams.sortBy,
              sortDirection: requestParams.sortDirection
            });

        if (cancelled) {
          return;
        }
        setListings(data);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const parsed = parseApiError(loadError, "A hírdetések betöltése sikertelen.");
        setError(parsed.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchListings();

    return () => {
      cancelled = true;
    };
  }, [requestParams, hasSearchFilters]);

  function applyFilters() {
    setAppliedFilters(draftFilters);
    const params = new URLSearchParams();
    Object.entries(draftFilters).forEach(([key, value]) => {
      if (value.trim() !== "") {
        params.set(key, value.trim());
      }
    });
    setSearchParams(params);
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Hírdetések</h1>
          <p className="text-sm text-zinc-100 sm:text-base">
            A teljes kínálatot itt szűrheted. A főoldalon csak a legutóbbiak látszanak röviden.
          </p>
        </div>
      </header>

      <SearchFilters
        values={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        isSubmitting={loading}
      />

      <SortBar value={sort} onChange={setSort} resultCount={listings.length} />

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <ListingGrid listings={listings} loading={loading} />
    </section>
  );
}

export default ListingsPage;
