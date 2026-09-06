import { ArrowRightIcon, BarChart2Icon, LineChartIcon, PieChartIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ScrollSnap, ScrollSnapItem } from "@/registry/ui/scroll-snap"

const reports = [
  {
    title: "Monthly Recurring Revenue",
    value: "$124,500",
    change: "+18.2%",
    icon: LineChartIcon,
    sub: "Surpassed Q3 revenue projection by 14%",
  },
  {
    title: "Customer Acquisition Cost",
    value: "$42.50",
    change: "-8.4%",
    icon: BarChart2Icon,
    sub: "Organic referral channels contributing 62%",
  },
  {
    title: "Net Revenue Retention",
    value: "138%",
    change: "+4.1%",
    icon: PieChartIcon,
    sub: "Expansion revenue in enterprise accounts",
  },
]

export default function ScrollSnapHorizontal() {
  return (
    <div className="w-full max-w-xl space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          Financial Snap Cards
        </h4>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          Scroll horizontally <ArrowRightIcon className="size-3" />
        </span>
      </div>

      <ScrollSnap axis="x" strictness="mandatory" className="flex gap-4 pb-2">
        {reports.map((card) => {
          const Icon = card.icon
          return (
            <ScrollSnapItem
              key={card.title}
              align="start"
              className="w-72 shrink-0 rounded-2xl border bg-card p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {card.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">{card.title}</div>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground border-t pt-3">
                {card.sub}
              </p>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="ghost">
                  View Breakdown
                </Button>
              </div>
            </ScrollSnapItem>
          )
        })}
      </ScrollSnap>
    </div>
  )
}
