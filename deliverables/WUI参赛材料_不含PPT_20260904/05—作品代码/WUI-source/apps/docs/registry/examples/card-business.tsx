import { ActivityIcon, CpuIcon, HardDriveIcon, MoreVerticalIcon, ServerIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
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

export default function CardBusiness() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ServerIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-base">node-us-east-01</CardTitle>
            <CardDescription className="text-xs">
              AWS EC2 · c6g.2xlarge · 10.0.12.84
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Metric 1: CPU */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CpuIcon className="size-3.5" /> CPU Utilization
            </span>
            <span className="font-semibold tabular-nums">42%</span>
          </div>
          <Progress value={42} className="h-1.5" />
        </div>

        {/* Metric 2: Memory */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <HardDriveIcon className="size-3.5" /> Memory (RAM)
            </span>
            <span className="font-semibold tabular-nums">6.8 / 16 GB</span>
          </div>
          <Progress value={42.5} className="h-1.5" />
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="success" size="sm" className="gap-1">
            <ActivityIcon className="size-3" /> Healthy
          </Badge>
          <Badge variant="outline" size="sm">
            Kubernetes v1.29
          </Badge>
          <Badge variant="secondary" size="sm">
            99.98% Uptime
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground">
          Auto-scaling policy: Active
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Logs
          </Button>
          <Button size="sm">Restart</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
