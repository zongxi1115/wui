"use client"

import * as React from "react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import { CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type IconName = keyof typeof dynamicIconImports
type IconComponent = React.ComponentType<React.ComponentProps<"svg">>

const iconNames = Object.keys(dynamicIconImports).sort() as IconName[]
const iconCache = new Map<IconName, React.LazyExoticComponent<IconComponent>>()
const PAGE_SIZE = 120

function getIcon(name: IconName) {
  const cached = iconCache.get(name)
  if (cached) return cached

  const component = React.lazy(
    dynamicIconImports[name] as () => Promise<{ default: IconComponent }>
  )
  iconCache.set(name, component)
  return component
}

function toComponentName(name: string) {
  return `${name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}Icon`
}

export function IconLibrary() {
  const [query, setQuery] = React.useState("")
  const [limit, setLimit] = React.useState(PAGE_SIZE)
  const [copied, setCopied] = React.useState<IconName | null>(null)
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase())

  const filtered = React.useMemo(
    () => iconNames.filter((name) => name.includes(deferredQuery)),
    [deferredQuery]
  )
  const visible = filtered.slice(0, limit)

  React.useEffect(() => setLimit(PAGE_SIZE), [deferredQuery])

  async function copyImport(name: IconName) {
    await navigator.clipboard.writeText(
      `import { ${toComponentName(name)} } from "lucide-react"`
    )
    setCopied(name)
    window.setTimeout(() => setCopied(null), 1400)
  }

  return (
    <section className="not-prose my-6 border-y">
      <div className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <SearchIcon
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 search、arrow、user…"
            className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring/40 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-shadow focus-visible:ring-[3px]"
          />
        </label>
        <p className="text-muted-foreground text-sm tabular-nums">
          {filtered.length} / {iconNames.length} 个图标
        </p>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {visible.map((name) => {
            const Glyph = getIcon(name)
            const isCopied = copied === name

            return (
              <button
                key={name}
                type="button"
                title={`复制 ${toComponentName(name)} 的导入语句`}
                onClick={() => copyImport(name)}
                className={cn(
                  "hover:bg-muted/60 focus-visible:ring-ring/50 group flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 border-b border-r px-2 py-3 text-center outline-none transition-colors focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset",
                  isCopied && "bg-primary/8 text-primary"
                )}
              >
                <React.Suspense fallback={<span className="size-5" />}>
                  {isCopied ? (
                    <CheckIcon aria-hidden className="size-5" />
                  ) : (
                    <Glyph aria-hidden className="size-5" />
                  )}
                </React.Suspense>
                <span className="text-muted-foreground group-hover:text-foreground w-full truncate text-[11px]">
                  {name}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center text-sm">
          没有匹配的图标。
        </p>
      )}

      {visible.length < filtered.length ? (
        <div className="flex justify-center border-t py-4">
          <button
            type="button"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            className="bg-background hover:bg-muted focus-visible:ring-ring/40 h-9 rounded-md border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px]"
          >
            再显示 {Math.min(PAGE_SIZE, filtered.length - visible.length)} 个
          </button>
        </div>
      ) : null}
    </section>
  )
}
