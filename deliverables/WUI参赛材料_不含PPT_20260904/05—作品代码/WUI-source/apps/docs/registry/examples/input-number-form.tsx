"use client"

import * as React from "react"
import { Cpu, HardDrive, CheckCircle2 } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberForm() {
  const [cpuCores, setCpuCores] = React.useState<number | null>(8)
  const [memoryGb, setMemoryGb] = React.useState<number | null>(32)
  const [diskSize, setDiskSize] = React.useState<number | null>(500)
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3">
        <Cpu className="size-4 text-primary" />
        <h4 className="text-sm font-semibold">容器资源配置配额</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cpu-input" className="text-xs font-medium text-foreground">
            vCPU 核心数
          </label>
          <InputNumber
            id="cpu-input"
            value={cpuCores}
            onValueChange={setCpuCores}
            min={1}
            max={128}
            step={2}
            suffix="核"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="mem-input" className="text-xs font-medium text-foreground">
            运行内存
          </label>
          <InputNumber
            id="mem-input"
            value={memoryGb}
            onValueChange={setMemoryGb}
            min={2}
            max={512}
            step={8}
            suffix="GB"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="disk-input" className="text-xs font-medium text-foreground flex items-center gap-1">
          <HardDrive className="size-3.5 text-muted-foreground" />
          <span>系统盘容量 (SSD)</span>
        </label>
        <InputNumber
          id="disk-input"
          value={diskSize}
          onValueChange={setDiskSize}
          min={50}
          max={4000}
          step={50}
          suffix="GB"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        {saved ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            配额配置已生效
          </span>
        ) : <span />}
        <Button type="submit" size="sm">
          保存配额变更
        </Button>
      </div>
    </form>
  )
}
