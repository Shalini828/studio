
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  ChevronDown,
  LayoutDashboard
} from "lucide-react"
import { researchAgentResourceGeneration, type ResearchAgentResourceGenerationOutput } from "@/ai/flows/research-agent-resource-generation"
import { generateNotesTopics, type NotesAgentTopicGenerationOutput } from "@/ai/flows/notes-agent-topic-generation"
import { generateStudyPlan, type ScheduleAgentStudyPlanGenerationOutput } from "@/ai/flows/schedule-agent-study-plan-generation"
import { generateRevisionSummary, type SummaryAgentRevisionSummaryGenerationOutput } from "@/ai/flows/summary-agent-revision-summary-generation"
import { generateFocusGuardianSuggestions, type FocusGuardianSuggestionGenerationOutput } from "@/ai/flows/focus-guardian-suggestion-generation"
import { cn } from "@/lib/utils"

type AgentState = 'idle' | 'processing' | 'complete'

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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-bold tracking-tight">Studio Workspace</h1>
            <p className="text-muted-foreground text-sm">Orchestrating agents for: <span className="text-primary italic font-medium">{studyGoal}</span></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall Progress</span>
            <span className="text-primary font-mono text-sm">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-48 h-1.5" />
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Status */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-4 border-white/5 sticky top-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Agent Pipeline</h3>
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isComplete = idx < activeStep || (idx === steps.length - 1 && progress === 100)
                const isProcessing = idx === activeStep && progress < 100
                return (
                  <div key={step.id} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                      isComplete ? "bg-primary/20 text-primary" : 
                      isProcessing ? "bg-secondary/20 text-secondary animate-pulse" : "bg-white/5 text-muted-foreground"
                    )}>
                      {isComplete ? <CheckCircle2 className="w-4 h-4" /> : 
                       isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isComplete ? "text-foreground" : isProcessing ? "text-secondary font-bold" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-9 space-y-8 pb-20">
          
          {/* Research Results */}
          {results.research && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-headline font-bold">Research Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.research.researchResources.map((res, i) => (
                  <GlassCard key={i} className="p-5 border-white/5 hover:bg-white/10 transition-colors" gradient>
                    <h4 className="font-bold mb-2 line-clamp-1">{res.title}</h4>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{res.description}</p>
                    <a 
                      href={res.url} 
                      target="_blank" 
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Visit Resource <ExternalLink className="w-3 h-3" />
                    </a>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Notes Topics */}
          {results.notes && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Notebook className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-headline font-bold">Key Note Topics</h2>
              </div>
              <GlassCard className="p-6 border-white/5">
                <div className="flex flex-wrap gap-2">
                  {results.notes.notesTopics.map((topic, i) => (
                    <div key={i} className="px-4 py-2 rounded-full glass-card border-primary/20 text-sm font-medium">
                      {topic}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Schedule */}
          {results.schedule && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4 px-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-headline font-bold">7-Day Study Roadmap</h2>
              </div>
              <div className="space-y-3">
                {results.schedule.map((dayPlan, i) => (
                  <GlassCard key={i} className="p-6 border-white/5 flex flex-col md:flex-row gap-6 hover:neon-border transition-all">
                    <div className="md:w-32 shrink-0">
                      <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{dayPlan.day}</div>
                      <div className="font-headline font-bold text-lg">{dayPlan.theme}</div>
                    </div>
                    <div className="flex-1">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dayPlan.activities.map((act, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {results.summary && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4 px-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-headline font-bold">Revision Summary</h2>
              </div>
              <GlassCard className="p-8 border-white/5 leading-relaxed text-muted-foreground relative" gradient>
                <div className="absolute top-0 right-0 p-4">
                  <FileText className="w-12 h-12 text-primary/10" />
                </div>
                <div className="prose prose-invert max-w-none">
                  {results.summary.revisionSummary.split('\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Focus Guardian */}
          {results.guardian && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4 px-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-headline font-bold">Focus Guardian Advice</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.guardian.suggestions.map((suggestion, i) => (
                  <GlassCard key={i} className="p-6 border-secondary/20 bg-secondary/5" gradient>
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-sm font-medium">{suggestion}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {activeStep < steps.length && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">Orchestrating Agents</h3>
              <p className="text-muted-foreground max-w-sm">
                Wait while the <span className="text-primary font-bold">Planner</span> agent coordinates with 
                the <span className="text-secondary font-bold">{steps[activeStep].id}</span> agent.
              </p>
            </div>
          )}

          {/* Completion Button */}
          {activeStep === steps.length && progress === 100 && (
            <div className="flex justify-center pt-8">
              <Button size="lg" className="rounded-full px-12 bg-gradient-to-r from-primary to-secondary h-14 font-bold">
                Export Dashboard <LayoutDashboard className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </main>
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
