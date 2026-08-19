"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import { RadarChart } from "@/registry/charts/radar-chart"

const BENCHMARK_DATA = [
  { dimension: "代码生成 (Code)", claude: 96, gpt4o: 90, r1: 94 },
  { dimension: "复杂推理 (Reasoning)", claude: 95, gpt4o: 88, r1: 96 },
  { dimension: "长文理解 (Context)", claude: 92, gpt4o: 94, r1: 85 },
  { dimension: "数学逻辑 (Math)", claude: 90, gpt4o: 86, r1: 97 },
  { dimension: "指令遵循 (Instruction)", claude: 94, gpt4o: 92, r1: 89 },
  { dimension: "多语言 (Multilingual)", claude: 88, gpt4o: 95, r1: 87 },
]

export default function RadarChartDemo() {
  return (
    <div className="w-full max-w-xl">
      <RadarChart
        title="大模型基准综合评测"
        description="对比不同模型在多维度能力指标下的综合表现得分"
        actions={
          <Badge variant="secondary" className="text-[10px] py-0">
            2026 Q3 Benchmark
          </Badge>
        }
        data={BENCHMARK_DATA}
        nameKey="dimension"
        series={[
          { key: "claude", label: "Claude 3.5 Sonnet" },
          { key: "r1", label: "DeepSeek R1" },
          { key: "gpt4o", label: "GPT-4o" },
        ]}
        valueFormatter={(val) => `${val} 分`}
        height={340}
      />
    </div>
  )
}
