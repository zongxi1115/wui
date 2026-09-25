"use client"

import { VelocityMarquee } from "@/registry/ui/velocity-marquee"

const customers = [
  "青柠科技",
  "北岸设计",
  "远山资本",
  "Lumen Labs",
  "木白咖啡",
  "Northwind",
  "拾光影像",
  "极光出行",
]

export default function VelocityMarqueeLogos() {
  return (
    <div className="w-full max-w-3xl">
      <p className="text-muted-foreground mb-5 text-center text-sm">
        超过 2,000 支团队在用
      </p>
      <VelocityMarquee
        baseSpeed={28}
        sensitivity={0.06}
        maxBoost={120}
        gap={48}
        pauseOnHover
        className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        {customers.map((name) => (
          <span
            key={name}
            className="text-muted-foreground hover:text-foreground text-lg font-semibold tracking-tight whitespace-nowrap transition-colors"
          >
            {name}
          </span>
        ))}
      </VelocityMarquee>
    </div>
  )
}
