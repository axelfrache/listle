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
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function Modal({
  open,
  title,
  description,
  children,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-xl border-border bg-[#fff7d6] shadow-md sm:shadow-xl">
        <Card.Header className="gap-3 border-b-2 border-border bg-primary">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-black">
            Manche terminée
          </div>
          <Card.Title className="text-2xl text-black sm:text-3xl">{title}</Card.Title>
          <Card.Description className="max-w-lg text-sm text-black/70">
            {description}
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6 p-5">{children}</Card.Content>
        <div className="flex flex-col-reverse gap-3 border-t-2 border-border p-5 sm:flex-row sm:justify-end">
          {secondaryActionLabel && onSecondaryAction ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-border bg-white text-black hover:bg-[#f6f3ea] sm:w-auto"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </Card>
    </div>
  )
}
