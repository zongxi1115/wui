"use client"

import * as React from "react"
import * as lucideAnimatedIcons from "@animateicons/react/lucide"
import {
  ArrowRightIcon,
  CheckIcon,
  PlayIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import * as svglideIcons from "svglide"

import * as itsHoverAnimatedIcons from "@/registry/icons/animated"
import { cn } from "@/registry/lib/utils"
import type { AnimatedIconHandle } from "@/registry/ui/animated-icon"
import { Button } from "@/registry/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

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
      (typeof icon === "function" ||
        (typeof icon === "object" && icon !== null))
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

const DEFAULT_FROM_ICON = "animateicons:MenuIcon"
const DEFAULT_TO_ICON = "animateicons:XIcon"

function getEntryId(entry: AnimatedIconEntry) {
  return `${entry.source}:${entry.name}`
}

const MORPH_SAMPLE_POINTS = 32

type MorphPoint = { x: number; y: number }

type MorphPath = {
  from: MorphPoint[]
  to: MorphPoint[]
  fromVisible: boolean
  toVisible: boolean
}

function getViewBox(svg: SVGSVGElement) {
  const values = svg
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)

  return values?.length === 4 && values[2] > 0 && values[3] > 0
    ? values
    : [0, 0, 24, 24]
}

function samplePath(path: SVGGeometryElement, viewBox: number[]) {
  const [minX, minY, width, height] = viewBox
  const length = path.getTotalLength()

  return Array.from({ length: MORPH_SAMPLE_POINTS }, (_, index) => {
    const point = path.getPointAtLength(
      (length * index) / (MORPH_SAMPLE_POINTS - 1)
    )

    return {
      x: ((point.x - minX) / width) * 24,
      y: ((point.y - minY) / height) * 24,
    }
  })
}

function extractIconPaths(container: HTMLDivElement | null) {
  const svg = container?.querySelector("svg")
  if (!svg) return []

  const viewBox = getViewBox(svg)
  return Array.from(
    svg.querySelectorAll<SVGGeometryElement>(
      "path, circle, ellipse, line, polygon, polyline, rect"
    )
  ).map((path) => samplePath(path, viewBox))
}

function collapsedPath(point: MorphPoint = { x: 12, y: 12 }) {
  return Array.from({ length: MORPH_SAMPLE_POINTS }, () => point)
}

function createMorphPaths(from: MorphPoint[][], to: MorphPoint[][]) {
  return Array.from(
    { length: Math.max(from.length, to.length) },
    (_, index): MorphPath => ({
      from:
        from[index] ??
        collapsedPath(to[index]?.[Math.floor(MORPH_SAMPLE_POINTS / 2)]),
      to:
        to[index] ??
        collapsedPath(from[index]?.[Math.floor(MORPH_SAMPLE_POINTS / 2)]),
      fromVisible: Boolean(from[index]),
      toVisible: Boolean(to[index]),
    })
  )
}

function toMorphPath(
  points: MorphPoint[],
  target: MorphPoint[],
  progress: number
) {
  return points
    .map((point, index) => {
      const end = target[index]
      const x = point.x + (end.x - point.x) * progress
      const y = point.y + (end.y - point.y) * progress
      const command = index === 0 ? "M" : "L"
      return `${command}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

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
  const [fromIcon, setFromIcon] = React.useState(DEFAULT_FROM_ICON)
  const [toIcon, setToIcon] = React.useState(DEFAULT_TO_ICON)
  const [morphPaths, setMorphPaths] = React.useState<MorphPath[]>([])
  const [progress, setProgress] = React.useState(0)
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const fromSourceRef = React.useRef<HTMLDivElement>(null)
  const toSourceRef = React.useRef<HTMLDivElement>(null)
  const animationFrameRef = React.useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase())
  const fromEntry = animatedIcons.find(
    (entry) => getEntryId(entry) === fromIcon
  )!
  const toEntry = animatedIcons.find((entry) => getEntryId(entry) === toIcon)!
  const FromGlyph = fromEntry.icon
  const ToGlyph = toEntry.icon

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

  React.useLayoutEffect(() => {
    const fromPaths = extractIconPaths(fromSourceRef.current)
    const toPaths = extractIconPaths(toSourceRef.current)

    setMorphPaths(createMorphPaths(fromPaths, toPaths))
    setProgress(0)
    setHasPlayed(false)
  }, [fromIcon, toIcon])

  React.useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    },
    []
  )

  function resetPreview() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    setProgress(0)
    setHasPlayed(false)
  }

  function playPreview() {
    if (!morphPaths.length || hasPlayed) return

    setHasPlayed(true)

    if (reduceMotion) {
      setProgress(1)
      return
    }

    const startTime = window.performance.now()
    const duration = 600

    function animate(now: number) {
      const elapsed = Math.min((now - startTime) / duration, 1)
      setProgress(easeInOutCubic(elapsed))

      if (elapsed < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate)
      } else {
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(animate)
  }

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
    <section className="not-prose relative my-6 border-y">
      <div
        aria-hidden
        className="pointer-events-none absolute size-px overflow-hidden opacity-0"
      >
        <div ref={fromSourceRef}>
          <FromGlyph size={24} />
        </div>
        <div ref={toSourceRef}>
          <ToGlyph size={24} />
        </div>
      </div>
      <div className="bg-muted/20 grid gap-4 border-b px-4 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5 text-xs font-medium">
            <span id="animated-icon-from-label">From</span>
            <Select
              value={fromIcon}
              onValueChange={(value) => {
                setFromIcon(value)
                resetPreview()
              }}
            >
              <SelectTrigger
                size="sm"
                aria-labelledby="animated-icon-from-label"
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animatedIcons.map((entry) => (
                  <SelectItem key={getEntryId(entry)} value={getEntryId(entry)}>
                    {entry.source} · {toSearchName(entry.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 text-xs font-medium">
            <span id="animated-icon-to-label">To</span>
            <Select
              value={toIcon}
              onValueChange={(value) => {
                setToIcon(value)
                resetPreview()
              }}
            >
              <SelectTrigger
                size="sm"
                aria-labelledby="animated-icon-to-label"
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animatedIcons.map((entry) => (
                  <SelectItem key={getEntryId(entry)} value={getEntryId(entry)}>
                    {entry.source} · {toSearchName(entry.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <div className="text-muted-foreground flex items-center gap-2">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7 shrink-0"
            >
              {morphPaths.map((path, index) => {
                const opacity =
                  path.fromVisible === path.toVisible
                    ? 1
                    : path.toVisible
                      ? progress
                      : 1 - progress

                return (
                  <path
                    key={index}
                    d={toMorphPath(path.from, path.to, progress)}
                    opacity={opacity}
                  />
                )
              })}
            </svg>
            <ArrowRightIcon aria-hidden className="size-4" />
          </div>
          <Button
            size="sm"
            onClick={hasPlayed ? resetPreview : playPreview}
            disabled={!morphPaths.length}
          >
            {hasPlayed ? (
              <RotateCcwIcon aria-hidden className="size-3.5" />
            ) : (
              <PlayIcon aria-hidden className="size-3.5" />
            )}
            {hasPlayed ? "Reset" : "Play"}
          </Button>
        </div>
      </div>
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
                source === filter.value &&
                  "text-foreground underline underline-offset-4"
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
