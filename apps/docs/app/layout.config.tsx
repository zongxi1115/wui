import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <span className="font-bold">wui</span>,
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Components",
      url: "/docs/components/button",
      active: "nested-url",
    },
    {
      text: "Theme",
      url: "/docs/theme",
      active: "url",
    },
  ],
}
