"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

interface OklchColor {
  lightness: number
  chroma: number
  hue: number
  alpha: number
}

interface RgbColor {
  red: number
  green: number
  blue: number
  alpha: number
}

interface HsvColor {
  hue: number
  saturation: number
  value: number
}

type PickerMode = "rgb" | "oklch"

const colorPickerTriggerVariants = cva(
  "relative shrink-0 overflow-hidden rounded-md border border-input bg-background p-1 shadow-xs outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-8",
        default: "size-9",
        lg: "size-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const defaultSwatches = [
  "oklch(0.546 0.245 262.881)", // wui-token-audit-allow -- picker color data
  "oklch(0.585 0.233 277.117)", // wui-token-audit-allow -- picker color data
  "oklch(0.577 0.245 27.325)", // wui-token-audit-allow -- picker color data
  "oklch(0.666 0.179 58.318)", // wui-token-audit-allow -- picker color data
  "oklch(0.527 0.154 150.069)", // wui-token-audit-allow -- picker color data
  "oklch(0.6 0.118 184.704)", // wui-token-audit-allow -- picker color data
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function parseColorValue(value: string): OklchColor | null {
  const match = value
    .trim()
    .match(
      /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+)(%)?)?\s*\)$/i // wui-token-audit-allow -- parser grammar
    )
  if (!match) return null

  const lightness = Number(match[1]) / (match[2] === "%" ? 100 : 1)
  const alpha = match[5]
    ? Number(match[5]) / (match[6] === "%" ? 100 : 1)
    : 1

  return {
    lightness: clamp(lightness, 0, 1),
    chroma: clamp(Number(match[3]), 0, 0.4),
    hue: ((Number(match[4]) % 360) + 360) % 360,
    alpha: clamp(alpha, 0, 1),
  }
}

function parseHexValue(value: string): RgbColor | null {
  const hex = value.trim().replace(/^#/, "")
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)) {
    return null
  }
  let r = 0, g = 0, b = 0, a = 1
  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
    if (hex.length === 4) a = parseInt(hex[3] + hex[3], 16) / 255
  } else {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
    if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16) / 255
  }
  return { red: r, green: g, blue: b, alpha: a }
}

function formatNumber(value: number, digits = 3) {
  return Number(value.toFixed(digits)).toString()
}

function formatColorValue(color: OklchColor, showAlpha: boolean) {
  const channels = `${formatNumber(color.lightness)} ${formatNumber(color.chroma)} ${formatNumber(color.hue, 1)}`
  if (!showAlpha || color.alpha >= 0.999) return `oklch(${channels})` // wui-token-audit-allow -- generated color

  return `oklch(${channels} / ${formatNumber(color.alpha * 100, 1)}%)` // wui-token-audit-allow -- generated color
}

function parseRgbValue(value: string): RgbColor | null {
  const match = value.trim().match(/^rgba?\((.+)\)$/i)
  if (!match) return null

  const [channels, alphaChannel] = match[1].split("/").map((part) => part.trim())
  const parts = channels.replaceAll(",", " ").split(/\s+/).filter(Boolean)
  if (parts.length !== 3) return null

  const toChannel = (part: string) =>
    clamp(
      part.endsWith("%") ? (Number(part.slice(0, -1)) / 100) * 255 : Number(part),
      0,
      255
    )
  const alpha = alphaChannel
    ? clamp(
        alphaChannel.endsWith("%")
          ? Number(alphaChannel.slice(0, -1)) / 100
          : Number(alphaChannel),
        0,
        1
      )
    : 1

  if ([...parts.map(toChannel), alpha].some(Number.isNaN)) return null

  return {
    red: toChannel(parts[0]),
    green: toChannel(parts[1]),
    blue: toChannel(parts[2]),
    alpha,
  }
}

function formatRgbValue(color: RgbColor, showAlpha: boolean) {
  const channels = `${Math.round(color.red)} ${Math.round(color.green)} ${Math.round(color.blue)}`
  if (!showAlpha || color.alpha >= 0.999) return `rgb(${channels})` // wui-token-audit-allow -- generated color

  return `rgb(${channels} / ${formatNumber(color.alpha * 100, 1)}%)` // wui-token-audit-allow -- generated color
}

function linearToDisplayChannel(channel: number) {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * channel ** (1 / 2.4) - 0.055
}

function srgbToLinear(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function perceptualToChannels(color: OklchColor): RgbColor {
  const angle = (color.hue * Math.PI) / 180
  const a = color.chroma * Math.cos(angle)
  const b = color.chroma * Math.sin(angle)
  const lRoot = color.lightness + 0.3963377774 * a + 0.2158037573 * b
  const mRoot = color.lightness - 0.1055613458 * a - 0.0638541728 * b
  const sRoot = color.lightness - 0.0894841775 * a - 1.291485548 * b
  const l = lRoot ** 3
  const m = mRoot ** 3
  const s = sRoot ** 3

  return {
    red: clamp(
      linearToDisplayChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) *
        255,
      0,
      255
    ),
    green: clamp(
      linearToDisplayChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) *
        255,
      0,
      255
    ),
    blue: clamp(
      linearToDisplayChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) *
        255,
      0,
      255
    ),
    alpha: color.alpha,
  }
}

function rgbToPerceptual(color: RgbColor): OklchColor {
  const red = srgbToLinear(color.red / 255)
  const green = srgbToLinear(color.green / 255)
  const blue = srgbToLinear(color.blue / 255)
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue)
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue)
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  return {
    lightness: clamp(lightness, 0, 1),
    chroma: clamp(Math.sqrt(a * a + b * b), 0, 0.4),
    hue: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
    alpha: color.alpha,
  }
}

function channelsToHsv(color: RgbColor): HsvColor {
  const red = color.red / 255
  const green = color.green / 255
  const blue = color.blue / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0

  if (delta > 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6)
    else if (max === green) hue = 60 * ((blue - red) / delta + 2)
    else hue = 60 * ((red - green) / delta + 4)
  }

  return {
    hue: (hue + 360) % 360,
    saturation: max === 0 ? 0 : delta / max,
    value: max,
  }
}

function hsvToChannels(color: HsvColor, alpha: number): RgbColor {
  const chroma = color.value * color.saturation
  const segment = color.hue / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const offset = color.value - chroma
  let channels: [number, number, number]

  if (segment < 1) channels = [chroma, secondary, 0]
  else if (segment < 2) channels = [secondary, chroma, 0]
  else if (segment < 3) channels = [0, chroma, secondary]
  else if (segment < 4) channels = [0, secondary, chroma]
  else if (segment < 5) channels = [secondary, 0, chroma]
  else channels = [chroma, 0, secondary]

  return {
    red: (channels[0] + offset) * 255,
    green: (channels[1] + offset) * 255,
    blue: (channels[2] + offset) * 255,
    alpha,
  }
}

export interface ColorPickerProps {
  /** CSS 颜色值（支持 OKLCH、RGB/RGBA 或 HEX 十六进制代码）。 */
  value: string
  /** 颜色通道或精确值改变时连续触发的回调函数。 */
  onValueChange: (value: string) => void
  /** 触发器按钮的可访问性无障碍名称。@default "选择颜色" */
  label?: string
  /** 是否展示透明度（Alpha）通道滑块。@default true */
  showAlpha?: boolean
  /** 快速拾取的常用色板数组。 */
  swatches?: string[]
  /** 触发器尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 应用于触发器按钮的额外类名。 */
  className?: string
  /** 是否禁用颜色选择器。 */
  disabled?: boolean
}

/** 具备感知色彩空间（OKLCH）通道微调与精确 CSS 源码输入的颜色选择器。 */
function ColorPicker({
  value,
  onValueChange,
  label = "选择颜色",
  showAlpha = true,
  swatches = defaultSwatches,
  size = "default",
  className,
  disabled,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<PickerMode>("rgb")
  const parsedPerceptual = parseColorValue(value)
  const parsedRgb = parseRgbValue(value) ?? parseHexValue(value)
  const color =
    parsedPerceptual ??
    (parsedRgb ? rgbToPerceptual(parsedRgb) : null) ?? {
      lightness: 0.5,
      chroma: 0,
      hue: 0,
      alpha: 1,
    }
  const rgb = parsedRgb ?? perceptualToChannels(color)
  const [hsv, setHsv] = React.useState<HsvColor>(() => channelsToHsv(rgb))

  React.useEffect(() => {
    if (!open) setHsv(channelsToHsv(rgb))
  }, [open, value])

  function updateColor(patch: Partial<OklchColor>) {
    onValueChange(formatColorValue({ ...color, ...patch }, showAlpha))
  }

  function updateChannels(patch: Partial<RgbColor>) {
    const nextRgb = { ...rgb, ...patch }
    if (!("alpha" in patch && Object.keys(patch).length === 1)) {
      setHsv(channelsToHsv(nextRgb))
    }
    const nextValue = formatRgbValue(nextRgb, showAlpha)
    onValueChange(nextValue)
  }

  function updateHsv(patch: Partial<HsvColor>) {
    const nextHsv = { ...hsv, ...patch }
    const nextValue = formatRgbValue(
      hsvToChannels(nextHsv, rgb.alpha),
      showAlpha
    )
    setHsv(nextHsv)
    onValueChange(nextValue)
  }

  function selectSwatch(swatch: string) {
    const swatchColor = parseColorValue(swatch)
    if (mode === "rgb" && swatchColor) {
      const nextRgb = perceptualToChannels(swatchColor)
      const nextValue = formatRgbValue(nextRgb, showAlpha)
      setHsv(channelsToHsv(nextRgb))
      onValueChange(nextValue)
      return
    }

    onValueChange(swatch)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          className={cn(colorPickerTriggerVariants({ size }), className)}
        >
          <span
            className="block size-full rounded-sm border border-border/60"
            style={{ backgroundColor: value }}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none"
        >
          <div className="mb-4 flex border-b" role="tablist" aria-label="颜色模式">
            {(["rgb", "oklch"] as const).map((currentMode) => (
              <button
                key={currentMode}
                type="button"
                role="tab"
                aria-selected={mode === currentMode}
                className={cn(
                  "relative flex-1 pb-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground",
                  mode === currentMode &&
                    "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground"
                )}
                onClick={() => {
                  if (currentMode === "rgb") setHsv(channelsToHsv(rgb))
                  setMode(currentMode)
                }}
              >
                {currentMode === "rgb" ? "基础 RGB" : "专业 OKLCH"}
              </button>
            ))}
          </div>

          {mode === "rgb" ? (
            <div>
              <ColorPlane
                hue={hsv.hue}
                saturation={hsv.saturation}
                value={hsv.value}
                onChange={(saturation, value) =>
                  updateHsv({ saturation, value })
                }
              />

              <div className="mt-3">
                <ColorChannel
                  label="色相"
                  value={hsv.hue}
                  min={0}
                  max={360}
                  step={1}
                  background={"linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))" /* wui-token-audit-allow -- hue spectrum */}
                  display={`${Math.round(hsv.hue)}°`}
                  onChange={(hue) => updateHsv({ hue })}
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <RgbChannel
                  label="R"
                  value={rgb.red}
                  onChange={(red) => updateChannels({ red })}
                />
                <RgbChannel
                  label="G"
                  value={rgb.green}
                  onChange={(green) => updateChannels({ green })}
                />
                <RgbChannel
                  label="B"
                  value={rgb.blue}
                  onChange={(blue) => updateChannels({ blue })}
                />
              </div>

              {showAlpha ? (
                <div className="mt-3">
                  <ColorChannel
                    label="透明度"
                    value={rgb.alpha}
                    min={0}
                    max={1}
                    step={0.01}
                    background={`linear-gradient(to right, transparent, rgb(${rgb.red} ${rgb.green} ${rgb.blue}))` /* wui-token-audit-allow -- alpha gradient */}
                    display={`${Math.round(rgb.alpha * 100)}%`}
                    onChange={(alpha) => updateChannels({ alpha })}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div
                className="h-16 rounded-md border border-border"
                style={{ backgroundColor: value }}
              />

              <div className="mt-4 space-y-3">
                <ColorChannel
                  label="明度"
                  value={color.lightness}
                  min={0}
                  max={1}
                  step={0.005}
                  background={`linear-gradient(to right, oklch(0 ${color.chroma} ${color.hue}), oklch(1 ${color.chroma} ${color.hue}))` /* wui-token-audit-allow -- picker gradient */}
                  display={`${Math.round(color.lightness * 100)}%`}
                  onChange={(lightness) => updateColor({ lightness })}
                />
                <ColorChannel
                  label="色度"
                  value={color.chroma}
                  min={0}
                  max={0.4}
                  step={0.002}
                  background={`linear-gradient(to right, oklch(${color.lightness} 0 ${color.hue}), oklch(${color.lightness} 0.4 ${color.hue}))` /* wui-token-audit-allow -- picker gradient */}
                  display={formatNumber(color.chroma)}
                  onChange={(chroma) => updateColor({ chroma })}
                />
                <ColorChannel
                  label="色相"
                  value={color.hue}
                  min={0}
                  max={360}
                  step={1}
                  background={"linear-gradient(to right, oklch(0.7 0.2 0), oklch(0.7 0.2 60), oklch(0.7 0.2 120), oklch(0.7 0.2 180), oklch(0.7 0.2 240), oklch(0.7 0.2 300), oklch(0.7 0.2 360))" /* wui-token-audit-allow -- hue spectrum */}
                  display={`${Math.round(color.hue)}°`}
                  onChange={(hue) => updateColor({ hue })}
                />
                {showAlpha ? (
                  <ColorChannel
                    label="透明度"
                    value={color.alpha}
                    min={0}
                    max={1}
                    step={0.01}
                    background={`linear-gradient(to right, transparent, oklch(${color.lightness} ${color.chroma} ${color.hue}))` /* wui-token-audit-allow -- alpha gradient */}
                    display={`${Math.round(color.alpha * 100)}%`}
                    onChange={(alpha) => updateColor({ alpha })}
                  />
                ) : null}
              </div>
            </div>
          )}

          {swatches.length > 0 ? (
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                常用颜色
              </p>
              <div className="flex flex-wrap gap-2">
                {swatches.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    aria-label={`使用 ${swatch}`}
                    aria-pressed={value === swatch}
                    className="size-7 rounded-md border border-border p-0.5 outline-none transition-transform hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/30 aria-pressed:ring-2 aria-pressed:ring-foreground"
                    onClick={() => selectSwatch(swatch)}
                  >
                    <span
                      className="block size-full rounded-sm"
                      style={{ backgroundColor: swatch }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="mt-4 block border-t pt-4">
            <span className="mb-2 block text-xs font-medium text-muted-foreground">
              CSS 值
            </span>
            <input
              value={value}
              spellCheck={false}
              className="h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-xs outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-[3px] focus:ring-ring/25"
              onChange={(event) => onValueChange(event.target.value)}
            />
          </label>

          <PopoverPrimitive.Arrow className="fill-border" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function ColorPlane({
  hue,
  saturation,
  value,
  onChange,
}: {
  hue: number
  saturation: number
  value: number
  onChange: (saturation: number, value: number) => void
}) {
  function updateFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const nextSaturation = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const nextValue = 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)
    onChange(nextSaturation, nextValue)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.1 : 0.02
    if (event.key === "ArrowLeft") onChange(clamp(saturation - step, 0, 1), value)
    else if (event.key === "ArrowRight")
      onChange(clamp(saturation + step, 0, 1), value)
    else if (event.key === "ArrowUp")
      onChange(saturation, clamp(value + step, 0, 1))
    else if (event.key === "ArrowDown")
      onChange(saturation, clamp(value - step, 0, 1))
    else return

    event.preventDefault()
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="饱和度与亮度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(saturation * 100)}
      aria-valuetext={`饱和度 ${Math.round(saturation * 100)}%，亮度 ${Math.round(value * 100)}%`}
      className="relative h-36 touch-none cursor-crosshair overflow-hidden rounded-md border border-border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
      style={{ backgroundColor: `hsl(${hue} 100% 50%)` } /* wui-token-audit-allow -- interactive color plane */}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        updateFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          updateFromPointer(event)
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, white, transparent), linear-gradient(to bottom, transparent, black)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-[0_0_0_1px_var(--foreground)]"
        style={{ left: `${saturation * 100}%`, top: `${(1 - value) * 100}%` }}
      />
    </div>
  )
}

function ColorChannel({
  label,
  value,
  min,
  max,
  step,
  background,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  background: string
  display: string
  onChange: (value: number) => void
}) {
  return (
    <label className="grid grid-cols-[3rem_1fr_2.75rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm"
        style={{ background }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="block w-11 text-right font-mono text-[11px] tabular-nums">
        {display}
      </span>
    </label>
  )
}

function RgbChannel({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex h-10 min-w-0 items-center justify-between gap-1 overflow-hidden rounded-md border border-input bg-background px-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
      <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        value={Math.round(value)}
        min={0}
        max={255}
        className="w-[3ch] min-w-[3ch] appearance-none bg-transparent text-right font-mono text-xs tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), 0, 255))
        }
      />
    </label>
  )
}

export { ColorPicker, colorPickerTriggerVariants, formatColorValue, parseColorValue, parseHexValue }
