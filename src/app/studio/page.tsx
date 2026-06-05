"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Search, 
  Notebook, 
  CalendarDays, 
  FileText, 
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ExternalLink,
  LayoutDashboard,
  AlertTriangle,
  Flame,
  Clock,
  Zap,
  Monitor
} from "lucide-react"
import { researchAgentResourceGeneration, type ResearchAgentResourceGenerationOutput } from "@/ai/flows/research-agent-resource-generation"
import { generateNotesTopics, type NotesAgentTopicGenerationOutput } from "@/ai/flows/notes-agent-topic-generation"
import { generateStudyPlan, type ScheduleAgentStudyPlanGenerationOutput } from "@/ai/flows/schedule-agent-study-plan-generation"
import { generateRevisionSummary, type SummaryAgentRevisionSummaryGenerationOutput } from "@/ai/flows/summary-agent-revision-summary-generation"
import { generateFocusGuardianSuggestions, type FocusGuardianSuggestionGenerationOutput } from "@/ai/flows/focus-guardian-suggestion-generation"
import { cn } from "@/lib/utils"

function StudioContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const studyGoal = searchParams.get('goal') || "Artificial Intelligence"
  
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const [results, setResults] = useState<{
    research?: ResearchAgentResourceGenerationOutput
    notes?: NotesAgentTopicGenerationOutput
    schedule?: ScheduleAgentStudyPlanGenerationOutput
    summary?: SummaryAgentRevisionSummaryGenerationOutput
    guardian?: FocusGuardianSuggestionGenerationOutput
  }>({})

  const steps = [
    { id: 'research', label: 'Researching Resources', icon: Search, action: () => researchAgentResourceGeneration({ studyGoal }) },
    { id: 'notes', label: 'Extracting Note Topics', icon: Notebook, action: () => generateNotesTopics({ studyGoal }) },
    { id: 'schedule', label: 'Structuring Study Plan', icon: CalendarDays, action: () => generateStudyPlan({ studyGoal }) },
    { id: 'summary', label: 'Generating Summary', icon: FileText, action: () => generateRevisionSummary({ studyGoal }) },
    { id: 'guardian', label: 'Calculating Focus Metrics', icon: ShieldCheck, action: () => generateFocusGuardianSuggestions({ studyGoal }) },
  ]

  useEffect(() => {
    const runAgents = async () => {
      for (let i = 0; i < steps.length; i++) {
        setActiveStep(i)
        setProgress(((i) / steps.length) * 100)
        
        try {
          const res = await steps[i].action()
          setResults(prev => ({ ...prev, [steps[i].id]: res }))
        } catch (error) {
          console.error(`Error in ${steps[i].id}:`, error)
        }
        
        if (i === steps.length - 1) {
          setProgress(100)
          setActiveStep(steps.length)
        }
      }
    }
    runAgents()
  }, [])

  const focusScore = results.guardian?.focusScore || 0
  const isCriticalFocus = results.guardian && focusScore < 60

  return (
    <div className="min-h-screen bg-[#020202] text-foreground font-body">
      {/* OS Style Top Bar */}
      <div className="h-10 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Command Center v2.5</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Monitor className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-mono text-primary">iQOO PRODUCTIVITY MODE: {isCriticalFocus ? "ALERT" : "STABLE"}</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/50">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-40px)]">
        {/* Sidebar - Agent Pipeline */}
        <aside className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-8">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')} 
              className="mb-8 text-muted-foreground hover:text-primary -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Exit Dashboard
            </Button>
            
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-6">Orchestration</h3>
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isComplete = idx < activeStep || (idx === steps.length - 1 && progress === 100)
                const isProcessing = idx === activeStep && progress < 100
                return (
                  <div key={step.id} className="flex items-center gap-3 group">
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center transition-all duration-500",
                      isComplete ? "bg-primary/20 text-primary" : 
                      isProcessing ? "bg-secondary/20 text-secondary animate-pulse" : "bg-white/5 text-muted-foreground/50"
                    )}>
                      {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <step.icon className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium transition-colors",
                      isComplete ? "text-foreground" : isProcessing ? "text-secondary" : "text-muted-foreground/40"
                    )}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</span>
                <span className="text-primary font-mono text-xs">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1 bg-white/5" />
            </div>
            <div className="text-[9px] text-center text-muted-foreground/40">
              Active Session: {studyGoal}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Top Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
              <div>
                <h1 className="text-4xl font-headline font-bold tracking-tight mb-2">Workspace Dashboard</h1>
                <p className="text-muted-foreground">Generated intelligence for <span className="text-primary italic font-medium">{studyGoal}</span></p>
              </div>
              
              {results.guardian && (
                <div className="flex gap-4">
                  <GlassCard className={cn(
                    "p-4 min-w-[160px] border-white/5",
                    isCriticalFocus && "border-destructive/30 bg-destructive/5 neon-border shadow-destructive/10"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Focus Score</span>
                      <ShieldCheck className={cn("w-4 h-4", isCriticalFocus ? "text-destructive" : "text-primary")} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={cn("text-3xl font-mono font-bold", isCriticalFocus ? "text-destructive" : "text-primary")}>
                        {focusScore}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>

            {/* iQOO Productivity Mode - Critical Alert */}
            {isCriticalFocus && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 neon-border shadow-lg animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-headline font-bold">iQOO Productivity Mode: CRITICAL WARNING</AlertTitle>
                <AlertDescription className="text-sm opacity-90">
                  Focus potential is below threshold (60%). Distraction probability is high. 
                  Recommended: Initialize 25-minute Pomodoro Lock immediately.
                </AlertDescription>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" variant="destructive" className="font-bold">Start Focus Lock</Button>
                  <Button size="sm" variant="outline" className="border-destructive/30 hover:bg-destructive/20">Block Distractions</Button>
                </div>
              </Alert>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Knowledge Base */}
              <div className="space-y-8">
                {/* Notes Topics */}
                {results.notes && (
                  <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                      <Notebook className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-headline font-bold">Extracted Concepts</h2>
                    </div>
                    <GlassCard className="p-6 border-white/5 space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {results.notes.notesTopics.map((topic, i) => (
                          <div key={i} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                            <span className="text-sm font-medium">{topic}</span>
                            <CheckCircle2 className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Summary */}
                {results.summary && (
                  <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-headline font-bold">Executive Summary</h2>
                    </div>
                    <GlassCard className="p-8 border-white/5 leading-relaxed text-muted-foreground relative overflow-hidden" gradient>
                      <div className="absolute top-0 right-0 p-4">
                        <FileText className="w-24 h-24 text-primary/5 -mr-8 -mt-8" />
                      </div>
                      <div className="prose prose-invert max-w-none text-sm">
                        {results.summary.revisionSummary.split('\n').map((para, i) => (
                          <p key={i} className="mb-4">{para}</p>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                )}
              </div>

              {/* Right Column: Execution & Planning */}
              <div className="space-y-8">
                {/* Schedule */}
                {results.schedule && (
                  <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-headline font-bold">7-Day Roadmap</h2>
                    </div>
                    <div className="space-y-3">
                      {results.schedule.map((dayPlan, i) => (
                        <div key={i} className="group flex items-stretch gap-4">
                          <div className="w-14 py-4 flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">DAY</span>
                            <span className="text-xl font-mono font-bold">{i + 1}</span>
                          </div>
                          <GlassCard className="flex-1 p-5 border-white/5 group-hover:neon-border transition-all">
                            <h4 className="font-bold text-sm mb-2">{dayPlan.theme}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {dayPlan.activities.slice(0, 2).map((act, j) => (
                                <div key={j} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-secondary" /> {act}
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Research */}
                {results.research && (
                  <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-headline font-bold">Verified Sources</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {results.research.researchResources.map((res, i) => (
                        <GlassCard key={i} className="p-4 border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors" gradient>
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-sm truncate">{res.title}</h4>
                            <p className="text-[10px] text-muted-foreground truncate">{res.url}</p>
                          </div>
                          <a href={res.url} target="_blank" className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Focus Guardian Suggestions */}
            {results.guardian && (
              <div className="animate-fade-in-up pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <h2 className="text-xl font-headline font-bold">Productivity Guard</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.guardian.suggestions.map((suggestion, i) => (
                    <GlassCard key={i} className="p-6 border-secondary/10 bg-secondary/5" gradient>
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                        <Zap className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-xs font-medium leading-relaxed">{suggestion}</p>
                    </GlassCard>
                  ))}
                </div>
                {results.guardian.distractionWarnings && (
                  <div className="mt-8 flex flex-wrap gap-4">
                    {results.guardian.distractionWarnings.map((warning, i) => (
                      <div key={i} className="px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Processing Indicator for Initial Load */}
            {activeStep < steps.length && (
              <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-2">Orchestrating Workspace</h3>
                <p className="text-muted-foreground text-sm">
                  Active Agent: <span className="text-primary font-bold">{steps[activeStep].label}</span>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <StudioContent />
    </Suspense>
  )
}
