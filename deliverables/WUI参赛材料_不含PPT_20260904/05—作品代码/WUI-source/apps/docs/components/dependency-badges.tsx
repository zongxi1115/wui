import { Badge } from "@/registry/ui/badge"
import registry from "@/registry.json"

export function DependencyBadges({ name }: { name: string }) {
  const item = registry.items.find((entry) => entry.name === name)
  const packages = item?.dependencies ?? []

  if (packages.length === 0) return null

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
