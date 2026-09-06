import { Props } from "@/registry/__props__"

export interface PropDef {
  /** Property name. */
  prop: string
  /** TypeScript type, shown verbatim. */
  type: string
  /** Default value, if any. */
  default?: string
  /** Human-readable explanation. */
  description?: string
}

function clean(text?: string): string {
  return (text ?? "").replace(/\s+/g, " ").trim()
}

/**
 * Props / API table. Pass `name` to auto-generate from parsed TypeScript types
 * + TSDoc (see scripts/build-docgen.mts), or `data` to author it by hand.
 */
export function PropsTable({ name, data }: { name?: string; data?: PropDef[] }) {
  const rows: PropDef[] = data
    ? data
    : name && Props[name]
      ? Props[name].map((p) => ({
          prop: p.required ? `${p.name} *` : p.name,
          type: p.type,
          default: p.defaultValue,
          description: clean(p.description),
        }))
      : []
  const hasRequired = rows.some((row) => row.prop.endsWith(" *"))

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        该组件没有自定义属性{name ? `（${name}）` : ""}，支持透传底层元素的原生属性。
      </p>
    )
  }

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium">属性</th>
            <th className="py-2 pr-4 font-medium">类型</th>
            <th className="py-2 pr-4 font-medium">默认值</th>
            <th className="py-2 font-medium">说明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} className="border-b align-top">
              <td className="py-2 pr-4 font-mono text-[13px] text-foreground">
                {row.prop}
              </td>
              <td className="py-2 pr-4 font-mono text-[13px] text-muted-foreground">
                {row.type}
              </td>
              <td className="whitespace-nowrap py-2 pr-4 font-mono text-[13px] text-muted-foreground">
                {row.default ?? "—"}
              </td>
              <td className="py-2 text-muted-foreground">
                {row.description ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasRequired ? (
        <p className="mt-2 text-xs text-muted-foreground">
          属性名后的 * 表示必填。
        </p>
      ) : null}
    </div>
  )
}
