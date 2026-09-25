"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

function useFakeRequest(duration = 1600) {
  const [pending, setPending] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const run = () => {
    setPending(true)
    timer.current = setTimeout(() => setPending(false), duration)
  }

  return [pending, run] as const
}

export default function ButtonLoading() {
  const [saving, save] = useFakeRequest()
  const [syncing, sync] = useFakeRequest(1200)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button loading={saving} onClick={save}>
        {saving ? "保存中" : "保存草稿"}
      </Button>
      <Button
        variant="outline"
        size="icon"
        loading={syncing}
        onClick={sync}
        aria-label="同步数据"
      >
        <RefreshCwIcon />
      </Button>
    </div>
  )
}
