import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Az oldal nem található</h1>
      <p className="mt-3 text-slate-600">A keresett oldal nem létezik.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
        Vissza a főoldalra
      </Link>
    </section>
  );
}

export default NotFoundPage;