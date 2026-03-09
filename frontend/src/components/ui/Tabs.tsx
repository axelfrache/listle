import { cn } from "@/lib/utils"

interface TabsProps<T extends string> {
  items: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map((item) => {
        const active = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "min-w-28 border-2 border-black px-4 py-3 text-sm font-black uppercase tracking-[0.18em] transition",
              active
                ? "bg-[#ffe45e] text-black shadow-[6px_6px_0_0_#000]"
                : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5",
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
