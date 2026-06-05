"use client"

import { useEffect, useState } from "react"
import { Smartphone, Laptop, Zap, Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function OfficeKitSync({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Phone active
      setTimeout(() => setStep(2), 2000), // Office Kit sync
      setTimeout(() => setStep(3), 3500), // Laptop active
      setTimeout(() => onComplete(), 5000), // Navigate
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center gap-12 md:gap-24 mb-12">
        {/* Phone */}
        <div className={cn(
          "relative flex flex-col items-center gap-4 transition-all duration-700",
          step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="w-16 h-28 rounded-2xl border-2 border-primary/50 bg-black/40 flex items-center justify-center relative overflow-hidden">
            <Smartphone className="w-8 h-8 text-primary" />
            <div className="absolute inset-x-0 top-2 h-1 w-8 bg-primary/20 rounded-full" />
            {step === 1 && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Phone Input</span>
        </div>

        {/* Sync Line */}
        <div className="relative flex items-center h-1 w-24 md:w-48 bg-white/5 rounded-full overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-[1.5s] ease-in-out",
            step >= 2 ? "translate-x-0" : "-translate-x-full"
          )} />
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 -top-8 transition-all duration-500",
            step === 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50 flex items-center gap-2">
              <Zap className="w-3 h-3 text-secondary animate-pulse" />
              <span className="text-[10px] font-bold text-secondary">Office Kit Sync</span>
            </div>
          </div>
        </div>

        {/* Laptop */}
        <div className={cn(
          "relative flex flex-col items-center gap-4 transition-all duration-700",
          step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="w-32 h-20 rounded-lg border-2 border-secondary/50 bg-black/40 flex items-center justify-center relative">
            <Laptop className="w-10 h-10 text-secondary" />
            <div className="absolute -bottom-2 w-36 h-1 bg-white/10 rounded-full" />
            {step === 3 && <div className="absolute inset-0 bg-secondary/10 animate-pulse" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Laptop Dashboard</span>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-2xl font-headline font-bold text-gradient">
          {step < 2 ? "Capturing Intent..." : step < 3 ? "Synchronizing Context..." : "Orchestrating Workspace..."}
        </h2>
        <p className="text-muted-foreground text-sm">
          Transitioning your study goal from mobile thought to desktop execution through the Office Kit bridge.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </div>
      </div>
    </div>
  )
}
