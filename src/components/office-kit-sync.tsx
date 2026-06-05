"use client"

import { useEffect, useState } from "react"
import { Smartphone, Laptop, Zap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function OfficeKitSync({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    // 2-second synchronization sequence as requested
    const timers = [
      setTimeout(() => setStep(1), 400),   // Phone active
      setTimeout(() => setStep(2), 900),   // Office Kit sync
      setTimeout(() => setStep(3), 1500),  // Laptop active
      setTimeout(() => onComplete(), 2200), // Navigate
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/5 animate-pulse-slow pointer-events-none" />
      
      <div className="relative flex items-center justify-center gap-12 md:gap-24 mb-12">
        {/* Phone */}
        <div className={cn(
          "relative flex flex-col items-center gap-4 transition-all duration-500",
          step >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"
        )}>
          <div className={cn(
            "w-16 h-28 rounded-2xl border-2 border-primary/50 bg-black/40 flex items-center justify-center relative overflow-hidden transition-all duration-300",
            step === 1 && "shadow-[0_0_30px_rgba(168,85,247,0.4)] border-primary"
          )}>
            <Smartphone className={cn("w-8 h-8 transition-colors", step >= 1 ? "text-primary" : "text-muted-foreground")} />
            <div className="absolute inset-x-0 top-2 h-1 w-8 bg-primary/20 rounded-full" />
            {step >= 1 && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Phone Input</span>
        </div>

        {/* Sync Line */}
        <div className="relative flex items-center h-1 w-24 md:w-48 bg-white/5 rounded-full overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary via-white to-secondary transition-transform duration-[1s] ease-in-out",
            step >= 2 ? "translate-x-0" : "-translate-x-full"
          )} />
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 -top-10 transition-all duration-500",
            step === 2 ? "opacity-100 scale-110" : "opacity-0 scale-50"
          )}>
            <div className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/50 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Zap className="w-3 h-3 text-white animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Syncing Intelligence</span>
            </div>
          </div>
        </div>

        {/* Laptop */}
        <div className={cn(
          "relative flex flex-col items-center gap-4 transition-all duration-500",
          step >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"
        )}>
          <div className={cn(
            "w-32 h-20 rounded-lg border-2 border-secondary/50 bg-black/40 flex items-center justify-center relative transition-all duration-300",
            step === 3 && "shadow-[0_0_40px_rgba(129,140,248,0.5)] border-secondary"
          )}>
            <Laptop className={cn("w-10 h-10 transition-colors", step >= 3 ? "text-secondary" : "text-muted-foreground")} />
            <div className="absolute -bottom-2 w-36 h-1 bg-white/10 rounded-full" />
            {step >= 3 && <div className="absolute inset-0 bg-secondary/10 animate-pulse" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/70">Workspace Engine</span>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-sm animate-fade-in-up">
        <h2 className="text-2xl font-headline font-bold text-gradient">
          {step < 2 ? "Initializing Connection" : step < 3 ? "Uploading Goal Matrix" : "Deploying Dashboard"}
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed opacity-60">
          Handshaking between devices via the Office Kit bridge. 
          Encrypting study intent for multi-agent synthesis.
        </p>
        <div className="flex items-center justify-center gap-3 text-primary font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
          <Loader2 className="w-3 h-3 animate-spin" />
          Protocol Stable
        </div>
      </div>
    </div>
  )
}
