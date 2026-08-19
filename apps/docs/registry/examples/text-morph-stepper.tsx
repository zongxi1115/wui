"use client"

import * as React from "react"
import { CheckCircle2, Play } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

const stages = [
  "1. Initializing Edge Sandbox",
  "2. Resolving Dependencies (npm)",
  "3. Compiling Turbopack Artifacts",
  "4. Generating Static Metadata",
  "5. Deployed to Global CDN",
]

export default function TextMorphStepper() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setCurrentStep(0)
    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (step < stages.length) {
        setCurrentStep(step)
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 1200)
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          CI/CD 部署流水线
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isRunning}
          onClick={handleRun}
          className="gap-1.5 text-xs"
        >
          <Play className="size-3" />
          {isRunning ? "部署中..." : "触发新流水线"}
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-4">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            currentStep === stages.length - 1
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-primary/10 text-primary"
          }`}
        >
          {currentStep === stages.length - 1 ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <span className="font-mono text-xs font-bold">{currentStep + 1}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-muted-foreground">当前流水线阶段</div>
          <TextMorph
            as="h5"
            className="text-sm font-semibold tracking-tight text-foreground truncate"
          >
            {stages[currentStep]}
          </TextMorph>
        </div>
      </div>
    </div>
  )
}
