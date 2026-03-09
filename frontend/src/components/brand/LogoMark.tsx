import { Link } from "react-router-dom"

export function LogoMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center border-2 border-black bg-[#ffe45e] font-head text-2xl text-black shadow-[6px_6px_0_0_#000]">
        L
      </div>
      <div>
        <div className="font-head text-2xl uppercase tracking-[0.18em] text-white">
          Listle
        </div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
          Daily word sprint
        </div>
      </div>
    </Link>
  )
}
