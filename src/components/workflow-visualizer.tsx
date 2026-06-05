
"use client"

import { Search, Notebook, CalendarDays, FileText, ShieldCheck, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const agents = [
  { name: "Research", icon: Search },
  { name: "Notes", icon: Notebook },
  { name: "Schedule", icon: CalendarDays },
  { name: "Summary", icon: FileText },
  { name: "Guardian", icon: ShieldCheck },
]

export function WorkflowVisualizer() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-12 px-4 overflow-hidden">
      {agents.map((agent, index) => (
        <div key={agent.name} className="flex items-center gap-4 md:gap-8 group">
          <div className="flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center glass-card border-primary/20",
              "group-hover:neon-border group-hover:scale-110 transition-all duration-500",
              "relative"
            )}>
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all" />
              <agent.icon className="w-8 h-8 text-primary relative z-10" />
            </div>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              {agent.name}
            </span>
          </div>
          {index < agents.length - 1 && (
            <div className="hidden md:flex items-center animate-fade-in-up" style={{ animationDelay: `${index * 150 + 75}ms` }}>
              <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-secondary/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/50 w-full animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
