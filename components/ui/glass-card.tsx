import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10",
        "rounded-3xl shadow-xl overflow-hidden",
        "before:absolute before:inset-0 before:z-[-1]",
        "before:bg-gradient-to-br before:from-white/30 before:to-white/10",
        "dark:before:from-white/10 dark:before:to-transparent",
        className,
      )}
    >
      {children}
    </div>
  )
}
