import { AnimatedGroup } from "@/registry/ui/animated-group"

const releases = [
  {
    version: "v3.2.0",
    date: "09-18",
    title: "工作区审计日志",
    description: "按成员、资源与操作类型筛选，支持导出 CSV。",
  },
  {
    version: "v3.1.4",
    date: "09-02",
    title: "看板泳道分组",
    description: "按负责人或优先级拆分泳道，拖拽时自动吸附。",
  },
  {
    version: "v3.1.0",
    date: "08-21",
    title: "自动化模板市场",
    description: "内置 40+ 常用流程模板，一键复制到当前项目。",
  },
  {
    version: "v3.0.2",
    date: "08-05",
    title: "移动端离线编辑",
    description: "断网时继续编辑文档，联网后自动合并冲突。",
  },
]

export default function AnimatedGroupInView() {
  return (
    <AnimatedGroup
      as="ol"
      itemAs="li"
      preset="blur-slide"
      stagger={0.1}
      inView
      viewOptions={{ amount: 0.4 }}
      className="flex w-full max-w-md flex-col border-l"
      itemClassName="relative py-3 pl-5"
    >
      {releases.map((release) => (
        <div key={release.version} className="flex flex-col gap-1">
          <span className="absolute top-[1.15rem] -left-[3.5px] size-1.5 rounded-full bg-primary" />
          <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{release.version}</span>
            <span>{release.date}</span>
          </div>
          <span className="text-sm font-medium">{release.title}</span>
          <span className="text-xs text-muted-foreground">
            {release.description}
          </span>
        </div>
      ))}
    </AnimatedGroup>
  )
}
