
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gradient?: boolean
}

export function GlassCard({ children, className, gradient, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-[24px] p-6 transition-all duration-300 hover:neon-border group relative overflow-hidden",
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      )}
      {children}
    </div>
  )
}
