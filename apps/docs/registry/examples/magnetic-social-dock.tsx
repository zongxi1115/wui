import {
  BookOpenIcon,
  GithubIcon,
  MessageCircleIcon,
  RssIcon,
  Share2Icon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Magnetic } from "@/registry/ui/magnetic"

const links = [
  { icon: GithubIcon, label: "GitHub 仓库" },
  { icon: BookOpenIcon, label: "使用文档" },
  { icon: MessageCircleIcon, label: "社区讨论" },
  { icon: RssIcon, label: "订阅更新" },
]

export default function MagneticSocialDock() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
        {links.map(({ icon: Icon, label }) => (
          <Magnetic key={label} strength={0.35} maxDistance={8}>
            <Button variant="ghost" size="icon" aria-label={label}>
              <Icon />
            </Button>
          </Magnetic>
        ))}
        <div className="bg-border mx-1 h-5 w-px" />
        <Magnetic strength={0.35} maxDistance={8}>
          <Button size="icon" aria-label="分享">
            <Share2Icon />
          </Button>
        </Magnetic>
      </div>
      <p className="text-muted-foreground text-xs">
        图标按钮的吸附距离更小，避免与相邻按钮重叠
      </p>
    </div>
  )
}
