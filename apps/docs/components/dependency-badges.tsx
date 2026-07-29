import { Badge } from "@/registry/ui/badge"

export function DependencyBadges({ packages }: { packages: string[] }) {
  return (
    <div className="not-prose my-4 flex flex-wrap items-center gap-2">
      {packages.map((packageName) => (
        <Badge key={packageName} variant="outline" size="sm">
          第三方依赖 · {packageName}
        </Badge>
      ))}
    </div>
  )
}
