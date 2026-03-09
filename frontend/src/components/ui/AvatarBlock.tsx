interface AvatarBlockProps {
  letters: string
  size?: "sm" | "lg"
}

export function AvatarBlock({ letters, size = "sm" }: AvatarBlockProps) {
  return (
    <div
      className={`grid place-items-center border-2 border-black bg-[#68f2a3] font-head text-black shadow-[6px_6px_0_0_#000] ${
        size === "lg" ? "h-24 w-24 text-3xl" : "h-12 w-12 text-lg"
      }`}
    >
      {letters}
    </div>
  )
}
