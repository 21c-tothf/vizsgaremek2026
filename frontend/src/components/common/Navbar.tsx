import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
      isActive ? "bg-zinc-800/90 text-white shadow-sm ring-1 ring-zinc-700/80" : "text-white/85 hover:bg-zinc-900/70 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 shadow-sm shadow-black/30 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/70">
      <Container className="py-2.5">
        <div className="flex min-h-12 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-heading text-xl font-extrabold tracking-tight text-white"
            >
              EgyszerűAutó
            </Link>

            <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
              <NavLink to="/" className={navClass} end>
                Főoldal
              </NavLink>
              <NavLink to="/listings" className={navClass}>
                Hirdetések
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/create-listing" className={navClass}>
                    Hirdetésfeladás
                  </NavLink>
                  <NavLink to="/my-listings" className={navClass}>
                    Hirdetéseim
                  </NavLink>
                  <NavLink to="/favorites" className={navClass}>
                    Kedvencek
                  </NavLink>
                  <NavLink to="/dashboard" className={navClass}>
                    Vezérlőpult
                  </NavLink>
                  {isAdmin ? (
                    <NavLink to="/admin" className={navClass}>
                      Admin
                    </NavLink>
                  ) : null}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 sm:inline">
                  {user?.displayName}
                </Link>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Kijelentkezés
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-base btn-ghost btn-sm rounded-full text-white hover:text-white">
                  Bejelentkezés
                </Link>
                <Link to="/register" className="btn-base btn-primary btn-sm rounded-full">
                  Regisztráció
                </Link>
              </>
            )}
          </div>
        </div>

        <nav
          className="flex flex-wrap gap-1.5 border-t border-slate-200/50 pt-3 md:hidden"
          aria-label="Mobile navigation"
        >
            <NavLink to="/" className={navClass} end>
              Főoldal
            </NavLink>
            <NavLink to="/listings" className={navClass}>
              Hirdetések
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/create-listing" className={navClass}>
                  Hirdetésfeladás
                </NavLink>
                <NavLink to="/my-listings" className={navClass}>
                  Hirdetéseim
                </NavLink>
                <NavLink to="/favorites" className={navClass}>
                  Kedvencek
                </NavLink>
                <NavLink to="/dashboard" className={navClass}>
                  Vezérlőpult
                </NavLink>
                {isAdmin ? (
                  <NavLink to="/admin" className={navClass}>
                    Admin
                  </NavLink>
                ) : null}
              </>
            )}
          </nav>
      </Container>
    </header>
  );
}

export default Navbar;