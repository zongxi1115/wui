import { InfiniteSlider } from "@/registry/ui/infinite-slider"

const reviews = [
  {
    name: "林晓",
    role: "运营负责人 · 青禾零售",
    quote: "审批从平均两天缩短到半天，门店的采购申请终于不再卡在邮件里。",
  },
  {
    name: "周子墨",
    role: "前端工程师 · 远帆科技",
    quote: "组件的键盘交互和焦点管理都做好了，我们几乎没有再补无障碍问题。",
  },
  {
    name: "陈一凡",
    role: "产品经理 · 知行教育",
    quote: "报表可以直接推送到群里，周会前再也不用手动截图整理数据。",
  },
  {
    name: "许安然",
    role: "设计师 · 山海工作室",
    quote: "动效克制但细腻，和我们的设计规范能很自然地对上。",
  },
]

export default function InfiniteSliderHoverPause() {
  return (
    <div className="w-full max-w-3xl [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <InfiniteSlider speed={36} speedOnHover={0} gap={16}>
        {reviews.map((item) => (
          <figure
            key={item.name}
            className="flex w-72 shrink-0 flex-col justify-between gap-4 rounded-lg border bg-background p-4"
          >
            <blockquote className="text-sm leading-6">{item.quote}</blockquote>
            <figcaption className="flex items-center gap-2.5">
              <span className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-xs font-medium">
                {item.name.slice(0, 1)}
              </span>
              <span>
                <span className="block text-xs font-medium">{item.name}</span>
                <span className="text-muted-foreground block text-xs">
                  {item.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </InfiniteSlider>
    </div>
  )
}
