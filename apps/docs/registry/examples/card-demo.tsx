import { ArrowUpRight } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Progress } from "@/registry/ui/progress"

const facts = [
  { label: "负责人", value: "林澈" },
  { label: "截止日期", value: "8 月 16 日" },
]

export default function CardDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>体验升级计划</CardTitle>
        <CardDescription>统一关键流程的视觉反馈与交互细节。</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="查看项目">
            <ArrowUpRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-xs">完成进度</span>
            <span className="text-xl font-semibold tabular-nums tracking-tight">
              72
              <span className="text-muted-foreground ml-0.5 text-sm font-normal">
                %
              </span>
            </span>
          </div>
          <Progress value={72} aria-label="完成进度" />
        </div>
        <dl className="bg-muted/50 grid grid-cols-2 gap-4 rounded-xl px-4 py-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-muted-foreground text-xs">{fact.label}</dt>
              <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-xs">最近更新于 2 小时前</span>
        <Button size="sm">打开项目</Button>
      </CardFooter>
    </Card>
  )
}
