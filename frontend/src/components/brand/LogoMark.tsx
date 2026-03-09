import { Link } from "react-router-dom"

export function LogoMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 sm:gap-3">
      <div className="grid h-10 w-10 place-items-center border-2 border-black bg-[#ffe45e] font-head text-xl text-black shadow-[4px_4px_0_0_#000] sm:h-12 sm:w-12 sm:text-2xl sm:shadow-[6px_6px_0_0_#000]">
        L
      </div>
      <div>
        <div className="font-head text-xl uppercase tracking-[0.14em] text-white sm:text-2xl sm:tracking-[0.18em]">
          Listle
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-[0.22em]">
          Le sprint quotidien des mots
        </div>
      </div>
    </Link>
  )
}
