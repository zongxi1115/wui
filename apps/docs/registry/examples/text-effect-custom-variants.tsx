"use client"

import * as React from "react"
import { RotateCw, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

const customVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -45,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
    },
  },
}

export default function TextEffectCustomVariants() {
  const [trigger, setTrigger] = React.useState(true)

  const replay = () => {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 80)
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Sparkles className="size-3.5" />
        <span>Custom 3D Spring Variants</span>
      </div>

      <div className="space-y-3">
        <TextEffect
          as="h3"
          per="char"
          variants={customVariants}
          trigger={trigger}
          className="text-3xl font-bold tracking-tight text-foreground [perspective:1000px]"
        >
          Fluid 3D Spatial Typography
        </TextEffect>
        <p className="text-xs text-muted-foreground">
          使用自定义 3D 旋转与弹性回弹 Variants，打造具有纵深与物理质感的入场动效。
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={replay}
        className="gap-1.5 text-xs"
      >
        <RotateCw className="size-3.5" />
        重放自定义动效
      </Button>
    </div>
  )
}
