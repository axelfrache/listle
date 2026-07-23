export function Loader() {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 animate-bounce border-2 border-border bg-primary" />
      <span className="size-3 animate-bounce border-2 border-border bg-highlight [animation-delay:120ms]" />
      <span className="size-3 animate-bounce border-2 border-border bg-accent [animation-delay:240ms]" />
    </div>
  )
}
