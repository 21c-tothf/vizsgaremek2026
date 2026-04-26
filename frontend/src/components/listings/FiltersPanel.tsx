import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ListingFilters {
  query: string;
  minPrice: string;
  maxPrice: string;
  fuelType: string;
}

interface Props {
  onApply: (filters: ListingFilters) => void;
}

function FiltersPanel({ onApply }: Props) {
  const [filters, setFilters] = useState<ListingFilters>({
    query: "",
    minPrice: "",
    maxPrice: "",
    fuelType: ""
  });

  function updateField<K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card>
      <CardContent>
      <h2 className="mb-4 text-lg font-bold">Hirdetések szűrése</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Márka vagy modell"
          value={filters.query}
          onChange={(event) => updateField("query", event.target.value)}
          className="input-base"
        />
        <input
          type="number"
          placeholder="Min. ár"
          value={filters.minPrice}
          onChange={(event) => updateField("minPrice", event.target.value)}
          className="input-base"
        />
        <input
          type="number"
          placeholder="Max. ár"
          value={filters.maxPrice}
          onChange={(event) => updateField("maxPrice", event.target.value)}
          className="input-base"
        />
        <select
          value={filters.fuelType}
          onChange={(event) => updateField("fuelType", event.target.value)}
          className="input-base"
        >
          <option value="">Bármilyen üzemanyag</option>
          <option value="Petrol">Benzin</option>
          <option value="Diesel">Dízel</option>
          <option value="Hybrid">Hibrid</option>
          <option value="Electric">Elektromos</option>
        </select>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={() => onApply(filters)} variant="accent">
          Szűrők alkalmazása
        </Button>
      </div>
      </CardContent>
    </Card>
  );
}

export default FiltersPanel;