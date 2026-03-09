import { Menu, X } from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/retroui/Button"
import { LogoMark } from "@/components/brand/LogoMark"
import { clearAuthToken, isAuthenticated } from "@/lib/auth"
import { cn } from "@/lib/utils"

const links = [
  { to: "/play", label: "Jouer" },
  { to: "/leaderboard", label: "Classement" },
  { to: "/stats", label: "Statistiques" },
  { to: "/profile", label: "Profil" },
]

export function NavBar() {
  const navigate = useNavigate()
  const loggedIn = isAuthenticated()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    clearAuthToken()
    setMobileOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-[#10131d]/90 backdrop-blur">
      <div className="relative mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <LogoMark />
          <button
            type="button"
            className="inline-flex items-center justify-center border-2 border-black bg-white p-2 text-black shadow-[4px_4px_0_0_#000] md:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/profile">Mon profil</Link>
                </Button>
                <Button onClick={handleLogout} variant="secondary">
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild className="hidden lg:inline-flex" variant="secondary">
                  <Link to="/register">Créer un compte</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "border-2 border-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000] transition lg:px-4 lg:text-xs lg:tracking-[0.18em]",
                  isActive
                    ? "bg-[#ffe45e] text-black"
                    : "bg-white text-black hover:-translate-y-0.5",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {mobileOpen ? (
          <div className="md:hidden">
            <button
              type="button"
              className="fixed inset-0 z-30 bg-black/65"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu mobile"
            />
            <div className="absolute inset-x-0 top-full z-40 mt-3 max-h-[calc(100vh-7rem)] overflow-y-auto border-2 border-black bg-[#fff7d6] p-3 shadow-[8px_8px_0_0_#000]">
              <div className="grid grid-cols-1 gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "border-2 border-black px-3 py-3 text-center text-xs font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000]",
                        isActive ? "bg-[#ffe45e] text-black" : "bg-white text-black",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                {loggedIn ? (
                  <>
                    <Button asChild variant="outline" className="w-full border-black bg-white text-black">
                      <Link to="/profile" onClick={() => setMobileOpen(false)}>
                        Mon profil
                      </Link>
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={handleLogout}>
                      Se déconnecter
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full border-black bg-white text-black">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/register" onClick={() => setMobileOpen(false)}>
                        Créer un compte
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
