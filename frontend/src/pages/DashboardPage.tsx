import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-extrabold">Vezérlőpult</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-base p-5">
          <h2 className="font-bold text-black">Mentett kedvencek</h2>
          <p className="mt-2 text-sm text-slate-600">Összekötve a hitelesített kedvenc végpontokkal.</p>
          <Link to="/favorites" className="btn-base btn-primary btn-sm mt-3">
            Kedvencek megnyitása
          </Link>
        </div>
        <div className="card-base p-5">
          <h2 className="font-bold text-black">Hirdetéseim</h2>
          <p className="mt-2 text-sm text-slate-600">Hirdetések létrehozása, szerkesztése, törlése és képfeltöltés.</p>
          <Link to="/my-listings" className="btn-base btn-primary btn-sm mt-3">
            Hirdetéseim megnyitása
          </Link>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="font-bold text-black">Profil</h2>
        <p className="mt-2 text-sm text-slate-600">Fiókadatok áttekintése és frissítése.</p>
        <Link to="/profile" className="btn-base btn-primary btn-sm mt-3">
          Profil megnyitása
        </Link>
      </div>
    </section>
  );
}

export default DashboardPage;