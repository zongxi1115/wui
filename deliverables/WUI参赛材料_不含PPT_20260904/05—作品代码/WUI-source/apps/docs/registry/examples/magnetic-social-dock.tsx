"use client"

import * as React from "react"
import {
  GithubIcon,
  GlobeIcon,
  MessageSquareIcon,
  Share2Icon,
  TwitterIcon,
} from "lucide-react"
import { Button } from "@/registry/ui/button"
import { Magnetic } from "@/registry/ui/magnetic"

export default function MagneticSocialDock() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex items-center gap-3 rounded-2xl border bg-card/80 p-3 shadow-md backdrop-blur-md">
        <Magnetic strength={0.25} maxDistance={14}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="访问 GitHub"
            className="rounded-xl hover:bg-muted"
          >
            <GithubIcon className="size-5" />
          </Button>
        </Magnetic>

        <Magnetic strength={0.25} maxDistance={14}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="访问 Twitter"
            className="rounded-xl hover:bg-muted"
          >
            <TwitterIcon className="size-5" />
          </Button>
        </Magnetic>

        <Magnetic strength={0.25} maxDistance={14}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="官方网站"
            className="rounded-xl hover:bg-muted"
          >
            <GlobeIcon className="size-5" />
          </Button>
        </Magnetic>

        <Magnetic strength={0.25} maxDistance={14}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="社区讨论"
            className="rounded-xl hover:bg-muted"
          >
            <MessageSquareIcon className="size-5" />
          </Button>
        </Magnetic>

        <div className="h-6 w-px bg-border" />

        <Magnetic strength={0.3} maxDistance={16}>
          <Button
            variant="default"
            size="icon"
            aria-label="分享"
            className="rounded-xl shadow-xs"
          >
            <Share2Icon className="size-4" />
          </Button>
        </Magnetic>
      </div>

      <p className="text-xs text-muted-foreground">
        光标靠近图标时，各个按钮会微幅吸附朝向光标方向
      </p>
    </div>
  )
}
