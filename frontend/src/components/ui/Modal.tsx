import type { ReactNode } from "react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"

interface ModalProps {
  open: boolean
  title: string
  description: string
  children: ReactNode
  actionLabel: string
  onAction: () => void
}

export function Modal({
  open,
  title,
  description,
  children,
  actionLabel,
  onAction,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-xl border-black bg-[#fff7d6] shadow-[12px_12px_0_0_#000]">
        <Card.Header className="gap-3 border-b-2 border-black bg-[#ffe45e]">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-black">
            Round Complete
          </div>
          <Card.Title className="text-3xl text-black">{title}</Card.Title>
          <Card.Description className="max-w-lg text-sm text-black/70">
            {description}
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6 p-5">{children}</Card.Content>
        <div className="flex justify-end border-t-2 border-black p-5">
          <Button size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </Card>
    </div>
  )
}
