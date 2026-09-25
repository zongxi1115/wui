"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { BellIcon, InboxIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

const rollVariants = {
  enter: (direction: number) => ({ y: `${direction * 100}%`, opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: number) => ({ y: `${direction * -100}%`, opacity: 0 }),
}

function RollingCount({ value, max = 99 }: { value: number; max?: number }) {
  const reduceMotion = useReducedMotion()
  const previous = React.useRef(value)
  const direction = value >= previous.current ? 1 : -1

  React.useEffect(() => {
    previous.current = value
  }, [value])

  const label = value > max ? `${max}+` : String(value)

  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.span
          key={label}
          custom={direction}
          variants={reduceMotion ? undefined : rollVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function BadgeCount() {
  const [count, setCount] = React.useState(3)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Button variant="outline" size="icon" aria-label={`通知，${count} 条未读`}>
            <BellIcon />
          </Button>
          <AnimatePresence>
            {count > 0 ? (
              <motion.span
                className="absolute -top-1.5 -right-1.5"
                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduceMotion ? undefined : { scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 30 }}
              >
                <Badge
                  variant="destructive"
                  size="sm"
                  className="ring-background min-w-4 px-1 ring-2"
                >
                  <RollingCount value={count} />
                </Badge>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <InboxIcon className="text-muted-foreground size-4" />
          收件箱
          <Badge variant="secondary">
            <RollingCount value={count * 12} max={999} />
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          标记一条已读
        </Button>
        <Button size="sm" onClick={() => setCount((c) => c + 1)}>
          收到新消息
        </Button>
      </div>
    </div>
  )
}
