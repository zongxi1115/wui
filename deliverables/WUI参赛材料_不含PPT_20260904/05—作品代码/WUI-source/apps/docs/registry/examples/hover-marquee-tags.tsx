import { Code2Icon, LayersIcon, ShieldIcon, ZapIcon } from "lucide-react"

import { HoverMarquee } from "@/registry/ui/hover-marquee"

const services = [
  {
    title: "Full-Stack Web Engineering",
    icon: Code2Icon,
    tags: ["React 19", "Next.js", "TypeScript", "Tailwind CSS v4", "Node.js", "PostgreSQL"],
  },
  {
    title: "High-Performance Cloud Infrastructure",
    icon: ZapIcon,
    tags: ["Kubernetes", "AWS Graviton", "Cloudflare Workers", "Redis Enterprise", "Terraform"],
  },
  {
    title: "Design Systems & UI Architecture",
    icon: LayersIcon,
    tags: ["Design Tokens", "Radix UI", "Motion", "Figma", "Storybook", "Accessibility WCAG AAA"],
  },
  {
    title: "Zero-Trust Security & Compliance",
    icon: ShieldIcon,
    tags: ["SOC2 Type II", "OAuth 2.1", "WebAuthn", "End-to-End Encryption", "Penetration Testing"],
  },
]

export default function HoverMarqueeTags() {
  return (
    <div className="w-full max-w-2xl divide-y rounded-2xl border bg-card shadow-xs">
      {services.map((service, index) => {
        const Icon = service.icon
        return (
          <HoverMarquee
            key={service.title}
            speed={85}
            gap={24}
            reverse={index % 2 === 1}
            className="group outline-none transition-colors hover:bg-muted/30 first:rounded-t-2xl last:rounded-b-2xl"
            marqueeClassName="bg-primary text-primary-foreground py-2 font-medium"
            marquee={
              <div className="flex items-center gap-3 whitespace-nowrap text-xs">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            }
          >
            <div className="flex h-16 items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {service.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground">
                Hover to see tech stack →
              </span>
            </div>
          </HoverMarquee>
        )
      })}
    </div>
  )
}
