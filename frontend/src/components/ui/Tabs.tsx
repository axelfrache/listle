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
    <div className={cn("grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3", className)}>
      {items.map((item) => {
        const active = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "w-full border-2 border-black px-3 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition sm:w-auto sm:min-w-28 sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.18em]",
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
