import Link from "next/link"
import {
  BlocksIcon,
  FileCode2Icon,
  PaletteIcon,
  SparklesIcon,
} from "lucide-react"

import { CodeTabs } from "@/components/code-tabs"
import { ComponentIndex } from "@/components/home/component-index"
import { CountUp } from "@/components/home/count-up"
import { HeroBackdrop } from "@/components/home/hero-backdrop"
import { Showcase } from "@/components/home/showcase"
import { countComponents, getComponentCatalog } from "@/lib/component-catalog"
import { Button } from "@/registry/ui/button"
import { InView } from "@/registry/ui/in-view"
import { TextEffect } from "@/registry/ui/text-effect"

const features = [
  {
    icon: FileCode2Icon,
    title: "源码属于你",
    description: "组件写进你的仓库，而不是藏在 node_modules 里，可以随时改。",
  },
  {
    icon: BlocksIcon,
    title: "按需取用",
    description: "wui CLI 只拉取需要的组件，并自动带上它依赖的 registry 项。",
  },
  {
    icon: PaletteIcon,
    title: "主题可控",
    description: "Tailwind v4 的 oklch CSS 变量，浅色与深色共用同一套 token。",
  },
  {
    icon: SparklesIcon,
    title: "AI 友好",
    description: "通过 MCP 把真实的属性与用法交给 Claude Code、Cursor 等工具。",
  },
]

export default function HomePage() {
  const catalog = getComponentCatalog()
  const total = countComponents(catalog)

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate flex flex-col items-center overflow-hidden px-4 pb-24 pt-24 text-center sm:pt-32">
        <HeroBackdrop />
        <div className="flex w-full max-w-6xl flex-col items-center gap-6">
          <span className="bg-background/80 text-muted-foreground rounded-full border px-3 py-1 text-xs">
            React 19 · Radix UI · Tailwind CSS v4
          </span>
          {/*
            `per="char"` rather than "word": TextEffect wraps each segment in an
            inline-block, and a whole Chinese clause as one block cannot break,
            so it would overflow narrow viewports. Per-char keeps every position
            a valid break opportunity.
          */}
          <TextEffect
            as="h1"
            per="char"
            preset="fade-in-blur"
            speedReveal={1.2}
            className="max-w-3xl text-3xl font-bold tracking-tight sm:text-6xl"
          >
            {"Ctrl+C 就是最好的包管理器"}
          </TextEffect>
          <p className="text-muted-foreground max-w-2xl text-balance sm:text-lg">
            wui 组件库，你值得拥有~ 
            {total} 个组件覆盖表单、数据展示、反馈、AI 与动效。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/docs">开始使用</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#components">浏览全部组件</Link>
            </Button>
          </div>

          <div className="w-full max-w-lg text-left [&>div]:my-0">
            <CodeTabs command="@wui-design/cli@latest add @wui/button" />
          </div>

          <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <li className="flex items-baseline gap-1.5">
              <span className="text-foreground text-base font-semibold">
                <CountUp value={total} />
              </span>
              个组件
            </li>
            <li className="flex items-baseline gap-1.5">
              <span className="text-foreground text-base font-semibold">
                <CountUp value={catalog.length} />
              </span>
              个分类
            </li>
            <li>兼容 shadcn registry</li>
            <li>
              <Link
                href="/docs/mcp"
                className="hover:text-foreground underline underline-offset-4"
              >
                支持 MCP 接入
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid gap-8 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <InView
              key={feature.title}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.05,
              }}
              viewOptions={{ margin: "0px 0px -80px 0px" }}
            >
              <feature.icon className="text-muted-foreground size-5" />
              <h2 className="mt-3 text-sm font-semibold">{feature.title}</h2>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {feature.description}
              </p>
            </InView>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <SectionHeading
          title="精选组件"
          description="下面全部是真实渲染的组件，可以直接拖动、点击和输入。"
        />
        <Showcase />
      </section>

      <section
        id="components"
        className="bg-muted/25 scroll-mt-16 border-t py-20"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            title="全部组件"
            description={`按分类罗列的 ${total} 个组件，点击任意一项查看示例、属性与源码。`}
          />
          <ComponentIndex catalog={catalog} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          几分钟就能装进你的项目
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-balance">
          先跑一次 init 生成 wui.json 与主题 token，之后按需 add 组件即可。
        </p>
        <div className="mx-auto mt-6 max-w-lg text-left [&>div]:my-0">
          <CodeTabs command="@wui-design/cli@latest init" />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/docs/installation">查看安装文档</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/theme">定制主题</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  )
}
