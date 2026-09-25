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
  { endpoint: "/v1/responses", requests: 18420, errorRate: 0.12, latency: 186 },
  { endpoint: "/v1/files", requests: 6830, errorRate: 0.04, latency: 94 },
  { endpoint: "/v1/embeddings", requests: 2110, errorRate: 0.00, latency: 72 },
  { endpoint: "/v1/audio/speech", requests: 964, errorRate: 1.87, latency: 412 },
  { endpoint: "/v1/moderations", requests: 512, errorRate: 0.00, latency: 48 },
]

const total = usage.reduce((sum, row) => sum + row.requests, 0)

export default function TableCompact() {
  return (
    <Table density="compact" striped className="min-w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>接口</TableHead>
          <TableHead className="text-right">请求数</TableHead>
          <TableHead className="text-right">错误率</TableHead>
          <TableHead className="text-right">P95 延迟</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usage.map((row) => (
          <TableRow key={row.endpoint}>
            <TableCell className="font-mono text-xs">{row.endpoint}</TableCell>
            <TableCell className="text-right tabular-nums">
              {row.requests.toLocaleString("zh-CN")}
            </TableCell>
            <TableCell
              className={
                row.errorRate > 1
                  ? "text-destructive text-right tabular-nums"
                  : "text-muted-foreground text-right tabular-nums"
              }
            >
              {row.errorRate.toFixed(2)}%
            </TableCell>
            <TableCell className="text-muted-foreground text-right tabular-nums">
              {row.latency} ms
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>近 24 小时合计</TableCell>
          <TableCell className="text-right tabular-nums">
            {total.toLocaleString("zh-CN")}
          </TableCell>
          <TableCell className="text-right tabular-nums">0.16%</TableCell>
          <TableCell className="text-muted-foreground text-right">—</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
