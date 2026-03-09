import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const styles = {
  neutral: "bg-white text-black",
  accent: "bg-[#ffe45e] text-black",
  success: "bg-[#68f2a3] text-black",
  danger: "bg-[#ff7a59] text-black",
  dark: "bg-black text-white",
} as const

type BadgeTone = keyof typeof styles

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BadgeTone
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]",
        styles[tone],
        className,
      )}
      {...props}
    />
  )
}
