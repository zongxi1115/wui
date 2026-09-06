import { Layers, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

const navItems = [
  "Products",
  "Solutions",
  "Enterprise",
  "Pricing",
  "Documentation",
  "Changelog",
]

export default function TextRollNavigation() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        导航栏交互式菜单链接
      </div>

      <header className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="size-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">
            WUI Cloud
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <a
              key={item}
              href="#link"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <TextRoll duration={0.35}>{item}</TextRoll>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Sign In
          </Button>
          <Button size="sm" className="gap-1">
            <Sparkles className="size-3" />
            Get Started
          </Button>
        </div>
      </header>
    </div>
  )
}
