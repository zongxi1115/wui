"use client"

import * as React from "react"
import * as lucideAnimatedIcons from "@animateicons/react/lucide"
import { CheckIcon, SearchIcon } from "lucide-react"

import {
  AnimatedIcon,
  type AnimatedIconGlyph,
  type AnimatedIconHandle,
} from "@/registry/ui/animated-icon"
import { cn } from "@/registry/lib/utils"

const PAGE_SIZE = 96

const animatedIcons = Object.entries(lucideAnimatedIcons)
  .filter(([name]) => name.endsWith("Icon"))
  .sort(([a], [b]) => a.localeCompare(b)) as Array<[string, AnimatedIconGlyph]>

function toSearchName(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
}

function AnimatedIconTile({
  name,
  icon,
  copied,
  onCopy,
}: {
  name: string
  icon: AnimatedIconGlyph
  copied: boolean
  onCopy: () => void
}) {
  const iconRef = React.useRef<AnimatedIconHandle>(null)

  return (
    <button
      type="button"
      title={`复制 ${name} 的导入语句`}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      onFocus={() => iconRef.current?.startAnimation()}
      onBlur={() => iconRef.current?.stopAnimation()}
      onClick={onCopy}
      className={cn(
        "hover:bg-muted/60 focus-visible:ring-ring/50 group flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 border-b border-r px-2 py-3 text-center outline-none transition-colors focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset",
        copied && "bg-primary/8 text-primary"
      )}
    >
      {copied ? (
        <CheckIcon aria-hidden className="size-6" />
      ) : (
        <AnimatedIcon ref={iconRef} icon={icon} size={24} />
      )}
      <span className="text-muted-foreground group-hover:text-foreground w-full truncate text-[11px]">
        {toSearchName(name)}
      </span>
    </button>
  )
}

export function AnimatedIconLibrary() {
  const [query, setQuery] = React.useState("")
  const [limit, setLimit] = React.useState(PAGE_SIZE)
  const [copied, setCopied] = React.useState<string | null>(null)
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase())

  const filtered = React.useMemo(
    () =>
      animatedIcons.filter(([name]) =>
        `${name.toLowerCase()} ${toSearchName(name)}`.includes(deferredQuery)
      ),
    [deferredQuery]
  )
  const visible = filtered.slice(0, limit)

  React.useEffect(() => setLimit(PAGE_SIZE), [deferredQuery])

  async function copyImport(name: string) {
    await navigator.clipboard.writeText(
      `import { ${name} } from "@animateicons/react/lucide"`
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
            placeholder="搜索 bell、menu、settings…"
            className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring/40 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-shadow focus-visible:ring-[3px]"
          />
        </label>
        <p className="text-muted-foreground text-sm tabular-nums">
          {filtered.length} / {animatedIcons.length} 个逐路径动态图标
        </p>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {visible.map(([name, icon]) => (
            <AnimatedIconTile
              key={name}
              name={name}
              icon={icon}
              copied={copied === name}
              onCopy={() => copyImport(name)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center text-sm">
          没有匹配的动态图标。
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
