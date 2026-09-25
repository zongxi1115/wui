"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ScrollSnap, ScrollSnapItem } from "@/registry/ui/scroll-snap"

const products = [
  {
    name: "降噪耳机 Pro",
    price: "¥1,299",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "极简腕表",
    price: "¥2,480",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "胶片相机",
    price: "¥3,650",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "轻量跑鞋",
    price: "¥899",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
]

export default function ScrollSnapHorizontal() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  function go(offset: number) {
    const root = rootRef.current
    const item = root?.querySelector<HTMLElement>('[data-slot="scroll-snap-item"]')
    if (!root || !item) return
    root.scrollBy({ left: offset * (item.offsetWidth + 12), behavior: "smooth" })
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="font-medium">本周推荐</h4>
          <p className="text-muted-foreground text-sm">
            {active + 1} / {products.length}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="上一个"
            disabled={active === 0}
            onClick={() => go(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="下一个"
            disabled={active === products.length - 1}
            onClick={() => go(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <ScrollSnap
        ref={rootRef}
        axis="x"
        hideScrollbar
        onActiveChange={setActive}
        className="flex gap-3"
      >
        {products.map((product) => (
          <ScrollSnapItem key={product.name} className="w-56">
            <img
              src={product.image}
              alt={product.name}
              className="bg-muted aspect-square w-full rounded-md object-cover"
            />
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-muted-foreground text-sm tabular-nums">
                {product.price}
              </p>
            </div>
          </ScrollSnapItem>
        ))}
      </ScrollSnap>
    </div>
  )
}
