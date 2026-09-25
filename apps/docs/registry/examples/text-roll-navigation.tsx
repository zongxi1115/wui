import { LayersIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

const navItems = ["产品", "解决方案", "客户案例", "价格", "文档", "更新日志"]

export default function TextRollNavigation() {
  return (
    <header className="flex w-full max-w-3xl items-center justify-between gap-6 border-b pb-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <LayersIcon className="size-4" />
        协作云
      </div>

      <nav className="hidden items-center gap-6 md:flex" aria-label="主导航">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm text-sm outline-none transition-colors focus-visible:ring-[3px]"
          >
            <TextRoll trigger="parent" duration={0.35}>
              {item}
            </TextRoll>
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          登录
        </Button>
        <Button size="sm">免费注册</Button>
      </div>
    </header>
  )
}
