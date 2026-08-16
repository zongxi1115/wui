"use client"

import * as React from "react"
import {
  ArrowDown,
  CheckCircle2,
  GitBranch,
  Globe,
  Rocket,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollSequence } from "@/registry/ui/scroll-sequence"

const workflowSteps = [
  {
    step: "01",
    tag: "SOURCE REPO",
    title: "Connect & Auto-Configure",
    description:
      "Link your Git repository with one click. Frameworks, environment variables, and build flags are detected automatically.",
    image: "https://picsum.photos/seed/workflow-git/600/350",
    icon: GitBranch,
  },
  {
    step: "02",
    tag: "BUILD & VALIDATE",
    title: "Automated Enclave Compilation",
    description:
      "Parallel isolated edge runners compile, bundle, and run end-to-end security audits in under two seconds with zero cold-start penalty.",
    image: "https://picsum.photos/seed/workflow-build/600/350",
    icon: ShieldCheck,
  },
  {
    step: "03",
    tag: "INSTANT ROLLOUT",
    title: "Global Edge Live Deployment",
    description:
      "Artifacts are distributed to 320+ edge locations worldwide within 400ms. Traffic shifts seamlessly with automated instant rollbacks.",
    image: "https://picsum.photos/seed/workflow-deploy/600/350",
    icon: Globe,
  },
]

export default function ScrollSequenceDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Rocket className="size-3 text-sky-500" />
              DEPLOYMENT WORKFLOW
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
            <span>Scroll to progress steps</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Deploy in 3 Automated Steps
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Scroll down to watch workflow steps transition sequentially.
          </p>
        </div>
      </div>

      <ScrollSequence
        container={container}
        stepLength={0.75}
        viewportClassName="bg-muted/30 mx-6 sm:mx-8 rounded-2xl border border-border p-6 sm:p-8 min-h-[19rem]"
      >
        {workflowSteps.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.step}
              className="grid h-full w-full gap-6 sm:grid-cols-2 items-center"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      <Icon className="size-3 text-sky-500" />
                      {item.tag}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      STEP {item.step} / 03
                    </span>
                  </div>

                  <h4 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>Verified Pipeline</span>
                </div>
              </div>

              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover"
                />
              </div>
            </div>
          )
        })}
      </ScrollSequence>
    </div>
  )
}
