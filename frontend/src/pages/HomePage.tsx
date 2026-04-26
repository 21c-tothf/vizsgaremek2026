import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import ListingGrid from "@/components/listings/ListingGrid";
import SectionTitle from "@/components/ui/SectionTitle";
import { listingsApi } from "@/api/listingsApi";
import { useAuth } from "@/hooks/useAuth";
import type { ListingSummaryResponse } from "@/types/listings";
import { parseApiError } from "@/utils/apiError";
import { HOME_LISTINGS_LIMIT, VEHICLE_YEAR_MAX, VEHICLE_YEAR_MIN } from "@/constants/vehicleFilter";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [brands, setBrands] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [listings, setListings] = useState<ListingSummaryResponse[]>([]);
  const [visibleListingsCount, setVisibleListingsCount] = useState(HOME_LISTINGS_LIMIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listingsApi.getBrands();
        if (!cancelled) {
          setBrands([...list].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })));
        }
      } catch {
        if (!cancelled) setBrands([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function loadHomeListings() {
      setLoading(true);
      setError(null);
      try {
        const data = await listingsApi.getListings({
          size: 60,
          sort: "createdAt,desc",
          sortBy: "createdAt",
          sortDirection: "desc"
        });
        setListings(data.filter((item) => item.isActive !== false));
      } catch (loadError) {
        const parsed = parseApiError(loadError, "A hírdetések betöltése sikertelen.");
        setError(parsed.message);
      } finally {
        setLoading(false);
      }
    }

    void loadHomeListings();
  }, []);

  useEffect(() => {
    setVisibleListingsCount(HOME_LISTINGS_LIMIT);
  }, [listings]);

  const homeListings = useMemo(
    () => listings.slice(0, visibleListingsCount),
    [listings, visibleListingsCount]
  );

  function searchFromHero(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (brand.trim()) params.set("brand", brand.trim());
    if (model.trim()) params.set("model", model.trim());
    if (minPrice.trim() !== "") params.set("minPrice", minPrice.trim());
    if (maxPrice.trim() !== "") params.set("maxPrice", maxPrice.trim());
    if (minYear.trim() !== "") params.set("minYear", minYear.trim());
    if (maxYear.trim() !== "") params.set("maxYear", maxYear.trim());

    navigate(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="space-y-10 sm:space-y-12">
      <div className="card-base ring-1 ring-slate-200/40 sm:p-10 overflow-hidden p-6 shadow-card-lg">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-300/70 bg-gradient-to-r from-zinc-100 to-zinc-200/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-800 shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Megbízható piactér
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[2.75rem]">
              Találd meg a következő használt autódat magabiztossággal.
            </h1>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/listings" className="btn-base btn-primary btn-lg rounded-2xl">
                Összes hírdetés
              </Link>
              {!isAuthenticated ? (
                <Link to="/register" className="btn-base btn-secondary btn-lg rounded-2xl">
                  Regisztráció
                </Link>
              ) : null}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-700/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-6 text-white shadow-2xl shadow-black/30 ring-1 ring-zinc-600/40">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-zinc-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-zinc-600/20 blur-2xl" />
            <h2 className="relative text-2xl font-bold tracking-tight">Mit kapsz nálunk?</h2>
            <ul className="relative mt-4 space-y-3 text-sm leading-relaxed text-white/95">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                Átlátható kártyák, kiemelt ár
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                Márka, év, km, üzemanyag alapú szűrés a listázó oldalon
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                Kedvencek, üzenetek – a böngészéstől a kapcsolatfelvételig
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="card-base p-5 sm:p-7">
        <SectionTitle
          title="Gyors keresés"
          subtitle="Márkát legördülőből, modellt gépbe írva. A finomhangolás a hírdetések oldalán folytatható."
        />
        <form onSubmit={searchFromHero} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="min-w-0 sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Márka</label>
            <select className="input-base" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">— Minden márka —</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Modell</label>
            <input
              className="input-base"
              placeholder="pl. A4, Ceed"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Min. ár (HUF)</label>
            <input className="input-base" type="number" min={0} placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Max. ár (HUF)</label>
            <input className="input-base" type="number" min={0} placeholder="—" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Min. év ({VEHICLE_YEAR_MIN} – {VEHICLE_YEAR_MAX})
            </label>
            <input
              className="input-base"
              type="number"
              min={VEHICLE_YEAR_MIN}
              max={VEHICLE_YEAR_MAX}
              placeholder="pl. 2015"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Max. év ({VEHICLE_YEAR_MIN} – {VEHICLE_YEAR_MAX})
            </label>
            <input
              className="input-base"
              type="number"
              min={VEHICLE_YEAR_MIN}
              max={VEHICLE_YEAR_MAX}
              placeholder="pl. 2024"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-end sm:col-span-2">
            <Button type="submit" className="w-full">
              Hírdetésekre ugrás
            </Button>
          </div>
        </form>
      </section>

      {error ? <p className="rounded-2xl border border-red-100/80 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm">{error}</p> : null}

      <section className="space-y-4">
        <header>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Legutóbbi hirdetések
          </h2>
        </header>
        <ListingGrid
          listings={homeListings}
          loading={loading}
          emptyTitle="Még nincs hírdetés"
          emptyDescription="Ha megjelennek a beszúrt autók, itt a legutóbbiak fognak kikerülni."
        />
        {!loading && listings.length > homeListings.length ? (
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              className="btn-base btn-md border border-zinc-500 bg-transparent text-white hover:bg-transparent hover:text-white"
              onClick={() => setVisibleListingsCount((current) => current + HOME_LISTINGS_LIMIT)}
            >
              Mutass Többet
            </Button>
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="group card-base p-6 transition-shadow duration-300 hover:shadow-card-lg">
          <h3 className="font-heading text-xl font-bold text-slate-900">Eladnád a kocsidat?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Regisztrálj, és töltsd fel az adatokat és fényképeket.</p>
          {!isAuthenticated ? (
            <Link to="/register" className="btn-base btn-primary btn-md mt-5 w-full sm:w-auto">
              Kezdd el
            </Link>
          ) : (
            <Link to="/create-listing" className="btn-base btn-primary btn-md mt-5 w-full sm:w-auto">
              Hirdetés feladása
            </Link>
          )}
        </div>
        <div className="group card-base p-6 transition-shadow duration-300 hover:shadow-card-lg">
          <h3 className="font-heading text-xl font-bold text-slate-900">Egyszerűbben szeretnél hirdetést keresni?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">A szűrők segítenek a nagy kínálatban eligazodni.</p>
          <Link to="/listings" className="btn-base btn-primary btn-md mt-5 w-full sm:w-auto">
            Összes hírdetés
          </Link>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
