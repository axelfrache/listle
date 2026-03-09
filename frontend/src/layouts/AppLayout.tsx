import { Outlet } from "react-router-dom"

import { NavBar } from "@/components/brand/NavBar"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#10131d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,228,94,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(104,242,163,0.16),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.03)_0,_rgba(255,255,255,0.03)_1px,_transparent_1px,_transparent_24px)] bg-[length:auto,auto,24px_24px]" />
      <div className="relative">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
