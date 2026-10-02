"use client"

import * as React from "react"
import { RotateCcwIcon, RotateCwIcon } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { PlaygroundContext } from "@/components/playground-context"
import {
  getPlaygroundCode,
  getPlaygroundDemoCode,
  initialDemoValues,
  initialPlaygroundValues,
} from "@/lib/playground"
import type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundValue,
} from "@/lib/playground-types"
import { Playgrounds } from "@/registry/__playground__"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { InputNumber } from "@/registry/ui/input-number"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import { Slider } from "@/registry/ui/slider"
import { Switch } from "@/registry/ui/switch"
import { Textarea } from "@/registry/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export interface PlaygroundProps {
  name: string
  children?: string
  exclude?: string[]
  childrenControl?: boolean
  previewClassName?: string
  source?: string
  config: PlaygroundConfig
  controls: PlaygroundControl[]
}

export function PlaygroundClient({ name, ...props }: PlaygroundProps) {
  return <PlaygroundContent key={name} name={name} {...props} />
}

function PlaygroundContent({
  name,
  children,
  exclude,
  childrenControl,
  previewClassName,
  source,
  config,
  controls: standaloneControls,
}: PlaygroundProps) {
  const Comp = Playgrounds[name]
  const [targetId, setTargetId] = React.useState(config.targets?.[0].id)
  const controls = React.useMemo(
    () =>
      (config.demo
        ? config.targets!.find((target) => target.id === targetId)!.controls
        : standaloneControls
      ).filter((control) => !exclude?.includes(control.name)),
    [standaloneControls, exclude, config, targetId]
  )
  const defaultChildren = children ?? config.children
  const showChildren = childrenControl ?? defaultChildren !== undefined
  const [values, setValues] = React.useState(() =>
    initialPlaygroundValues(config, controls)
  )
  const [label, setLabel] = React.useState(defaultChildren ?? "")
  const [previewKey, setPreviewKey] = React.useState(0)
  const [samples, setSamples] = React.useState(() => initialDemoValues(config))
  const id = React.useId()

  const update = React.useCallback(
    (name: string, value: PlaygroundValue | undefined) => {
      setValues((current) => {
        const next = { ...current }
        if (value === undefined && name === config.state?.prop)
          next[name] = null
        else if (value === undefined) delete next[name]
        else next[name] = value
        return next
      })
    },
    [config]
  )
  const report = React.useCallback(
    (target: string, props: Record<string, PlaygroundValue>) => {
      setSamples((current) => {
        const next = { ...current }
        let changed = false
        for (const [prop, value] of Object.entries(props)) {
          const key = `${target}.${prop}`
          if (JSON.stringify(current[key]) !== JSON.stringify(value)) {
            next[key] = value
            changed = true
          }
        }
        return changed ? next : current
      })
    },
    []
  )
  const context = React.useMemo(
    () => ({ config, values, report, change: update }),
    [config, values, report, update]
  )

  const componentProps: Record<string, unknown> = { ...values }
  const state = config.state
  if (state?.array) componentProps[state.prop] = [values[state.prop]]
  const code = config.demo
    ? getPlaygroundDemoCode(config, source!, values)
    : getPlaygroundCode(
        name,
        config,
        componentProps,
        showChildren ? label : defaultChildren
      )
  if (state) {
    componentProps[state.event] = (next: unknown) => {
      const value =
        state.event === "onChange"
          ? (next as React.ChangeEvent<HTMLInputElement>).target.value
          : state.array
            ? (next as number[])[0]
            : (next as PlaygroundValue)
      update(state.prop, value)
    }
  }

  return (
    <section
      className="not-prose my-6 min-w-0"
      aria-label={`${config.exportName} Playground`}
    >
      <Tabs defaultValue="preview">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b">
          <TabsList
            variant="underline"
            aria-label="Playground 视图"
            className="border-0"
          >
            <TabsTrigger value="preview">Playground</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreviewKey((key) => key + 1)}
              aria-label="重新播放预览"
              title="重新播放预览"
            >
              <RotateCwIcon aria-hidden="true" className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setValues(initialPlaygroundValues(config, controls))
                setLabel(defaultChildren ?? "")
                setSamples(initialDemoValues(config))
                setPreviewKey((key) => key + 1)
              }}
            >
              <RotateCcwIcon aria-hidden="true" className="size-3.5" />
              重置
            </Button>
          </div>
        </div>
        <TabsContent
          value="preview"
          forceMount
          className="mt-0 data-[state=inactive]:hidden"
        >
          <div className="grid min-w-0 rounded-b-lg border border-t-0 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div
              className={cn(
                "flex min-h-[280px] min-w-0 items-center justify-center overflow-x-auto p-6",
                config.previewClassName,
                previewClassName
              )}
            >
              <div
                className={cn(
                  "flex w-full min-w-0 items-center justify-center [&>input]:w-full",
                  !config.demo && "max-w-sm"
                )}
              >
                <React.Suspense
                  fallback={
                    <span className="text-muted-foreground text-sm">
                      加载预览…
                    </span>
                  }
                >
                  <PlaygroundContext.Provider value={context}>
                    <Comp
                      key={previewKey}
                      {...(config.demo ? {} : componentProps)}
                    >
                      {showChildren ? label : defaultChildren}
                    </Comp>
                  </PlaygroundContext.Provider>
                </React.Suspense>
              </div>
            </div>
            <div className="bg-muted/20 min-w-0 border-t lg:border-l lg:border-t-0">
              <div className="border-b px-4 py-3">
                <p className="text-xs font-medium">属性设置</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  调整后即时预览效果
                </p>
              </div>
              <div className="max-h-[28rem] space-y-5 overflow-y-auto p-4">
                {config.targets && config.targets.length > 1 && (
                  <Field
                    id={`${id}-target`}
                    label="组件"
                    description="选择需要调节的子组件或示例实例。"
                  >
                    <Select value={targetId} onValueChange={setTargetId}>
                      <SelectTrigger
                        id={`${id}-target`}
                        aria-describedby={`${id}-target-description`}
                        size="sm"
                        className="w-full min-w-0"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {config.targets.map((target) => (
                          <SelectItem key={target.id} value={target.id}>
                            {target.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                {showChildren && (
                  <Field
                    id={`${id}-children`}
                    label="children"
                    description="组件显示的文本内容。"
                  >
                    <Input
                      id={`${id}-children`}
                      aria-describedby={`${id}-children-description`}
                      size="sm"
                      value={label}
                      onChange={(event) => setLabel(event.target.value)}
                    />
                  </Field>
                )}
                {controls.map((meta) => (
                  <Field
                    key={meta.name}
                    id={`${id}-${meta.name}`}
                    label={meta.name}
                    description={meta.description}
                  >
                    <Control
                      id={`${id}-${meta.name}`}
                      meta={meta}
                      value={
                        config.demo
                          ? Object.hasOwn(values, `${targetId}.${meta.name}`)
                            ? values[`${targetId}.${meta.name}`]
                            : samples[`${targetId}.${meta.name}`]
                          : values[meta.name]
                      }
                      onChange={(value) => {
                        update(
                          config.demo ? `${targetId}.${meta.name}` : meta.name,
                          value
                        )
                        if (config.demo && meta.name.startsWith("default"))
                          setPreviewKey((key) => key + 1)
                      }}
                    />
                  </Field>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-0">
          <div className="bg-muted/20 group relative min-w-0 rounded-b-lg border border-t-0">
            <CopyButton value={code} className="opacity-100" />
            <pre className="m-0 max-h-[32rem] overflow-auto p-4 pr-14 text-xs leading-relaxed sm:text-sm">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function Field({
  id,
  label,
  description,
  children,
}: {
  id: string
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="block font-mono text-xs font-medium"
      >
        {label}
      </label>
      {children}
      {description && (
        <p
          id={`${id}-description`}
          className="text-muted-foreground text-xs leading-relaxed"
        >
          {description.replace(/\s+/g, " ").trim()}
        </p>
      )}
    </div>
  )
}

function Control({
  id,
  meta,
  value,
  onChange,
}: {
  id: string
  meta: PlaygroundControl
  value?: PlaygroundValue
  onChange: (value: PlaygroundValue | undefined) => void
}) {
  const a11y = {
    id,
    "aria-describedby": meta.description ? `${id}-description` : undefined,
  }
  if (meta.control === "json")
    return <JsonControl {...a11y} value={value} onChange={onChange} />
  if (meta.control === "select") {
    return (
      <Select
        value={String(value ?? "__default__")}
        onValueChange={(next) =>
          onChange(
            next === "__default__"
              ? undefined
              : meta.numericOptions
                ? Number(next)
                : next
          )
        }
      >
        <SelectTrigger {...a11y} size="sm" className="w-full min-w-0">
          <SelectValue placeholder="组件默认" />
        </SelectTrigger>
        <SelectContent>
          {!meta.required && (
            <SelectItem value="__default__">组件默认</SelectItem>
          )}
          {meta.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  if (meta.control === "boolean")
    return (
      <Switch {...a11y} checked={Boolean(value)} onCheckedChange={onChange} />
    )
  if (meta.control === "number") {
    const numericValue = typeof value === "number" ? value : null
    function change(next: number | null) {
      if (next === null) {
        if (!meta.required) onChange(undefined)
        return
      }
      onChange(
        Math.min(meta.max ?? Infinity, Math.max(meta.min ?? -Infinity, next))
      )
    }
    return (
      <div className="space-y-2">
        {meta.min !== undefined && meta.max !== undefined && (
          <Slider
            aria-labelledby={`${id}-label`}
            aria-describedby={a11y["aria-describedby"]}
            value={[numericValue ?? meta.min]}
            min={meta.min}
            max={meta.max}
            step={meta.step ?? 1}
            onValueChange={([next]) => change(next)}
          />
        )}
        <InputNumber
          {...a11y}
          size="sm"
          value={numericValue}
          min={meta.min}
          max={meta.max}
          step={meta.step ?? 1}
          onValueChange={change}
        />
      </div>
    )
  }
  return (
    <Input
      {...a11y}
      size="sm"
      value={String(value ?? "")}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function JsonControl({
  id,
  value,
  onChange,
  "aria-describedby": description,
}: {
  id: string
  value?: PlaygroundValue
  onChange: (value: PlaygroundValue | undefined) => void
  "aria-describedby"?: string
}) {
  const serialized = value === undefined ? "" : JSON.stringify(value, null, 2)
  const [draft, setDraft] = React.useState(serialized)
  const [error, setError] = React.useState("")
  const [previous, setPrevious] = React.useState(serialized)
  if (previous !== serialized) {
    setPrevious(serialized)
    setDraft(serialized)
    setError("")
  }
  return (
    <div className="space-y-2">
      <Textarea
        id={id}
        value={draft}
        rows={5}
        resize="vertical"
        className="font-mono text-xs"
        aria-invalid={Boolean(error)}
        aria-describedby={[description, error ? `${id}-error` : undefined]
          .filter(Boolean)
          .join(" ")}
        onChange={(event) => {
          const next = event.target.value
          setDraft(next)
          if (!next.trim()) {
            setError("")
            onChange(undefined)
            return
          }
          try {
            const parsed = JSON.parse(next) as PlaygroundValue
            if (Array.isArray(value) && !Array.isArray(parsed)) {
              setError("请输入 JSON 数组。")
              return
            }
            setError("")
            onChange(parsed)
          } catch {
            setError("JSON 格式不正确，请检查引号和逗号。")
          }
        }}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="text-destructive text-xs"
          role="status"
        >
          {error}
        </p>
      )}
    </div>
  )
}
