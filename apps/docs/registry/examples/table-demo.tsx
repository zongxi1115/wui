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
  { invoice: "INV-2048", status: "Paid", method: "Credit card", total: "$320.00" },
  { invoice: "INV-2047", status: "Pending", method: "Bank transfer", total: "$145.00" },
  { invoice: "INV-2046", status: "Paid", method: "PayPal", total: "$86.50" },
  { invoice: "INV-2045", status: "Overdue", method: "Credit card", total: "$410.00" },
]

export default function TableDemo() {
  return (
    <Table className="min-w-[560px]">
      <TableCaption>Recent invoices from July 2026.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="text-muted-foreground">
              {invoice.method}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {invoice.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
