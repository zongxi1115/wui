import type { PropMeta } from "@/registry/__props__"

export type PlaygroundValue =
  | string
  | number
  | boolean
  | null
  | PlaygroundValue[]
  | { [key: string]: PlaygroundValue }

export interface PlaygroundControl extends Omit<PropMeta, "control"> {
  control: PropMeta["control"] | "json"
  min?: number
  max?: number
  step?: number
  initialValue?: PlaygroundValue
  numericOptions?: boolean
}

export interface PlaygroundTarget {
  id: string
  label: string
  exportName: string
  controls: PlaygroundControl[]
  events: Record<string, string>
  nativeEvents?: string[]
}

export interface PlaygroundSourceEdit {
  target: string
  start: number
  end: number
  prop?: string
  kind: "jsx" | "object"
  group?: number
  binding?: { start: number; end: number }
}

export interface PlaygroundConfig {
  exportName: string
  children?: string
  props?: Record<string, PlaygroundValue>
  controls?: Record<string, Partial<PlaygroundControl>>
  exclude?: string[]
  state?: { prop: string; event: string; array?: boolean }
  demo?: string
  previewClassName?: string
  targets?: PlaygroundTarget[]
  sourceEdits?: PlaygroundSourceEdit[]
}
