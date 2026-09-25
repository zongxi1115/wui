"use client"

import * as React from "react"

import { AnimatedBackground } from "@/registry/ui/animated-background"

const links = [
  { id: "overview", label: "概览" },
  { id: "projects", label: "项目" },
  { id: "deployments", label: "部署" },
  { id: "analytics", label: "分析" },
  { id: "settings", label: "设置" },
]

export default function AnimatedBackgroundDemo() {
  const [active, setActive] = React.useState("projects")

  return (
    <nav aria-label="控制台导航" className="flex items-center gap-1 border-b pb-2">
      <AnimatedBackground
        mode="hover"
        value={active}
        onValueChange={setActive}
        highlightClassName="rounded-md bg-muted"
      >
        {links.map((link) => (
          <a
            key={link.id}
            data-id={link.id}
            href={`#${link.id}`}
            aria-current={active === link.id ? "page" : undefined}
            onClick={(event) => event.preventDefault()}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 aria-[current=page]:text-foreground data-highlighted:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </AnimatedBackground>
    </nav>
  )
}
