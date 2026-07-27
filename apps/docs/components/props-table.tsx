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

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documented props{name ? ` for "${name}"` : ""}.
      </p>
    )
  }

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Default</th>
            <th className="py-2 font-medium">Description</th>
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
    </div>
  )
}
