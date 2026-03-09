import type { ReactNode } from "react"

import { Badge } from "@/components/ui/Badge"

interface SectionIntroProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  action,
}: SectionIntroProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-4">
        <Badge tone="accent">{eyebrow}</Badge>
        <div className="space-y-2">
          <h1 className="font-head text-3xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl sm:tracking-[0.1em]">
            {title}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="w-full md:w-auto">{action}</div> : null}
    </div>
  )
}
