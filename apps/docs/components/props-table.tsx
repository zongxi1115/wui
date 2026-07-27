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

/**
 * A manual props/API table. Author it inline in MDX, e.g.
 * `<PropsTable data={[{ prop: "variant", type: "...", default: "default" }]} />`.
 */
export function PropsTable({ data }: { data: PropDef[] }) {
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
          {data.map((row) => (
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
