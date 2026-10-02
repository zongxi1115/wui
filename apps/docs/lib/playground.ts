import type { PropMeta } from "@/registry/__props__"
import type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundValue,
} from "@/lib/playground-types"

export function getPlaygroundControls(
  config: PlaygroundConfig,
  props: PropMeta[],
  exclude: string[] = []
) {
  if (config.demo) return config.targets![0].controls
  const overrides = config.controls ?? {}
  const metadata = new Map(props.map((prop) => [prop.name, prop]))
  const hidden = new Set([
    "asChild",
    "as",
    "children",
    ...(config.exclude ?? []),
    ...exclude,
  ])
  return [...new Set([...metadata.keys(), ...Object.keys(overrides)])]
    .filter((name) => !hidden.has(name))
    .map((name): PlaygroundControl => ({
      name,
      type: "string",
      control: "text",
      required: false,
      ...metadata.get(name),
      ...overrides[name],
    }))
    .filter((prop) => prop.control !== "text" || prop.type === "string")
}

export function initialPlaygroundValues(
  config: PlaygroundConfig,
  controls: PlaygroundControl[]
) {
  const values: Record<string, PlaygroundValue> = {}
  if (config.demo) return values
  for (const prop of controls) {
    if (prop.defaultValue === undefined) continue
    if (prop.control === "boolean")
      values[prop.name] = prop.defaultValue === "true"
    else if (prop.control === "number")
      values[prop.name] = Number(prop.defaultValue)
    else values[prop.name] = prop.defaultValue
  }
  return { ...values, ...config.props }
}

export function initialDemoValues(config: PlaygroundConfig) {
  const values: Record<string, PlaygroundValue> = {}
  for (const target of config.targets ?? []) {
    for (const control of target.controls) {
      const key = `${target.id}.${control.name}`
      if (control.initialValue !== undefined) values[key] = control.initialValue
      else if (control.defaultValue !== undefined) {
        values[key] =
          control.control === "boolean"
            ? control.defaultValue === "true"
            : control.control === "number" || control.numericOptions
              ? Number(control.defaultValue)
              : control.defaultValue
      }
    }
  }
  return values
}

/** Patch the original example, keeping its imports, data, hooks and composition. */
export function getPlaygroundDemoCode(
  config: PlaygroundConfig,
  source: string,
  values: Record<string, PlaygroundValue>
) {
  const edits: Array<{ start: number; end: number; text: string }> = []
  for (const edit of config.sourceEdits!) {
    if (edit.prop) {
      const key = `${edit.target}.${edit.prop}`
      if (key in values) {
        if (edit.binding) {
          const existing = edits.findIndex(
            (entry) => entry.start === edit.binding!.start
          )
          const next = { ...edit.binding, text: JSON.stringify(values[key]) }
          if (existing >= 0) edits[existing] = next
          else edits.push(next)
        } else
          edits.push({
            ...edit,
            text:
              edit.kind === "jsx"
                ? ""
                : `${edit.prop}: ${JSON.stringify(values[key])}`,
          })
      }
    } else {
      const props = Object.entries(values)
        .filter(([key]) => key.startsWith(`${edit.target}.`))
        .filter(
          ([key]) =>
            !config.sourceEdits!.some(
              (entry) =>
                entry.target === edit.target &&
                entry.prop === key.slice(edit.target.length + 1) &&
                entry.binding
            )
        )
      // JSX duplicate props are removed above; object entries are replaced in place.
      if (edit.kind === "jsx") {
        const text = props
          .map(
            ([key, value]) =>
              ` ${key.slice(edit.target.length + 1)}={${JSON.stringify(value)}}`
          )
          .join("")
        if (text) edits.push({ ...edit, text })
      } else {
        const present = new Set(
          config
            .sourceEdits!.filter(
              (existing) => existing.group === edit.group && existing.prop
            )
            .map((existing) => existing.prop)
        )
        const text = props
          .filter(([key]) => !present.has(key.slice(edit.target.length + 1)))
          .map(
            ([key, value]) =>
              `${key.slice(edit.target.length + 1)}: ${JSON.stringify(value)}`
          )
          .join(", ")
        const before = source.slice(edit.group! + 1, edit.start).trimEnd()
        if (text)
          edits.push({
            ...edit,
            text: `${before && !before.endsWith(",") ? ", " : " "}${text} `,
          })
      }
    }
  }
  for (const edit of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end)
  return source
    .replaceAll("@/registry/lib/utils", "@/lib/utils")
    .replaceAll("@/registry/ui/", "@/components/ui/")
    .replaceAll("@/registry/charts/", "@/components/charts/")
    .replaceAll("@/registry/hooks/", "@/hooks/")
    .replaceAll("@/registry/components/", "@/components/")
}

export function getPlaygroundCode(
  name: string,
  config: PlaygroundConfig,
  props: Record<string, unknown>,
  children?: string
) {
  const state = config.state
  const attributes = Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (key === state?.prop) return `      ${key}={value}`
      return `      ${key}={${JSON.stringify(value)}}`
    })
  if (state) {
    const handler =
      state.event === "onChange"
        ? "(event) => setValue(event.target.value)"
        : name === "checkbox"
          ? "(checked) => setValue(checked === true)"
          : "setValue"
    attributes.push(`      ${state.event}={${handler}}`)
  }
  const stateType = name === "input-number" ? "<number | null>" : ""
  const imports = `${state ? 'import { useState } from "react"\n' : ""}import { ${config.exportName} } from "@/components/ui/${name}"`
  const setup = state
    ? `  const [value, setValue] = useState${stateType}(${JSON.stringify(props[state.prop])})\n\n`
    : ""
  const opening = `    <${config.exportName}${attributes.length ? "\n" + attributes.join("\n") + "\n    " : ""}`
  const element =
    children === undefined
      ? `${opening}/>`
      : `${opening}>\n      {${JSON.stringify(children)}}\n    </${config.exportName}>`
  return `"use client"\n\n${imports}\n\nexport function Example() {\n${setup}  return (\n${element}\n  )\n}\n`
}
