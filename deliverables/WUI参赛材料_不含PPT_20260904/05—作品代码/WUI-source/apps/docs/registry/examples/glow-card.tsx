import { CheckIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Glow } from "@/registry/ui/glow"

const features = [
  "Unlimited reasoning tokens & multi-turn workflows",
  "Dedicated fine-tuning cluster on H100 GPUs",
  "Custom edge middleware & zero-latency memory sync",
  "24/7 SLA with dedicated technical architect",
]

export default function GlowCardDemo() {
  return (
    <div className="flex w-full justify-center p-4 sm:p-8">
      <Glow spread={26} borderWidth={2} className="w-full max-w-md rounded-2xl">
        <div className="bg-card text-card-foreground flex flex-col justify-between rounded-2xl p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="gap-1 font-mono text-xs">
                <SparklesIcon className="size-3" />
                RECOMMENDED
              </Badge>
              <span className="text-muted-foreground text-xs font-medium">
                Annual billing
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-bold tracking-tight">Scale Pro Tier</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Built for mission-critical generative applications and agent systems.
              </p>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight">$99</span>
              <span className="text-muted-foreground text-sm">/ team member / month</span>
            </div>

            <div className="border-border/60 mt-6 space-y-2.5 border-t pt-6">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-xs">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="size-2.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full font-medium" size="lg">
              Upgrade to Scale Pro
            </Button>
          </div>
        </div>
      </Glow>
    </div>
  )
}
