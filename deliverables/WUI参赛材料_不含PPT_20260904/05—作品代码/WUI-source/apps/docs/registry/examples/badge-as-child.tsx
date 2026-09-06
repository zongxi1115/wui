import { ExternalLinkIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeAsChild() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge asChild variant="outline" className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
        <a href="#changelog" target="_blank" rel="noreferrer">
          Changelog <ExternalLinkIcon />
        </a>
      </Badge>
      <Badge asChild variant="secondary" className="cursor-pointer transition-colors hover:bg-secondary/80">
        <a href="#react">React 19</a>
      </Badge>
      <Badge asChild variant="default" className="cursor-pointer transition-colors hover:bg-primary/90">
        <a href="#pro-plan">Upgrade to Pro</a>
      </Badge>
    </div>
  )
}
