"use client"

import * as React from "react"
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

export interface AspectRatioProps extends React.ComponentProps<
  typeof AspectRatioPrimitive.Root
> {
  /** 宽度与高度的比例，例如 16 / 9。@default 1 */
  ratio?: number
}

/** 在响应式宽度下保持媒体或内容的固定宽高比。 */
function AspectRatio({ className, ratio = 1, ...props }: AspectRatioProps) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      ratio={ratio}
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  )
}

export { AspectRatio }
