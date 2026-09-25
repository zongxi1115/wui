"use client"

import * as React from "react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

const chapters = [
  {
    id: "install",
    title: "安装",
    body: [
      "通过 CLI 添加组件后，源码会直接落在你的项目里。你可以像维护自己的代码一样修改它，而不是等待上游发版。",
      "组件依赖的动效库与工具函数会一并写入 package.json，首次安装后无需额外配置。",
    ],
  },
  {
    id: "theme",
    title: "主题",
    body: [
      "所有颜色都来自语义 Token：背景、前景、边框与强调色。切换暗色模式时，组件内部不需要任何条件判断。",
      "如果品牌色需要调整，只改 CSS 变量即可，所有组件会同步更新。",
    ],
  },
  {
    id: "motion",
    title: "动效",
    body: [
      "滚动类组件都支持传入 container，既可以监听整页，也可以监听任意局部滚动容器。",
      "系统开启“减少动态效果”时，位移与缩放会被关闭，只保留必要的状态反馈。",
    ],
  },
  {
    id: "ship",
    title: "发布",
    body: [
      "上线前建议在低端设备上检查一次滚动帧率，并确认没有在滚动回调中触发 React 重渲染。",
    ],
  },
]

export default function ScrollProgressSteps() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const sectionRefs = React.useMemo(
    () => chapters.map(() => React.createRef<HTMLElement>()),
    []
  )

  return (
    <div className="grid h-[24rem] w-full overflow-hidden rounded-b-lg sm:grid-cols-[12rem_1fr]">
      <nav className="hidden border-r p-5 sm:block">
        <p className="text-muted-foreground mb-3 text-xs">本页目录</p>
        <ul className="space-y-1">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() =>
                  containerRef.current?.scrollTo({
                    top: (sectionRefs[index].current?.offsetTop ?? 0) - 24,
                    behavior: "smooth",
                  })
                }
                className="hover:bg-muted flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
              >
                <ScrollProgress
                  container={containerRef}
                  target={sectionRefs[index]}
                  offset={["start start", "end start"]}
                  variant="circle"
                  size={14}
                  strokeWidth={2}
                  showValue={false}
                  trackClassName="text-muted"
                />
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={containerRef} className="relative overflow-y-auto px-6 py-6">
        {chapters.map((chapter, index) => (
          <section
            key={chapter.id}
            ref={sectionRefs[index]}
            className="pb-10 last:pb-40"
          >
            <h4 className="font-medium">{chapter.title}</h4>
            {chapter.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground mt-3 text-sm leading-7"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
