"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react"
import { ThemeToggle } from "fumadocs-ui/components/layout/theme-toggle"

import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"
import { Input } from "@/registry/ui/input"
import { cn } from "@/registry/lib/utils"

type ColorMode = "light" | "dark"
type TokenValues = Record<string, string>

interface ThemeRegistry {
  cssVars: {
    light: TokenValues
    dark: TokenValues
    theme: TokenValues
  }
}

interface ThemeState {
  light: TokenValues
  dark: TokenValues
  theme: TokenValues
}

const storageKey = "wui-theme-overrides-v1"
const styleElementId = "wui-token-configurator"

const tokenGroups = [
  {
    name: "基础",
    description: "控制组件圆角尺度。",
    tokens: ["radius"],
  },
  {
    name: "表面与文本",
    description: "页面、容器、浮层和弱化内容的层级关系。",
    tokens: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "muted",
      "muted-foreground",
    ],
  },
  {
    name: "操作",
    description: "主要、次要和强调操作的语义配色。",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    name: "状态反馈",
    description: "危险、信息、成功和警告状态及其前景色。",
    tokens: [
      "destructive",
      "destructive-foreground",
      "info",
      "info-foreground",
      "success",
      "success-foreground",
      "warning",
      "warning-foreground",
    ],
  },
  {
    name: "边界与效果",
    description: "边框、输入框、焦点、遮罩和高光效果。",
    tokens: ["border", "input", "ring", "overlay", "shine"],
  },
] as const

interface ThemePreset {
  id: string
  name: string
  description: string
  swatches: string[]
  light: TokenValues
  dark: TokenValues
}

const themePresets: ThemePreset[] = [
  {
    id: "neutral",
    name: "中性灰",
    description: "克制、通用的默认主题",
    swatches: ["oklch(0.205 0 0)", "oklch(0.556 0 0)", "oklch(0.922 0 0)"],
    light: {},
    dark: {},
  },
  {
    id: "ocean",
    name: "深海蓝",
    description: "清晰、理性的蓝色体系",
    swatches: [
      "oklch(0.546 0.245 262.881)",
      "oklch(0.707 0.165 254.624)",
      "oklch(0.932 0.032 255.585)",
    ],
    light: {
      background: "oklch(0.985 0.008 247.858)",
      primary: "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.932 0.032 255.585)",
      "secondary-foreground": "oklch(0.379 0.146 265.522)",
      muted: "oklch(0.955 0.018 255.585)",
      accent: "oklch(0.932 0.032 255.585)",
      "accent-foreground": "oklch(0.379 0.146 265.522)",
      border: "oklch(0.882 0.035 254.128)",
      input: "oklch(0.882 0.035 254.128)",
      ring: "oklch(0.546 0.245 262.881)",
    },
    dark: {
      background: "oklch(0.155 0.025 261.325)",
      card: "oklch(0.205 0.03 264.376)",
      popover: "oklch(0.205 0.03 264.376)",
      primary: "oklch(0.707 0.165 254.624)",
      "primary-foreground": "oklch(0.145 0 0)",
      secondary: "oklch(0.279 0.041 260.031)",
      muted: "oklch(0.279 0.041 260.031)",
      accent: "oklch(0.279 0.041 260.031)",
      ring: "oklch(0.707 0.165 254.624)",
    },
  },
  {
    id: "forest",
    name: "苔原绿",
    description: "稳定、自然的绿色体系",
    swatches: [
      "oklch(0.448 0.119 151.328)",
      "oklch(0.765 0.177 163.223)",
      "oklch(0.95 0.052 163.051)",
    ],
    light: {
      background: "oklch(0.986 0.006 159.376)",
      primary: "oklch(0.448 0.119 151.328)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.95 0.052 163.051)",
      "secondary-foreground": "oklch(0.393 0.095 152.535)",
      muted: "oklch(0.962 0.022 159.376)",
      accent: "oklch(0.95 0.052 163.051)",
      "accent-foreground": "oklch(0.393 0.095 152.535)",
      border: "oklch(0.89 0.045 159.376)",
      input: "oklch(0.89 0.045 159.376)",
      ring: "oklch(0.448 0.119 151.328)",
    },
    dark: {
      background: "oklch(0.15 0.021 154.39)",
      card: "oklch(0.2 0.028 154.39)",
      popover: "oklch(0.2 0.028 154.39)",
      primary: "oklch(0.765 0.177 163.223)",
      "primary-foreground": "oklch(0.145 0 0)",
      secondary: "oklch(0.275 0.045 154.39)",
      muted: "oklch(0.275 0.045 154.39)",
      accent: "oklch(0.275 0.045 154.39)",
      ring: "oklch(0.765 0.177 163.223)",
    },
  },
  {
    id: "violet",
    name: "电光紫",
    description: "鲜明、偏创意的紫色体系",
    swatches: [
      "oklch(0.541 0.281 293.009)",
      "oklch(0.702 0.183 293.541)",
      "oklch(0.943 0.029 294.588)",
    ],
    light: {
      background: "oklch(0.986 0.006 286.286)",
      primary: "oklch(0.541 0.281 293.009)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.943 0.029 294.588)",
      "secondary-foreground": "oklch(0.432 0.232 292.759)",
      muted: "oklch(0.96 0.018 294.588)",
      accent: "oklch(0.943 0.029 294.588)",
      "accent-foreground": "oklch(0.432 0.232 292.759)",
      border: "oklch(0.88 0.04 294.588)",
      input: "oklch(0.88 0.04 294.588)",
      ring: "oklch(0.541 0.281 293.009)",
    },
    dark: {
      background: "oklch(0.15 0.026 293.756)",
      card: "oklch(0.205 0.034 293.756)",
      popover: "oklch(0.205 0.034 293.756)",
      primary: "oklch(0.702 0.183 293.541)",
      "primary-foreground": "oklch(0.145 0 0)",
      secondary: "oklch(0.28 0.055 293.756)",
      muted: "oklch(0.28 0.055 293.756)",
      accent: "oklch(0.28 0.055 293.756)",
      ring: "oklch(0.702 0.183 293.541)",
    },
  },
  {
    id: "sand",
    name: "暖砂橙",
    description: "温暖、友好的橙色体系",
    swatches: [
      "oklch(0.553 0.195 38.402)",
      "oklch(0.769 0.188 70.08)",
      "oklch(0.954 0.038 75.164)",
    ],
    light: {
      background: "oklch(0.988 0.009 78.281)",
      primary: "oklch(0.553 0.195 38.402)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.954 0.038 75.164)",
      "secondary-foreground": "oklch(0.414 0.112 45.904)",
      muted: "oklch(0.965 0.022 75.164)",
      accent: "oklch(0.954 0.038 75.164)",
      "accent-foreground": "oklch(0.414 0.112 45.904)",
      border: "oklch(0.89 0.052 75.164)",
      input: "oklch(0.89 0.052 75.164)",
      ring: "oklch(0.553 0.195 38.402)",
    },
    dark: {
      background: "oklch(0.16 0.022 46.201)",
      card: "oklch(0.21 0.03 46.201)",
      popover: "oklch(0.21 0.03 46.201)",
      primary: "oklch(0.769 0.188 70.08)",
      "primary-foreground": "oklch(0.205 0 0)",
      secondary: "oklch(0.285 0.046 46.201)",
      muted: "oklch(0.285 0.046 46.201)",
      accent: "oklch(0.285 0.046 46.201)",
      ring: "oklch(0.769 0.188 70.08)",
    },
  },
]

function renderDeclarationBlock(values: TokenValues) {
  return Object.entries(values)
    .map(([token, value]) => `  --${token}: ${value};`)
    .join("\n")
}

function renderThemeCss(theme: ThemeState) {
  return `:root {
${renderDeclarationBlock(theme.light)}
}

.dark {
${renderDeclarationBlock(theme.dark)}
}

@theme inline {
${renderDeclarationBlock(theme.theme)}
}`
}

function renderRuntimeCss(theme: Pick<ThemeState, "light" | "dark">) {
  return `:root {
${renderDeclarationBlock(theme.light)}
}

.dark {
${renderDeclarationBlock(theme.dark)}
}`
}

function applyRuntimeTheme(theme: Pick<ThemeState, "light" | "dark">) {
  let styleElement = document.getElementById(styleElementId) as
    | HTMLStyleElement
    | null
  if (!styleElement) {
    styleElement = document.createElement("style")
    styleElement.id = styleElementId
    document.head.appendChild(styleElement)
  }
  styleElement.textContent = renderRuntimeCss(theme)
}

function cloneTheme(theme: ThemeState): ThemeState {
  return {
    light: { ...theme.light },
    dark: { ...theme.dark },
    theme: { ...theme.theme },
  }
}

function applyThemePreset(defaults: ThemeState, preset: ThemePreset): ThemeState {
  return {
    light: { ...defaults.light, ...preset.light },
    dark: { ...defaults.dark, ...preset.dark },
    theme: { ...defaults.theme },
  }
}

function themesMatch(first: ThemeState, second: ThemeState) {
  return (["light", "dark"] as const).every((mode) =>
    Object.keys(first[mode]).every(
      (token) => first[mode][token] === second[mode][token]
    )
  )
}

function TokenConfigurator() {
  const [defaults, setDefaults] = React.useState<ThemeState | null>(null)
  const [theme, setTheme] = React.useState<ThemeState | null>(null)
  const [editingMode, setEditingMode] = React.useState<ColorMode>("light")
  const [previewMode, setPreviewMode] = React.useState<ColorMode>("light")
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch("/r/theme.json")
        if (!response.ok) {
          throw new Error(`无法读取主题配置（${response.status}）`)
        }

        const registry = (await response.json()) as ThemeRegistry
        const baseline = cloneTheme(registry.cssVars)
        const stored = window.localStorage.getItem(storageKey)
        const overrides = stored
          ? (JSON.parse(stored) as Pick<ThemeState, "light" | "dark">)
          : null
        const initialTheme = overrides
          ? {
              light: { ...baseline.light, ...overrides.light },
              dark: { ...baseline.dark, ...overrides.dark },
              theme: baseline.theme,
            }
          : baseline

        setDefaults(baseline)
        setTheme(initialTheme)
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "无法读取主题配置")
      }
    }

    void loadTheme()
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    const updateMode = () =>
      setPreviewMode(root.classList.contains("dark") ? "dark" : "light")

    updateMode()
    const observer = new MutationObserver(updateMode)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!theme) return

    applyRuntimeTheme(theme)
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ light: theme.light, dark: theme.dark })
    )
  }, [theme])

  const changedCount = React.useMemo(() => {
    if (!theme || !defaults) return 0

    return (["light", "dark"] as const).reduce(
      (total, mode) =>
        total +
        Object.keys(defaults[mode]).filter(
          (token) => theme[mode][token] !== defaults[mode][token]
        ).length,
      0
    )
  }, [defaults, theme])

  const activePreset = React.useMemo(() => {
    if (!theme || !defaults) return null

    return (
      themePresets.find((preset) =>
        themesMatch(theme, applyThemePreset(defaults, preset))
      ) ?? null
    )
  }, [defaults, theme])

  function updateToken(token: string, value: string) {
    setTheme((current) =>
      current
        ? {
            ...current,
            [editingMode]: { ...current[editingMode], [token]: value },
          }
        : current
    )
  }

  function resetTheme() {
    if (!defaults) return

    window.localStorage.removeItem(storageKey)
    setTheme(cloneTheme(defaults))
  }

  function selectPreset(preset: ThemePreset) {
    if (!defaults) return

    setTheme(applyThemePreset(defaults, preset))
  }

  async function copyCss() {
    if (!theme) return

    await navigator.clipboard.writeText(renderThemeCss(theme))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  if (error) {
    return (
      <div className="not-prose my-8 border-y border-destructive/40 py-6 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!theme || !defaults) {
    return (
      <div className="not-prose my-8 border-y py-8 text-sm text-muted-foreground">
        正在读取组件库主题配置…
      </div>
    )
  }

  return (
    <div className="not-prose my-8 border-y">
      <div className="flex flex-col gap-4 border-b py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">设计 Token 配置</h2>
            {changedCount > 0 ? (
              <span className="text-xs text-muted-foreground">
                已修改 {changedCount} 项
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            修改会实时作用于整个文档站，并保存在当前浏览器。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle mode="light-dark" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={changedCount === 0}
            onClick={resetTheme}
          >
            <RotateCcwIcon />
            重置
          </Button>
          <Button type="button" size="sm" onClick={copyCss}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "已复制" : "复制 CSS"}
          </Button>
        </div>
      </div>

      <div className="border-b py-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">主题预设</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            一次应用完整的浅色与深色语义色板，之后仍可逐项微调。
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={activePreset?.id === preset.id}
              className="flex min-w-0 items-center gap-3 rounded-md border border-border px-3 py-2.5 text-left outline-none transition-[border-color,background-color,box-shadow] hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/25 aria-pressed:border-foreground aria-pressed:bg-accent/70"
              onClick={() => selectPreset(preset)}
            >
              <span className="flex shrink-0 -space-x-1">
                {preset.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className="size-5 rounded-full border-2 border-background"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">
                  {preset.name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {preset.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="py-6 xl:pr-8">
          <div
            className="mb-6 flex border-b"
            role="tablist"
            aria-label="编辑颜色模式"
          >
            {(["light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={editingMode === mode}
                className={cn(
                  "relative px-4 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  editingMode === mode &&
                    "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground"
                )}
                onClick={() => setEditingMode(mode)}
              >
                {mode === "light" ? "浅色 Token" : "深色 Token"}
              </button>
            ))}
          </div>

          <div>
            {tokenGroups.map((group, groupIndex) => (
              <section
                key={group.name}
                className={cn(groupIndex > 0 && "mt-8 border-t pt-8")}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">{group.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <div>
                  {group.tokens.map((token) => (
                    <TokenField
                      key={token}
                      token={token}
                      value={theme[editingMode][token]}
                      changed={
                        theme[editingMode][token] !==
                        defaults[editingMode][token]
                      }
                      onChange={(value) => updateToken(token, value)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="border-t bg-muted/20 py-6 xl:border-l xl:border-t-0 xl:pl-8">
          <div className="sticky top-20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">实时预览</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  当前为{previewMode === "light" ? "浅色" : "深色"}模式
                </p>
              </div>
              <span className="size-3 rounded-full bg-primary ring-4 ring-primary/15" />
            </div>

            <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-xs">
              <p className="text-sm font-semibold">创建新项目</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                预览表面、文本、输入框和操作层级。
              </p>
              <Input
                wrapperClassName="mt-4"
                label="项目名称"
                defaultValue="WUI"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm">确认</Button>
                <Button size="sm" variant="secondary">
                  暂存
                </Button>
                <Button size="sm" variant="outline">
                  取消
                </Button>
              </div>
            </div>

            <div className="divide-y border-y">
              <StatusPreview
                label="信息"
                className="bg-info/10 text-info"
                dotClassName="bg-info"
              />
              <StatusPreview
                label="操作成功"
                className="bg-success/10 text-success"
                dotClassName="bg-success"
              />
              <StatusPreview
                label="需要注意"
                className="bg-warning/10 text-warning"
                dotClassName="bg-warning"
              />
              <StatusPreview
                label="危险操作"
                className="bg-destructive/10 text-destructive"
                dotClassName="bg-destructive"
              />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              复制结果包含浅色、深色和 Tailwind 主题映射，可直接写入全局 CSS。
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function TokenThemeRuntime() {
  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return

    const theme = JSON.parse(stored) as Pick<ThemeState, "light" | "dark">
    applyRuntimeTheme(theme)
  }, [])

  return null
}

function TokenField({
  token,
  value,
  changed,
  onChange,
}: {
  token: string
  value: string
  changed: boolean
  onChange: (value: string) => void
}) {
  const cssProperty = token === "radius" ? "border-radius" : "color"
  const isValid =
    typeof CSS === "undefined" || CSS.supports(cssProperty, value.trim())

  return (
    <div className="grid gap-2 border-t py-3 sm:grid-cols-[minmax(10rem,0.9fr)_minmax(0,1.3fr)_2.25rem] sm:items-center">
      <span className="flex min-w-0 items-center gap-2">
        <code className="truncate text-xs text-foreground">--{token}</code>
        {changed ? (
          <span
            className="size-1.5 shrink-0 rounded-full bg-primary"
            title="已修改"
          />
        ) : null}
      </span>
      <label>
        <span className="sr-only">--{token} 的 CSS 值</span>
        <input
          value={value}
          aria-invalid={!isValid}
          spellCheck={false}
          className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 font-mono text-xs outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-2 focus:ring-ring/25 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/15"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      {token === "radius" ? (
        <span
          aria-hidden
          className="size-9 border bg-primary shadow-xs"
          style={{ borderRadius: value }}
        />
      ) : (
        <ColorPicker
          value={value}
          label={`选择 --${token}`}
          onValueChange={onChange}
        />
      )}
    </div>
  )
}

function StatusPreview({
  label,
  className,
  dotClassName,
}: {
  label: string
  className: string
  dotClassName: string
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2.5 text-xs", className)}>
      <span className={cn("size-1.5 rounded-full", dotClassName)} />
      {label}
    </div>
  )
}

export { TokenConfigurator, TokenThemeRuntime }
