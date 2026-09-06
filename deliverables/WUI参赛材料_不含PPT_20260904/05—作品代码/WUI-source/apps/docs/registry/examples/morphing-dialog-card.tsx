import { ArrowUpRightIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"

export default function MorphingDialogCard() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center p-4">
      <MorphingDialog>
        <MorphingDialogTrigger className="group flex w-full flex-col gap-3 rounded-2xl border bg-card p-5 text-left shadow-xs transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCardIcon className="size-5" />
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              VISA ···· 4242
            </Badge>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Corporate Expense Card
            </div>
            <div className="text-xl font-semibold tracking-tight text-foreground">
              $14,250.00
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Available credit: $35,750.00</span>
            <span className="flex items-center gap-0.5 text-primary group-hover:underline">
              Details <ArrowUpRightIcon className="size-3" />
            </span>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContent className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCardIcon className="size-6" />
            </div>
            <div>
              <MorphingDialogTitle className="text-lg">
                Corporate Expense Card
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-xs">
                Billing Cycle: Aug 1 - Aug 31, 2026
              </MorphingDialogSubtitle>
            </div>
          </div>

          <MorphingDialogDescription className="mt-4 text-xs">
            Review detailed monthly limits, authorized departmental spenders, and
            automated tax reconciliation rules.
          </MorphingDialogDescription>

          <div className="mt-5 space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Limit</span>
              <span className="font-semibold text-foreground">$50,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spent This Period</span>
              <span className="font-semibold text-foreground">$14,250.00 (28.5%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Virtual Cards Active</span>
              <span className="font-semibold text-foreground">6 cards</span>
            </div>
            <div className="flex items-center gap-1.5 pt-2 text-xs text-success">
              <ShieldCheckIcon className="size-4" />
              <span>Real-time fraud monitoring active</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <MorphingDialogClose asChild>
              <Button variant="ghost" size="sm">
                Dismiss
              </Button>
            </MorphingDialogClose>
            <MorphingDialogClose asChild>
              <Button size="sm">Manage Card</Button>
            </MorphingDialogClose>
          </div>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>
    </div>
  )
}
