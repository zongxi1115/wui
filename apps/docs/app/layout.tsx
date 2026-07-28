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
  description: "A shadcn-style React component library you own.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <TokenThemeRuntime />
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
