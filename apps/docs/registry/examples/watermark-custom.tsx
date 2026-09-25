import { Watermark } from "@/registry/ui/watermark"

export default function WatermarkCustom() {
  return (
    <Watermark
      content={["李明 · 10482", "2026-09-26 14:32"]}
      rotate={-18}
      gap={[56, 64]}
      width={180}
      height={56}
      opacity={0.12}
      font={{ fontSize: 13, fontWeight: 500 }}
      className="w-full max-w-xl"
    >
      <article className="bg-card text-card-foreground rounded-lg border p-6">
        <p className="text-muted-foreground text-xs">产品规划 · 未公开</p>
        <h3 className="mt-1 font-semibold">会员体系 3.0 方案评审稿</h3>
        <ol className="text-muted-foreground mt-4 list-decimal space-y-1.5 pl-4 text-sm leading-6">
          <li>成长值改为按消费金额与活跃天数加权计算</li>
          <li>黄金及以上会员开放专属客服通道</li>
          <li>积分有效期由 12 个月延长至 24 个月</li>
        </ol>
        <p className="text-muted-foreground mt-4 border-t pt-3 text-xs">
          多行水印包含查看人与时间，截图外传时可追溯来源。
        </p>
      </article>
    </Watermark>
  )
}
