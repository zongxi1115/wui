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
      <CardContent>
        <div className="grid grid-cols-3 gap-4 border-y py-4">
          <div>
            <p className="text-muted-foreground text-xs">进度</p>
            <p className="mt-1 text-sm font-medium">72%</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">负责人</p>
            <p className="mt-1 text-sm font-medium">林澈</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">截止日期</p>
            <p className="mt-1 text-sm font-medium">8 月 16 日</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm">
          最近更新于 2 小时前
        </span>
        <Button size="sm">打开项目</Button>
      </CardFooter>
    </Card>
  )
}
