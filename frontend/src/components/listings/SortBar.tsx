interface SortBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

function SortBar({ value, onChange, resultCount }: SortBarProps) {
  return (
    <div className="card-base flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
      <p className="text-sm text-slate-600">
        <span className="font-heading text-lg font-extrabold tabular-nums text-slate-900">{resultCount}</span>
        <span className="ml-1.5 font-medium"> találat</span>
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <label htmlFor="sort" className="text-sm font-medium text-slate-600">
          Rendezés
        </label>
        <select id="sort" className="input-base w-full min-w-0 sm:w-56" value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="price_asc">Ár: növekvő</option>
          <option value="price_desc">Ár: csökkenő</option>
          <option value="manufactureYear_desc">Évjárat: legújabb</option>
          <option value="mileage_asc">Futás: legkevesebb</option>
        </select>
      </div>
    </div>
  );
}

export default SortBar;