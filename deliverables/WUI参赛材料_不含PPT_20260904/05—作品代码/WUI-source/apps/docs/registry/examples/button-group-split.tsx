"use client"

import * as React from "react"
import { ChevronDownIcon, GitMergeIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"

export default function ButtonGroupSplit() {
  const [selectedStrategy, setSelectedStrategy] = React.useState("Create a merge commit")

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup aria-label="Git 分支合并操作">
        <Button className="gap-2">
          <GitMergeIcon />
          <span>{selectedStrategy}</span>
        </Button>
        <Button
          size="icon"
          aria-label="更多合并策略"
          onClick={() => {
            setSelectedStrategy((prev) =>
              prev === "Create a merge commit"
                ? "Squash and merge"
                : "Create a merge commit"
            )
          }}
        >
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <p className="text-xs text-muted-foreground">
        点击右侧箭头可快速切换合并策略选项
      </p>
    </div>
  )
}
