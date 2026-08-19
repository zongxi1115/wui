import { CheckCircle2Icon, GitBranchIcon, GitCommitIcon, TerminalIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

const deployments = [
  {
    id: "dpl_98a7bc",
    branch: "main",
    commit: "feat: add oauth2 flow",
    environment: "Production",
    envVariant: "default" as const,
    status: "Ready",
    statusVariant: "success" as const,
    time: "2m ago",
  },
  {
    id: "dpl_43f110",
    branch: "feat/billing",
    commit: "fix: stripe webhook payload",
    environment: "Preview",
    envVariant: "secondary" as const,
    status: "Building",
    statusVariant: "warning" as const,
    time: "5m ago",
  },
  {
    id: "dpl_119ae2",
    branch: "refactor/theme",
    commit: "refactor: simplify token parser",
    environment: "Staging",
    envVariant: "outline" as const,
    status: "Failed",
    statusVariant: "destructive" as const,
    time: "14m ago",
  },
]

export default function BadgeBusiness() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Recent Deployments</span>
        </div>
        <Badge variant="outline" size="sm" className="font-mono">
          3 total
        </Badge>
      </div>

      <div className="divide-y divide-border/40">
        {deployments.map((dpl) => (
          <div
            key={dpl.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {dpl.id}
                </span>
                <Badge variant={dpl.envVariant} size="sm">
                  {dpl.environment}
                </Badge>
                <Badge variant={dpl.statusVariant} size="sm">
                  {dpl.status === "Ready" && <CheckCircle2Icon />}
                  {dpl.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/80">
                <span className="flex items-center gap-1 font-medium">
                  <GitBranchIcon className="size-3 text-muted-foreground" />
                  {dpl.branch}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground truncate max-w-[200px]">
                  <GitCommitIcon className="size-3 shrink-0" />
                  {dpl.commit}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 sm:self-center">
              {dpl.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
