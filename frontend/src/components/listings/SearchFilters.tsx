import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { listingsApi } from "@/api/listingsApi";
import { VEHICLE_YEAR_MAX, VEHICLE_YEAR_MIN } from "@/constants/vehicleFilter";
import { parseApiError } from "@/utils/apiError";

export interface SearchFilterValues {
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  minMileage: string;
  maxMileage: string;
  fuelType: string;
}

interface SearchFiltersProps {
  values: SearchFilterValues;
  onChange: (next: SearchFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

function clampYearString(raw: string, fallback: string): string {
  if (raw === "") return raw;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return fallback;
  return String(Math.min(VEHICLE_YEAR_MAX, Math.max(VEHICLE_YEAR_MIN, n)));
}

function SearchFilters({ values, onChange, onApply, onReset, isSubmitting = false }: SearchFiltersProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBrandsError(null);
      try {
        const list = await listingsApi.getBrands();
        if (!cancelled) {
          setBrands([...list].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })));
        }
      } catch (e) {
        if (!cancelled) {
          const p = parseApiError(e, "Nem sikerült betölteni a márkákat.");
          setBrandsError(p.message);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key: keyof SearchFilterValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <section className="card-base p-4 sm:p-6">
      <h2 className="font-heading text-lg font-bold text-slate-900">Keresési szűrők</h2>
      <p className="mt-0.5 text-sm text-slate-500">
        Válassz márkát, írd be a modellt, ha kell, és add meg a tartományokat, majd alkalmazd.
      </p>
      {brandsError ? (
        <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{brandsError}</p>
      ) : null}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 sm:col-span-1">
          <label htmlFor="filter-brand" className="mb-1 block text-xs font-semibold text-slate-600">
            Márka
          </label>
          <select
            id="filter-brand"
            className="input-base"
            value={values.brand}
            onChange={(e) => update("brand", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Minden márka</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="filter-model" className="mb-1 block text-xs font-semibold text-slate-600">
            Modell
          </label>
          <input
            id="filter-model"
            className="input-base"
            placeholder="pl. 320d, Octavia"
            value={values.model}
            onChange={(e) => update("model", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="min-price" className="mb-1 block text-xs font-semibold text-slate-600">
            Min. ár (HUF)
          </label>
          <input
            id="min-price"
            className="input-base"
            type="number"
            min={0}
            placeholder="pl. 500000"
            value={values.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="max-price" className="mb-1 block text-xs font-semibold text-slate-600">
            Max. ár (HUF)
          </label>
          <input
            id="max-price"
            className="input-base"
            type="number"
            min={0}
            placeholder="pl. 5000000"
            value={values.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="min-year" className="mb-1 block text-xs font-semibold text-slate-600">
            Min. évjárat ({VEHICLE_YEAR_MIN} – {VEHICLE_YEAR_MAX})
          </label>
          <input
            id="min-year"
            className="input-base"
            type="number"
            min={VEHICLE_YEAR_MIN}
            max={VEHICLE_YEAR_MAX}
            placeholder="pl. 2015"
            value={values.minYear}
            onChange={(e) => update("minYear", e.target.value)}
            onBlur={(e) => {
              const v = e.currentTarget.value;
              if (v === "") return;
              update("minYear", clampYearString(v, String(VEHICLE_YEAR_MIN)));
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="max-year" className="mb-1 block text-xs font-semibold text-slate-600">
            Max. évjárat ({VEHICLE_YEAR_MIN} – {VEHICLE_YEAR_MAX})
          </label>
          <input
            id="max-year"
            className="input-base"
            type="number"
            min={VEHICLE_YEAR_MIN}
            max={VEHICLE_YEAR_MAX}
            placeholder="pl. 2024"
            value={values.maxYear}
            onChange={(e) => update("maxYear", e.target.value)}
            onBlur={(e) => {
              const v = e.currentTarget.value;
              if (v === "") return;
              update("maxYear", clampYearString(v, String(VEHICLE_YEAR_MAX)));
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="min-mileage" className="mb-1 block text-xs font-semibold text-slate-600">
            Min. futásteljesítmény (km)
          </label>
          <input
            id="min-mileage"
            className="input-base"
            type="number"
            min={0}
            placeholder="0"
            value={values.minMileage}
            onChange={(e) => update("minMileage", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="max-mileage" className="mb-1 block text-xs font-semibold text-slate-600">
            Max. futásteljesítmény (km)
          </label>
          <input
            id="max-mileage"
            className="input-base"
            type="number"
            min={0}
            placeholder="pl. 200000"
            value={values.maxMileage}
            onChange={(e) => update("maxMileage", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="fuel-type" className="mb-1 block text-xs font-semibold text-slate-600">
            Üzemanyag
          </label>
          <select
            id="fuel-type"
            className="input-base"
            value={values.fuelType}
            onChange={(e) => update("fuelType", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Bármely</option>
            <option value="Petrol">Benzin</option>
            <option value="Diesel">Dízel</option>
            <option value="Hybrid">Hibrid</option>
            <option value="Electric">Villany</option>
            <option value="LPG">LPG</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onReset} disabled={isSubmitting} type="button">
          Törlés
        </Button>
        <Button variant="primary" onClick={onApply} disabled={isSubmitting} type="button">
          {isSubmitting ? "Keresés…" : "Szűrők alkalmazása"}
        </Button>
      </div>
    </section>
  );
}

export default SearchFilters;
