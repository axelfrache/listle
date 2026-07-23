import { cn } from "@/lib/utils"

interface ErrorStateProps {
  message: string
  className?: string
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div className={cn("flex min-h-[50vh] items-center justify-center", className)}>
      <div className="border-2 border-border bg-white px-6 py-4 text-black shadow">{message}</div>
    </div>
  )
}
