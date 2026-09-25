import { Badge } from "@/registry/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

const invoices = [
  { id: "INV-2048", customer: "杭州云栖科技", status: "已支付", method: "对公转账", total: 32000 },
  { id: "INV-2047", customer: "上海拾光文化", status: "待支付", method: "支付宝", total: 14500 },
  { id: "INV-2046", customer: "成都青禾餐饮", status: "已支付", method: "微信支付", total: 8650 },
  { id: "INV-2045", customer: "北京远帆物流", status: "已逾期", method: "对公转账", total: 41000 },
] as const

const statusVariant = {
  已支付: "success",
  待支付: "secondary",
  已逾期: "destructive",
} as const

export default function TableDemo() {
  return (
    <Table className="min-w-[560px]">
      <TableCaption>2026 年 7 月开具的发票，金额含税。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">发票编号</TableHead>
          <TableHead>客户</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>付款方式</TableHead>
          <TableHead className="text-right">金额</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
            <TableCell className="font-medium">{invoice.customer}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[invoice.status]} size="sm">
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{invoice.method}</TableCell>
            <TableCell className="text-right tabular-nums">
              ¥{invoice.total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
