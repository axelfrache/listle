import { Link } from "react-router-dom"

export function LogoMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 sm:gap-3">
      <img
        src="/logo.png"
        alt="Word Clash"
        className="h-10 w-10 border-2 border-black bg-[#ffe45e] object-cover shadow-[4px_4px_0_0_#000] sm:h-12 sm:w-12 sm:shadow-[6px_6px_0_0_#000]"
      />
      <div>
        <div className="font-head text-xl uppercase tracking-[0.14em] text-white sm:text-2xl sm:tracking-[0.18em]">
          Word Clash
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-[0.22em]">
          Le sprint quotidien des mots
        </div>
      </div>
    </Link>
  )
}
