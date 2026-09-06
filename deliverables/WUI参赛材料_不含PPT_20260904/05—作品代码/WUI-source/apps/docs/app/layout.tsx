import "@/app/global.css"
import { RootProvider } from "fumadocs-ui/provider"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { TokenThemeRuntime } from "@/components/token-configurator"

export const metadata: Metadata = {
  title: {
    default: "wui",
    template: "%s — wui",
  },
  description: "一套源码归你所有、可自由组合和修改的 shadcn 风格 React 组件库。",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <TokenThemeRuntime />
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
