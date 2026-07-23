interface AvatarBlockProps {
  letters: string
  size?: "sm" | "lg"
}

export function AvatarBlock({ letters, size = "sm" }: AvatarBlockProps) {
  return (
    <div
      className={`grid place-items-center border-2 border-border bg-accent font-head text-black shadow ${
        size === "lg" ? "h-24 w-24 text-3xl" : "h-12 w-12 text-lg"
      }`}
    >
      {letters}
    </div>
  )
}
