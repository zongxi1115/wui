"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

const variants = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  },
  item: {
    hidden: { opacity: 0, y: 24, rotateX: -60, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  },
}

export default function TextEffectCustomVariants() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
      <TextEffect
        key={key}
        as="h3"
        per="char"
        variants={variants}
        className="text-3xl font-semibold tracking-tight [perspective:800px] sm:text-4xl"
      >
        向光而行
      </TextEffect>
      <p className="text-muted-foreground max-w-sm text-xs leading-5">
        通过 variants 自定义容器编排与单字动画：3D
        翻转、模糊对焦与弹簧回弹组合出更有纵深的入场。
      </p>
      <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
        <RotateCcwIcon />
        重播
      </Button>
    </div>
  )
}
