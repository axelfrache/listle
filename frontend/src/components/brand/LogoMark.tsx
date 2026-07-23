import { Link } from "react-router-dom"

export function LogoMark() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2 sm:gap-3">
      <img
        src="/icon-192.png"
        alt="DayDash"
        className="h-10 w-10 rounded-lg border-2 border-border object-cover shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-12 sm:w-12 sm:shadow"
      />
      <div className="leading-none">
        <div className="font-head text-xl uppercase tracking-[0.14em] text-white sm:text-2xl sm:tracking-[0.18em]">
          DayDash
        </div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-[0.22em]">
          Le sprint quotidien des mots
        </div>
      </div>
    </Link>
  )
}
