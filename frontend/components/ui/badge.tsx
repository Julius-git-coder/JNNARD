import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "completed" | "onhold" | "inprogress"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {

    const variants = {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-foreground",
        completed: "border-transparent bg-green-100 text-green-700 hover:bg-green-100/80",
        onhold: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80",
        inprogress: "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-100/80",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
