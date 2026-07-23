interface MeterBarProps {
  value: number
  max?: number
  tone?: "yellow" | "green" | "orange"
}

const tones = {
  yellow: "bg-primary",
  green: "bg-accent",
  orange: "bg-highlight",
}

export function MeterBar({ value, max = 100, tone = "yellow" }: MeterBarProps) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`

  return (
    <div className="h-4 w-full border-2 border-border bg-white">
      <div className={`h-full border-r-2 border-border ${tones[tone]}`} style={{ width }} />
    </div>
  )
}
