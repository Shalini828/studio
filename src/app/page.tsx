"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { WorkflowVisualizer } from "@/components/workflow-visualizer"
import { OfficeKitSync } from "@/components/office-kit-sync"
import { 
  Sparkles, 
  Search, 
  Notebook, 
  CalendarDays, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Globe,
  Layers,
  Cpu
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function Home() {
  const [goal, setGoal] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (goal.trim()) {
      setIsSyncing(true)
    }
  }

  const onSyncComplete = () => {
    router.push(`/studio?goal=${encodeURIComponent(goal)}`)
  }

  const agentShowcase = [
    { name: "Research Agent", icon: Search, desc: "Scours academic sources & modern web for top-tier materials.", status: "Online" },
    { name: "Notes Agent", icon: Notebook, desc: "Synthesizes raw data into structured, high-legibility topics.", status: "Online" },
    { name: "Schedule Agent", icon: CalendarDays, desc: "Builds a precise 7-day roadmap tailored to your deadline.", status: "Online" },
    { name: "Summary Agent", icon: FileText, desc: "Condenses complex chapters into quick-revision bites.", status: "Online" },
    { name: "Focus Guardian", icon: ShieldCheck, desc: "Monitors cognitive load & suggests behavioral optimizations.", status: "Standby" },
  ]

  return (
    <div className="relative overflow-hidden">
      {isSyncing && <OfficeKitSync onComplete={onSyncComplete} />}
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border-primary/20 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">New: v2.5 Orchestration Engine Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-headline font-bold mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="text-gradient">StudyAgent</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-light text-muted-foreground mb-12 max-w-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Your phone <span className="text-primary italic">thinks.</span> Your laptop <span className="text-secondary italic">executes.</span>
        </p>

        <form 
          onSubmit={handleGenerate}
          className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="relative flex-1 group">
            <Input 
              placeholder="What do you want to study?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-16 px-6 text-lg rounded-[24px] bg-white/5 border-white/10 focus:border-primary/50 transition-all"
            />
            <div className="absolute inset-0 rounded-[24px] border border-primary/20 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
          </div>
          <Button 
            type="submit"
            className="h-16 px-10 rounded-[24px] bg-primary hover:bg-primary/90 text-lg font-bold transition-all shadow-lg shadow-primary/20"
          >
            Generate Plan <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>

        <div className="w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <WorkflowVisualizer />
        </div>
      </section>

      {/* Agents Showcase */}
      <section className="py-24 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">The Intelligent Collective</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Five specialized AI agents working in high-frequency coordination to accelerate your learning.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {agentShowcase.map((agent, i) => (
              <GlassCard key={agent.name} className="flex flex-col items-center text-center p-8 hover:scale-105 transition-transform" gradient>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <agent.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-headline font-bold mb-2">{agent.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{agent.desc}</p>
                <div className="mt-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/5 text-[10px] font-bold uppercase tracking-widest">
                  <span className={cn("w-2 h-2 rounded-full", agent.status === "Online" ? "bg-green-500 animate-pulse" : "bg-orange-500")} />
                  {agent.status}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 border-secondary/20">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Advanced Dashboard</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8 leading-tight">Neon Studio: Your Command Center.</h2>
            <div className="space-y-6">
              {[
                { title: "Live Synthesis", desc: "Watch agents fetch and filter data in real-time.", icon: Globe },
                { title: "Layered Processing", desc: "Each output is verified by a secondary 'cleaner' agent.", icon: Layers },
                { title: "Edge Performance", desc: "Sub-second response times via our proprietary API routes.", icon: Cpu }
              ].map((feat) => (
                <div key={feat.title} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 shrink-0 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <feat.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{feat.title}</h4>
                    <p className="text-muted-foreground">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
            <GlassCard className="p-2 border-white/5 aspect-video flex items-center justify-center overflow-hidden">
              <Image 
                src="https://picsum.photos/seed/dash1/1200/800"
                alt="Dashboard Preview"
                width={1200}
                height={800}
                className="rounded-[18px] w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-ai-hint="futuristic dashboard"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-2xl font-headline font-bold mb-4 tracking-tighter">StudyAgent<span className="text-primary">.</span></div>
          <p className="text-muted-foreground text-sm mb-8">© 2024 StudyAgent AI Platforms. Built for the future of education.</p>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
