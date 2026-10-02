import { NotFoundError, type Registry } from "./registry"
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv"
import type { JsonSchemaType } from "@modelcontextprotocol/sdk/validation/types.js"
import type { ComponentDigest, IndexEntry, PropMeta } from "./types"

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: "object"
    properties: Record<string, JsonSchemaType>
    required?: string[]
    additionalProperties?: boolean
  }
  handler: (
    args: Record<string, unknown>,
    registry: Registry
  ) => Promise<string>
}

// ---------------------------------------------------------------------------
// Renderers — markdown rather than raw JSON: same information, fewer tokens,
// and models follow prose constraints ("何时使用") better than a JSON blob.
// ---------------------------------------------------------------------------
function renderProp(p: PropMeta): string {
  const bits = [`- \`${p.name}\`: ${p.type}`]
  if (p.required) bits.push(" **（必填）**")
  else if (p.defaultValue) bits.push(`（默认值：\`${p.defaultValue}\`）`)
  if (p.description) bits.push(` — ${p.description.replace(/\s*\n\s*/g, " ")}`)
  return bits.join("")
}

function renderComponent(d: ComponentDigest): string {
  const out: string[] = [`# ${d.title} (\`${d.name}\`)`, "", d.description, ""]

  if (d.import) out.push(`**导入**：\`${d.import}\``)
  out.push(`**安装**：\`${d.install.wui}\``)
  if (d.install.npmDependencies.length) {
    out.push(`**npm 依赖**：${d.install.npmDependencies.join("、")}`)
  }
  if (d.install.registryDependencies.length) {
    out.push(
      `**registry 依赖**：${d.install.registryDependencies.join("、")}（会自动一起安装）`
    )
  }
  if (d.docsUrl) out.push(`**文档**：${d.docsUrl}`)
  out.push("")

  out.push("## 属性", "")
  for (const part of d.api) {
    out.push(`### ${part.name}`, "")
    out.push(
      part.props.length
        ? part.props.map(renderProp).join("\n")
        : "_未提取到专用属性，请结合示例或源码确认用法。_"
    )
    out.push("")
  }
  if (!d.api.length)
    out.push("_此条目没有组件属性摘要，请查看示例或源码中的函数签名。_", "")
  out.push(
    "> 属性按导出组件分别列出；常规 DOM 属性已省略。属性是否透传、落在哪个元素上，以对应组件类型和实现为准。",
    ""
  )
  if (d.types.length) {
    out.push(
      "## 关联类型",
      "",
      "```ts",
      ...d.types.map((t) => t.definition),
      "```",
      ""
    )
  }

  if (d.usage) out.push("## 何时使用", "", d.usage, "")
  if (d.events) out.push("## 事件", "", d.events, "")
  if (d.extended) out.push("## 进阶用法", "", d.extended, "")
  if (d.accessibility) out.push("## 无障碍与交互", "", d.accessibility, "")

  if (d.examples.length) {
    out.push("## 可用示例", "")
    out.push(
      d.examples
        .map((e) => `- \`${e.name}\`${e.title ? ` — ${e.title}` : ""}`)
        .join("\n")
    )
    out.push("", "用 `wui_get_example` 取其中任意一个的完整代码。")
  }
  return out.join("\n").trim()
}

function renderIndexEntry(i: IndexEntry): string {
  const props = i.keyProps.length ? ` — 关键属性：${i.keyProps.join("；")}` : ""
  return `- \`${i.name}\` **${i.title}**: ${i.description}${props}`
}

function relevance(entry: IndexEntry, query: string): number {
  const name = entry.name.toLowerCase()
  const title = entry.title.toLowerCase()
  const categories = (entry.categories ?? []).map((c) => c.toLowerCase())
  const detail =
    `${entry.description} ${entry.keyProps.join(" ")}`.toLowerCase()
  const q = query.toLowerCase()
  let score = name === q ? 1000 : 0
  for (const term of q.split(/\s+/)) {
    if (name === term) score += 100
    else if (name.startsWith(term)) score += 80
    else if (name.includes(term)) score += 60
    else if (title.split(/\s+/).includes(term) || categories.includes(term))
      score += 50
    else if (title.includes(term)) score += 30
    else if (detail.includes(term)) score += 10
    else return 0
  }
  return score
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------
export const tools: ToolDefinition[] = [
  {
    name: "wui_overview",
    description:
      "wui 组件库的总体说明：技术栈、安装方式、导入路径约定、设计 token 用法，以及生成 wui 代码时必须遵守的规则。在第一次为该项目写 UI 代码前调用一次。",
    inputSchema: { type: "object", properties: {} },
    async handler(_args, registry) {
      const o = await registry.overview()
      const groups = Object.keys(o.tokens).filter((g) => g !== "theme")
      const names = [
        ...new Set(groups.flatMap((g) => Object.keys(o.tokens[g]))),
      ]
      return [
        o.instructions.trim(),
        "",
        `## 可用组件`,
        "",
        `共 ${o.componentCount} 个，用 \`wui_search_components\` 按关键词查找。`,
        "",
        `## 语义 token（${groups.join(" / ")}）`,
        "",
        names.map((n) => `\`${n}\``).join("、"),
        "",
        "具体色值用 `wui_get_theme_tokens` 查看。",
      ].join("\n")
    },
  },

  {
    name: "wui_search_components",
    description:
      '按关键词搜索 wui 组件，返回名称、标题、简介和关键 props，例如搜索 "dialog"、"表格"、"文字动效"。不会返回全量组件清单，用它确认某个组件是否存在、该用哪一个。',
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          pattern: "\\S",
          description:
            "搜索关键词，支持中英文，多个词以空格分隔（需全部命中）。",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 30,
          description: "最多返回多少条结果，默认 12，最大 30。",
        },
      },
      required: ["query"],
    },
    async handler(args, registry) {
      const { items } = await registry.index()
      const q = (args.query as string).trim()
      const limit = (args.limit as number | undefined) ?? 12
      const matchesAll = items
        .map((item) => ({ item, score: relevance(item, q) }))
        .filter(({ score }) => score > 0)
        .sort(
          (a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name)
        )
        .map(({ item }) => item)
      const hits = matchesAll.slice(0, limit)
      if (!hits.length) {
        return `没有匹配 "${q}" 的组件。请尝试更短的名称、用途或类别关键词。`
      }
      return [
        `匹配 "${q}" 的组件（返回 ${hits.length} 条，共 ${matchesAll.length} 条匹配）：`,
        "",
        ...hits.map(renderIndexEntry),
        matchesAll.length > hits.length
          ? `\n结果已截断，可缩小关键词范围或把 limit 调高至最多 30。`
          : "",
        "",
        "用 `wui_get_component` 获取某个组件的 API 摘要和用法。",
      ].join("\n")
    },
  },

  {
    name: "wui_get_component",
    description:
      "获取单个 wui 组件的 API 摘要：按导出组件分组的 props、关联类型、导入语句、安装命令、依赖、使用约束和示例列表。省略常规 DOM 属性；不确定的细节可继续查看示例或源码。",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          description: "组件名，例如 button、morphing-dialog。",
        },
      },
      required: ["name"],
    },
    async handler(args, registry) {
      return renderComponent(await registry.component(args.name as string))
    },
  },

  {
    name: "wui_get_example",
    description:
      "获取一段真实示例代码。示例名来自 wui_get_component 返回的「可用示例」列表，例如 button-variants。不确定写法时优先看示例，而不是自己编。",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          description: "示例名，例如 button-variants。",
        },
      },
      required: ["name"],
    },
    async handler(args, registry) {
      const e = await registry.example(args.name as string)
      return [
        `# ${e.name}${e.title ? ` — ${e.title}` : ""}（组件：\`${e.component}\`）`,
        "",
        "```tsx",
        e.code.trim(),
        "```",
      ].join("\n")
    },
  },

  {
    name: "wui_get_component_source",
    description:
      "获取组件的完整实现源码。仅在需要理解内部实现、扩展 variant 或调试时调用——源码较长，普通使用场景用 wui_get_component 就够了。",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          description: "组件名，例如 button。",
        },
      },
      required: ["name"],
    },
    async handler(args, registry) {
      const name = args.name as string
      const item = await registry.source(name)
      return item.files
        .map((f) => `# ${f.path}\n\n\`\`\`tsx\n${f.content.trim()}\n\`\`\``)
        .join("\n\n")
    },
  },

  {
    name: "wui_get_theme_tokens",
    description:
      "列出 wui 的语义设计 token 及其明暗色值。为 wui 组件写样式时用这些 token（bg-primary、text-muted-foreground…），不要用 Tailwind 调色板色值或硬编码颜色。",
    inputSchema: { type: "object", properties: {} },
    async handler(_args, registry) {
      const { tokens } = await registry.overview()
      // `theme` holds the Tailwind v4 `@theme` var mapping — plumbing, not a
      // value the model needs. Only the resolved light/dark scales are useful.
      const groups = Object.keys(tokens).filter((g) => g !== "theme")
      const names = [...new Set(groups.flatMap((g) => Object.keys(tokens[g])))]
      const rows = names.map((n) => {
        const values = groups.map((g) => `${g} ${tokens[g][n] ?? "—"}`)
        return `- \`${n}\` — ${values.join(" · ")}`
      })
      return [
        "wui 语义设计 token（Tailwind v4，CSS-first，无 tailwind.config.js）：",
        "",
        ...rows,
        "",
        "用法：颜色 token 对应 `bg-*` / `text-*` / `border-*` / `ring-*` 工具类，`radius` 对应 `rounded-*`。",
        "深色模式由 token 自动切换，**不需要**成对写 `dark:` 变体。",
        "`*-foreground` 是对应背景上的前景色，必须成对使用：`bg-primary text-primary-foreground`。",
      ].join("\n")
    },
  },
]

const schemaValidator = new AjvJsonSchemaValidator()
const validators = new Map(
  tools.map((tool) => {
    tool.inputSchema.additionalProperties = false
    return [
      tool.name,
      schemaValidator.getValidator<Record<string, unknown>>(tool.inputSchema),
    ]
  })
)

export const toolDefinitions = tools.map(
  ({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  })
)

/** Dispatch a tool call, turning a missing name into a usable error message. */
export async function callTool(
  name: string,
  args: Record<string, unknown>,
  registry: Registry
): Promise<{ text: string; isError: boolean }> {
  const tool = tools.find((t) => t.name === name)
  if (!tool) {
    return {
      text: `未知工具 "${name}"。可用：${tools.map((t) => t.name).join(", ")}`,
      isError: true,
    }
  }
  try {
    const validation = validators.get(name)!(args)
    if (!validation.valid)
      return { text: `参数无效：${validation.errorMessage}`, isError: true }
    return { text: await tool.handler(validation.data, registry), isError: false }
  } catch (err) {
    if (err instanceof NotFoundError)
      return { text: err.message, isError: true }
    return {
      text: `调用 ${name} 失败：${err instanceof Error ? err.message : String(err)}`,
      isError: true,
    }
  }
}
