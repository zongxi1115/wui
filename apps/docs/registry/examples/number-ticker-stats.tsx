import { NumberTicker } from "@/registry/ui/number-ticker"

const stats = [
  {
    label: "月活跃用户",
    value: 1284560,
    delta: "+12.4%",
  },
  {
    label: "付费转化率",
    value: 18.6,
    decimalPlaces: 1,
    suffix: "%",
    delta: "+2.1 pt",
  },
  {
    label: "本月成交额",
    value: 3862400,
    formatOptions: { style: "currency", currency: "CNY" } as const,
    delta: "+8.9%",
  },
  {
    label: "平均响应时间",
    value: 238,
    suffix: " ms",
    delta: "-36 ms",
  },
]

export default function NumberTickerStats() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 divide-border border-y sm:grid-cols-4 sm:divide-x">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex flex-col gap-1.5 px-5 py-4">
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <NumberTicker
            value={stat.value}
            decimalPlaces={stat.decimalPlaces}
            formatOptions={stat.formatOptions}
            suffix={stat.suffix}
            delay={index * 0.12}
            className="text-2xl font-semibold tracking-tight text-foreground"
          />
          <span className="text-xs text-muted-foreground">
            较上月 <span className="text-foreground">{stat.delta}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
