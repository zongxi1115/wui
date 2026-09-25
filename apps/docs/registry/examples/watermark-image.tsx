import { Watermark } from "@/registry/ui/watermark"

const watermarkImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
    <path fill="#2563eb" d="M8 6h24l8 14-8 14H8L0 20 8 6Z"/>
    <path fill="white" d="m9 13 4 14h4l3-8 3 8h4l4-14h-4l-2.5 9-3-9h-3l-3 9-2.5-9H9Z"/>
    <text x="47" y="26" fill="#2563eb" font-family="Arial, sans-serif" font-size="18" font-weight="700">WUI</text>
  </svg>
`)}`

const rows = [
  ["INV-20260926-018", "上海云栈科技有限公司", "¥ 48,600.00"],
  ["INV-20260925-104", "杭州禾木设计工作室", "¥ 12,800.00"],
  ["INV-20260923-077", "深圳即刻物流有限公司", "¥ 9,350.00"],
]

export default function WatermarkImage() {
  return (
    <Watermark
      image={watermarkImage}
      rotate={-18}
      width={96}
      height={32}
      gap={[64, 56]}
      opacity={0.1}
      className="w-full max-w-xl"
    >
      <section className="bg-card text-card-foreground rounded-lg border">
        <div className="flex items-baseline justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold">近期开票记录</h3>
          <span className="text-muted-foreground text-xs">共 3 张</span>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y">
            {rows.map(([number, company, amount]) => (
              <tr key={number}>
                <td className="text-muted-foreground px-5 py-3 font-mono text-xs">
                  {number}
                </td>
                <td className="py-3">{company}</td>
                <td className="px-5 py-3 text-right tabular-nums">{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Watermark>
  )
}
