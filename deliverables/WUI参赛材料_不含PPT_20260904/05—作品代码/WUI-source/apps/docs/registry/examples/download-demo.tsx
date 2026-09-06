"use client"

import * as React from "react"

import { Download, type DownloadStatus } from "@/registry/ui/download"

export default function DownloadDemo() {
  const [status, setStatus] = React.useState<DownloadStatus>("idle")
  const [progress, setProgress] = React.useState(0)
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  function beginDownload() {
    if (timer.current) clearInterval(timer.current)
    setProgress(8)
    setStatus("downloading")
    timer.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 8)
        if (next === 100) {
          if (timer.current) clearInterval(timer.current)
          setStatus("complete")
        }
        return next
      })
    }, 140)
  }

  return (
    <div className="w-full max-w-md">
      <Download filename="Aurora Brand Kit.zip" meta={status === "idle" ? "ZIP · 48.2 MB" : undefined} status={status} progress={progress} onDownload={beginDownload} />
    </div>
  )
}
