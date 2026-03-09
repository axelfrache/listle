import { Link, NavLink } from "react-router-dom"

import { Button } from "@/components/retroui/Button"
import { LogoMark } from "@/components/brand/LogoMark"
import { cn } from "@/lib/utils"

const links = [
  { to: "/play", label: "Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/stats", label: "Stats" },
  { to: "/profile", label: "Profile" },
]

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-[#10131d]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <LogoMark />
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000] transition",
                  isActive
                    ? "bg-[#ffe45e] text-black"
                    : "bg-white text-black hover:-translate-y-0.5",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Button asChild variant="outline">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex" variant="secondary">
            <Link to="/register">Play today&apos;s round</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
