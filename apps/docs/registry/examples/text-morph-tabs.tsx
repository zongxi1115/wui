"use client"

import * as React from "react"

import { TextMorph } from "@/registry/ui/text-morph"

const tabs = [
  { id: "all", label: "All Tasks (24)" },
  { id: "active", label: "In Progress (14)" },
  { id: "review", label: "Under Review (6)" },
  { id: "done", label: "Completed (4)" },
]

export default function TextMorphTabs() {
  const [activeTab, setActiveTab] = React.useState("all")

  return (
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          任务看板分段筛选器
        </span>
        <span className="text-xs text-muted-foreground">
          当前选中:{" "}
          <TextMorph as="span" className="font-semibold text-foreground">
            {tabs.find((t) => t.id === activeTab)?.label ?? ""}
          </TextMorph>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-lg bg-muted/40 p-1">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TextMorph as="span">{tab.label}</TextMorph>
            </button>
          )
        })}
      </div>
    </div>
  )
}
