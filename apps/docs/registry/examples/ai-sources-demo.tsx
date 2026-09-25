import {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
} from "@/registry/ui/ai-sources"

const SOURCES = [
  {
    index: 1,
    title: "React 19 正式发布说明",
    domain: "react.dev",
    snippet:
      "Actions 会自动处理待定状态、错误与乐观更新，表单可以直接把异步函数作为 action。",
    href: "https://react.dev/blog/2024/12/05/react-19",
    favicon: "https://react.dev/favicon.ico",
  },
  {
    index: 2,
    title: "Tailwind CSS v4.0",
    domain: "tailwindcss.com",
    snippet:
      "全新高性能引擎，基于 CSS 变量的主题配置，以及对现代 CSS 特性的原生支持。",
    href: "https://tailwindcss.com/blog/tailwindcss-v4",
    favicon: "https://tailwindcss.com/favicons/favicon-32x32.png",
  },
  {
    index: 3,
    title: "Radix Primitives 无障碍说明",
    domain: "radix-ui.com",
    snippet:
      "组件遵循 WAI-ARIA 设计模式，内置焦点管理与键盘导航，只需关心视觉样式。",
    href: "https://www.radix-ui.com/primitives/docs/overview/accessibility",
    favicon: "https://www.radix-ui.com/favicon.png",
  },
]

export default function AiSourcesDemo() {
  const [react, tailwind, radix] = SOURCES

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3 text-sm leading-7 text-foreground">
      <p>
        React 19 的 Actions 可以直接接管表单提交的待定与错误状态
        <AiCitation {...react} />
        ；样式层面，Tailwind CSS v4 把主题收敛到 CSS 变量上，深浅色切换不再需要额外构建
        <AiCitation {...tailwind} />
        。交互行为交给 Radix 原语处理，焦点与键盘导航可以直接复用
        <AiCitation {...radix} />
        。
      </p>

      <AiSources count={SOURCES.length} defaultOpen>
        <AiSourcesHeader />
        <AiSourcesContent>
          <AiSourcesList>
            {SOURCES.map((source) => (
              <AiSourceItem key={source.index} {...source} />
            ))}
          </AiSourcesList>
        </AiSourcesContent>
      </AiSources>
    </div>
  )
}
