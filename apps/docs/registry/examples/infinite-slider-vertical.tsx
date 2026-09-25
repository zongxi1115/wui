import { InfiniteSlider } from "@/registry/ui/infinite-slider"

const events = [
  { time: "09:41", text: "王芳 通过了「采购申请 #2381」" },
  { time: "09:38", text: "系统 自动归档了 12 份过期合同" },
  { time: "09:35", text: "李明 在「Q4 预算」中提到了你" },
  { time: "09:31", text: "张伟 上传了「品牌手册 v3.pdf」" },
  { time: "09:27", text: "赵磊 将「官网改版」移至测试中" },
  { time: "09:22", text: "刘洋 创建了新项目「会员体系」" },
]

export default function InfiniteSliderVertical() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <span className="bg-success size-1.5 rounded-full" />
        实时动态
      </div>
      <InfiniteSlider
        direction="vertical"
        speed={24}
        speedOnHover={6}
        gap={0}
        className="h-56 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
      >
        {events.map((event) => (
          <div
            key={event.time}
            className="flex w-80 items-baseline gap-3 border-b py-3 text-sm"
          >
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {event.time}
            </span>
            <span className="truncate">{event.text}</span>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  )
}
