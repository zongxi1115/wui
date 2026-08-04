"use client"

import * as React from "react"

import { Playgrounds } from "@/registry/__playground__"
import { Props, type PropMeta } from "@/registry/__props__"
import { cn } from "@/registry/lib/utils"

type Value = string | number | boolean

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidUpdate(prev: { children: React.ReactNode }) {
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null })
    }
  }
  render() {
    if (this.state.error) {
      return (
        <p className="text-sm text-destructive">
          {this.state.error.message}
        </p>
      )
    }
    return this.props.children
  }
}

export interface PlaygroundProps {
  /** Registry item name (must be in the generated playground map). */
  name: string
  /** Default text content rendered as children. */
  children?: string
  /** Prop names to hide from the controls (e.g. "asChild"). */
  exclude?: string[]
  /** Show an editable "children" text field. @default true */
  childrenControl?: boolean
}

export function Playground({
  name,
  children = "Button",
  exclude = [],
  childrenControl = true,
}: PlaygroundProps) {
  const Comp = Playgrounds[name]
  const controls = (Props[name] ?? []).filter(
    (p) => !exclude.includes(p.name)
  )

  const [values, setValues] = React.useState<Record<string, Value>>(() =>
    initialValues(controls)
  )
  const [label, setLabel] = React.useState(children)

  if (!Comp) {
    return (
      <p className="my-6 text-sm text-destructive">
        暂未为 <code>{name}</code> 注册交互演示。
      </p>
    )
  }

  const componentProps: Record<string, unknown> = {}
  for (const p of controls) {
    const v = values[p.name]
    if (v === undefined || v === "") continue
    componentProps[p.name] = v
  }

  return (
    <div className="my-6 grid gap-0 overflow-hidden rounded-lg border md:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <ErrorBoundary key={JSON.stringify(componentProps) + label}>
          <Comp {...componentProps}>{label}</Comp>
        </ErrorBoundary>
      </div>

      <div className="space-y-4 border-t bg-muted/20 p-4 md:border-l md:border-t-0">
        {childrenControl ? (
          <Field label="children" description="组件内部渲染的内容。">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </Field>
        ) : null}

        {controls.map((p) => (
          <Field key={p.name} label={p.name} description={p.description}>
            <Control
              meta={p}
              value={values[p.name]}
              onChange={(v) => setValues((s) => ({ ...s, [p.name]: v }))}
            />
          </Field>
        ))}
      </div>
    </div>
  )
}

function initialValues(controls: PropMeta[]): Record<string, Value> {
  const init: Record<string, Value> = {}
  for (const p of controls) {
    if (p.defaultValue !== undefined) {
      if (p.control === "boolean") init[p.name] = p.defaultValue === "true"
      else if (p.control === "number") init[p.name] = Number(p.defaultValue)
      else init[p.name] = p.defaultValue
    } else if (p.control === "boolean") {
      init[p.name] = false
    } else if (p.control === "select" && p.options?.length) {
      init[p.name] = p.options[0]
    }
  }
  return init
}

function Field({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-xs font-medium text-foreground">
        {label}
      </label>
      {children}
      {description ? (
        <p className="text-[11px] leading-snug text-muted-foreground">
          {description.replace(/\s+/g, " ").trim()}
        </p>
      ) : null}
    </div>
  )
}

function Control({
  meta,
  value,
  onChange,
}: {
  meta: PropMeta
  value: Value | undefined
  onChange: (value: Value) => void
}) {
  if (meta.control === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {meta.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  if (meta.control === "boolean") {
    const checked = Boolean(value)
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "inline-flex h-5 w-9 items-center rounded-full border transition-colors",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
    )
  }

  if (meta.control === "number") {
    return (
      <input
        type="number"
        value={value === undefined ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    )
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    />
  )
}
