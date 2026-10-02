import type {
  PlaygroundConfig,
  PlaygroundControl,
} from "@/lib/playground-types"
export type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundValue,
} from "@/lib/playground-types"

const checked = {
  checked: {
    type: "boolean",
    control: "boolean",
    description: "当前选中状态，可通过预览或属性面板切换。",
  },
} as const
const text = (description: string): Partial<PlaygroundControl> => ({
  type: "string",
  control: "text",
  description,
})
const number = (
  description: string,
  min?: number,
  max?: number
): Partial<PlaygroundControl> => ({
  type: "number",
  control: "number",
  description,
  min,
  max,
})

// Components that render independently use a compact, curated preview.
export const standalonePlaygroundConfigs: Record<string, PlaygroundConfig> = {
  button: {
    exportName: "Button",
    children: "保存更改",
    props: { type: "button" },
    controls: { loadingText: text("加载状态下的按钮文案。") },
  },
  badge: { exportName: "Badge", children: "进行中" },
  input: {
    exportName: "Input",
    props: { "aria-label": "示例输入框", placeholder: "输入内容…", value: "" },
    controls: {
      label: text("输入框的浮动标签。"),
      placeholder: text("输入框为空时的提示。"),
      value: text("当前输入内容。"),
    },
    state: { prop: "value", event: "onChange" },
  },
  textarea: {
    exportName: "Textarea",
    props: {
      "aria-label": "示例文本域",
      placeholder: "写下你的想法…",
      value: "",
      maxLength: 200,
    },
    controls: {
      value: text("当前文本内容。"),
      placeholder: text("文本域为空时的提示。"),
      maxLength: number("允许输入的最大字符数。", 1),
      autoSize: { type: "boolean", control: "boolean" },
    },
    state: { prop: "value", event: "onChange" },
  },
  "input-number": {
    exportName: "InputNumber",
    props: { "aria-label": "示例数值输入框", value: 5 },
    controls: {
      value: number("当前数值。"),
      prefix: text("数值前的文本。"),
      suffix: text("数值后的单位。"),
      step: { min: 0.01, step: 0.01 },
    },
    exclude: ["defaultValue"],
    state: { prop: "value", event: "onValueChange" },
  },
  checkbox: {
    exportName: "Checkbox",
    props: { "aria-label": "接受协议", checked: false },
    controls: checked,
    state: { prop: "checked", event: "onCheckedChange" },
  },
  switch: {
    exportName: "Switch",
    props: { "aria-label": "开启通知", checked: false },
    controls: checked,
    state: { prop: "checked", event: "onCheckedChange" },
  },
  toggle: {
    exportName: "Toggle",
    children: "加粗",
    props: { pressed: false },
    controls: {
      pressed: {
        type: "boolean",
        control: "boolean",
        description: "按钮是否处于开启状态。",
      },
      variant: { control: "select", options: ["default", "outline"] },
      size: { control: "select", options: ["sm", "default", "lg"] },
    },
    state: { prop: "pressed", event: "onPressedChange" },
  },
  slider: {
    exportName: "Slider",
    props: { "aria-label": "调整数值", value: 50 },
    controls: {
      value: { ...number("滑块当前数值。", 0, 100), required: true },
    },
    state: { prop: "value", event: "onValueChange", array: true },
  },
  progress: {
    exportName: "Progress",
    props: { "aria-label": "完成进度", value: 65 },
    controls: { value: number("当前完成进度。", 0, 100) },
  },
  skeleton: { exportName: "Skeleton", props: { className: "h-16 w-40" } },
  spin: {
    exportName: "Spin",
    props: { label: "加载中…" },
    exclude: ["fullscreen"],
    controls: { label: text("显示在加载指示器旁的文案。"), delay: { min: 0 } },
  },
  "number-ticker": {
    exportName: "NumberTicker",
    props: { value: 1280, className: "text-4xl font-semibold tabular-nums" },
    controls: {
      decimalPlaces: { min: 0, max: 20 },
      delay: { min: 0 },
      prefix: text("数字前的文本。"),
      suffix: text("数字后的单位。"),
    },
    exclude: ["locale"],
  },
  "shiny-button": {
    exportName: "ShinyButton",
    children: "开始使用",
    props: { type: "button" },
    controls: { speed: { min: 0.1, step: 0.1 }, gap: { min: 0, step: 0.1 } },
  },
  "text-shimmer": {
    exportName: "TextShimmer",
    children: "正在思考…",
    props: { className: "text-2xl font-medium" },
    controls: {
      duration: { min: 0.1, step: 0.1 },
      spread: { min: 0.1, step: 0.1 },
    },
  },
  "text-shimmer-wave": {
    exportName: "TextShimmerWave",
    children: "WUI Design",
    props: { className: "text-2xl font-medium" },
    controls: {
      duration: { min: 0.1, step: 0.1 },
      scaleDistance: { min: 0.1, step: 0.1 },
      spread: { min: 0.1, step: 0.1 },
    },
  },
  "text-highlight": {
    exportName: "TextHighlight",
    children: "让重要内容更清晰",
    props: { className: "text-2xl font-medium" },
    exclude: ["active"],
    controls: {
      duration: { min: 0.1, step: 0.1 },
      delay: { min: 0, step: 0.1 },
    },
  },
}
