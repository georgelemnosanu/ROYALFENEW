import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-black/60 border-2 border-[#FFD700] text-[#FFD700] shadow-lg hover:shadow-[#FFD700]/25 hover:bg-[#FFD700] hover:text-black backdrop-blur-sm",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-red-500/25 hover:from-red-500 hover:to-red-400",
        outline:
          "border-2 border-[#FFD700]/60 bg-transparent text-[#FFD700] shadow-sm hover:bg-[#FFD700]/10 hover:border-[#FFD700] hover:text-[#FFD700] backdrop-blur-sm",
        secondary:
          "bg-gradient-to-r from-gray-800 to-gray-700 text-[#FFD700] shadow-sm hover:from-gray-700 hover:to-gray-600 border border-[#FFD700]/20",
        ghost: "text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700] backdrop-blur-sm",
        link: "text-[#FFD700] underline-offset-4 hover:underline hover:text-[#FFD700]/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
