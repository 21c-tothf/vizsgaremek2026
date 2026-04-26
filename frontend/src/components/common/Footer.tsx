import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { useAuth } from "@/hooks/useAuth";

function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="mt-16 border-t border-zinc-800/70 bg-gradient-to-b from-zinc-950/80 to-black backdrop-blur-sm">
      <Container className="grid gap-8 py-10 text-sm text-white/85 md:grid-cols-3">
        <div>
          <p className="font-heading bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-base font-extrabold text-transparent">
            EgyszerűAutó Marketplace
          </p>
          <p className="mt-3 leading-relaxed">Prémium használtautó-keresés. Hasonlíts össze, szűrj, és találd meg a következő autódat átlátható felületen.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Felfedezés</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/listings" className="text-white/85 transition-colors hover:text-white">
                Legfrissebb hirdetések
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="text-white/85 transition-colors hover:text-white">
                Kedvencek
              </Link>
            </li>
            {!isAuthenticated ? (
              <li>
                <Link to="/register" className="text-white/85 transition-colors hover:text-white">
                  Fiók létrehozása
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Platform</p>
          <p className="mt-3 leading-relaxed">Mobilon, tableten és asztali gépen is reszponzív. Gyors betöltés és folyamatos böngészési élmény.</p>
        </div>
      </Container>
      <Container className="pb-10">
        <div className="mx-auto max-w-2xl rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Megbízhatóság</p>
          <p className="mt-1 text-sm text-white/90">
            Megbízható platform: valós hirdetések, átlátható adatok, biztonságosabb felhasználói élmény.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;