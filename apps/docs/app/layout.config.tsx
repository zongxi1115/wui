import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <span className="font-bold">wui</span>,
  },
  links: [
    {
      text: "文档",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "组件",
      url: "/docs/components/button",
      active: "nested-url",
    },
    {
      text: "图表",
      url: "/docs/charts/line-chart",
      active: "nested-url",
    },
    {
      text: "主题",
      url: "/docs/theme",
      active: "url",
    },
  ],
}
