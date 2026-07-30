"use client"

import * as React from "react"
import * as lucideAnimatedIcons from "@animateicons/react/lucide"
import { CheckIcon, SearchIcon } from "lucide-react"
import * as svglideIcons from "svglide"

import * as itsHoverAnimatedIcons from "@/registry/icons/animated"
import { cn } from "@/registry/lib/utils"
import type { AnimatedIconHandle } from "@/registry/ui/animated-icon"

const PAGE_SIZE = 96

type IconSource = "animateicons" | "itshover" | "svglide"
type SourceFilter = "all" | IconSource
type GalleryIcon = React.ComponentType<
  {
    size?: number | string
    color?: string
    strokeWidth?: number
    className?: string
    "data-hovered"?: boolean
  } & React.RefAttributes<AnimatedIconHandle>
>

interface AnimatedIconEntry {
  name: string
  icon: GalleryIcon
  source: IconSource
}

function toSearchName(name: string) {
  return name
    .replace(/(?:Icon|Logo|Svg)$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
}

const animateIconsEntries = Object.entries(lucideAnimatedIcons)
  .filter(([name]) => name.endsWith("Icon"))
  .map(([name, icon]) => ({
    name,
    icon: icon as unknown as GalleryIcon,
    source: "animateicons" as const,
  }))

const itsHoverEntries = Object.entries(itsHoverAnimatedIcons)
  .filter(
    ([name]) =>
      name !== "DEFAULT_STROKE_WIDTH" &&
      name !== "scaledStrokeWidth" &&
      name !== "withReducedMotion"
  )
  .map(([name, icon]) => ({
    name,
    icon: icon as unknown as GalleryIcon,
    source: "itshover" as const,
  }))

const existingNames = new Set(
  [...animateIconsEntries, ...itsHoverEntries].map((entry) =>
    toSearchName(entry.name)
  )
)

const svgGlideEntries = Object.entries(svglideIcons)
  .filter(
    ([name, icon]) =>
      !existingNames.has(toSearchName(name)) &&
      (typeof icon === "function" || (typeof icon === "object" && icon !== null))
  )
  .map(([name, icon]) => ({
    name,
    icon: icon as unknown as GalleryIcon,
    source: "svglide" as const,
  }))

const animatedIcons: AnimatedIconEntry[] = [
  ...animateIconsEntries,
  ...itsHoverEntries,
  ...svgGlideEntries,
].sort((a, b) => toSearchName(a.name).localeCompare(toSearchName(b.name)))

const sourceFilters: Array<{ value: SourceFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "animateicons", label: "AnimateIcons" },
  { value: "itshover", label: "ItsHover" },
  { value: "svglide", label: "SVGlide" },
]

function AnimatedIconTile({
  name,
  icon,
  source,
  copied,
  onCopy,
}: {
  name: string
  icon: GalleryIcon
  source: IconSource
  copied: boolean
  onCopy: () => void
}) {
  const iconRef = React.useRef<AnimatedIconHandle>(null)
  const [active, setActive] = React.useState(false)
  const Glyph = icon

  function startAnimation() {
    setActive(true)
    iconRef.current?.startAnimation()
  }

  function stopAnimation() {
    setActive(false)
    iconRef.current?.stopAnimation()
  }

  return (
    <button
      type="button"
      title={`复制 ${name} 的导入语句`}
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
      onFocus={startAnimation}
      onBlur={stopAnimation}
      onClick={onCopy}
      className={cn(
        "hover:bg-muted/60 focus-visible:ring-ring/50 group flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 border-b border-r px-2 py-3 text-center outline-none transition-colors focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset",
        copied && "bg-primary/8 text-primary"
      )}
    >
      {copied ? (
        <CheckIcon aria-hidden className="size-6" />
      ) : source === "svglide" ? (
        <Glyph aria-hidden className="size-6" data-hovered={active} />
      ) : (
        <Glyph ref={iconRef} size={24} />
      )}
      <span className="text-muted-foreground group-hover:text-foreground w-full truncate text-[11px]">
        {toSearchName(name)}
      </span>
    </button>
  )
}

export function AnimatedIconLibrary() {
  const [query, setQuery] = React.useState("")
  const [source, setSource] = React.useState<SourceFilter>("all")
  const [limit, setLimit] = React.useState(PAGE_SIZE)
  const [copied, setCopied] = React.useState<string | null>(null)
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase())

  const filtered = React.useMemo(
    () =>
      animatedIcons.filter(
        (entry) =>
          (source === "all" || entry.source === source) &&
          `${entry.name.toLowerCase()} ${toSearchName(entry.name)}`.includes(
            deferredQuery
          )
      ),
    [deferredQuery, source]
  )
  const visible = filtered.slice(0, limit)

  React.useEffect(() => setLimit(PAGE_SIZE), [deferredQuery, source])

  async function copyImport(entry: AnimatedIconEntry) {
    const importPath = {
      animateicons: "@animateicons/react/lucide",
      itshover: "@/components/ui/animated-icons",
      svglide: "svglide",
    }[entry.source]

    await navigator.clipboard.writeText(
      `import { ${entry.name} } from "${importPath}"`
    )
    setCopied(`${entry.source}:${entry.name}`)
    window.setTimeout(() => setCopied(null), 1400)
  }

  return (
    <section className="not-prose my-6 border-y">
      <div className="flex flex-col gap-3 border-b py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <SearchIcon
              aria-hidden
              className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 bell、menu、brand…"
              className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring/40 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-shadow focus-visible:ring-[3px]"
            />
          </label>
          <p className="text-muted-foreground text-sm tabular-nums">
            {filtered.length} / {animatedIcons.length} 个逐路径动态图标
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2" aria-label="图标来源">
          {sourceFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={source === filter.value}
              onClick={() => setSource(filter.value)}
              className={cn(
                "text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 text-xs font-medium outline-none transition-colors focus-visible:ring-[3px]",
                source === filter.value && "text-foreground underline underline-offset-4"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {visible.map((entry) => (
            <AnimatedIconTile
              key={`${entry.source}:${entry.name}`}
              name={entry.name}
              icon={entry.icon}
              source={entry.source}
              copied={copied === `${entry.source}:${entry.name}`}
              onCopy={() => copyImport(entry)}
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
