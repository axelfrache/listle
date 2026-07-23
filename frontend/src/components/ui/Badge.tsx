import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const styles = {
  neutral: "bg-white text-black",
  accent: "bg-primary text-black",
  success: "bg-accent text-black",
  danger: "bg-destructive text-black",
  dark: "bg-black text-white",
} as const

type BadgeTone = keyof typeof styles

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BadgeTone
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 border-2 border-border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] shadow-sm",
        styles[tone],
        className,
      )}
      {...props}
    />
  )
}
