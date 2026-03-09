interface MeterBarProps {
  value: number
  max?: number
  tone?: "yellow" | "green" | "orange"
}

const tones = {
  yellow: "bg-[#ffe45e]",
  green: "bg-[#68f2a3]",
  orange: "bg-[#ff7a59]",
}

export function MeterBar({ value, max = 100, tone = "yellow" }: MeterBarProps) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`

  return (
    <div className="h-4 w-full border-2 border-black bg-white">
      <div className={`h-full border-r-2 border-black ${tones[tone]}`} style={{ width }} />
    </div>
  )
}
