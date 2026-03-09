import { forwardRef, type InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-14 w-full border-2 border-black bg-white px-4 font-sans text-base text-black shadow-[6px_6px_0_0_#000] outline-none transition focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-[3px_3px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"
