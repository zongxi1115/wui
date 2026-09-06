import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

const usage = [
  { endpoint: "/v1/responses", requests: "18,420", latency: "186 ms" },
  { endpoint: "/v1/files", requests: "6,830", latency: "94 ms" },
  { endpoint: "/v1/embeddings", requests: "2,110", latency: "72 ms" },
]

export default function TableCompact() {
  return (
    <Table density="compact" striped className="min-w-[480px]">
      <TableHeader>
        <TableRow>
          <TableHead>Endpoint</TableHead>
          <TableHead className="text-right">Requests</TableHead>
          <TableHead className="text-right">P95 latency</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usage.map((row) => (
          <TableRow key={row.endpoint}>
            <TableCell className="font-mono text-xs">{row.endpoint}</TableCell>
            <TableCell className="text-right tabular-nums">{row.requests}</TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {row.latency}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right tabular-nums">27,360</TableCell>
          <TableCell className="text-right">—</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
