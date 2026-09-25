import type { Variants } from "motion/react"

import { TextLoop } from "@/registry/ui/text-loop"

const slideVariants: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
}

const flipVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  exit: { rotateX: -90, opacity: 0 },
}

const focusVariants: Variants = {
  initial: { scale: 0.85, opacity: 0, filter: "blur(6px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 1.1, opacity: 0, filter: "blur(6px)" },
}

export default function TextLoopCustomTransitions() {
  return (
    <div className="w-full max-w-md divide-y border-y text-lg font-semibold tracking-tight">
      <p className="flex items-baseline justify-between gap-4 py-4">
        <span className="text-muted-foreground text-xs font-normal">横向推入</span>
        <span>
          节省
          <TextLoop
            interval={2}
            variants={slideVariants}
            className="text-muted-foreground ml-1"
          >
            {[
              <span key="time">时间</span>,
              <span key="cost">成本</span>,
              <span key="effort">人力</span>,
            ]}
          </TextLoop>
        </span>
      </p>
      <p className="flex items-baseline justify-between gap-4 py-4 [perspective:600px]">
        <span className="text-muted-foreground text-xs font-normal">3D 翻转</span>
        <span>
          部署到
          <TextLoop
            interval={2.2}
            variants={flipVariants}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="text-muted-foreground ml-1"
          >
            {[
              <span key="beijing">华北</span>,
              <span key="shanghai">华东</span>,
              <span key="shenzhen">华南</span>,
            ]}
          </TextLoop>
        </span>
      </p>
      <p className="flex items-baseline justify-between gap-4 py-4">
        <span className="text-muted-foreground text-xs font-normal">缩放对焦</span>
        <span>
          当前方案：
          <TextLoop
            interval={2.4}
            variants={focusVariants}
            className="text-muted-foreground"
          >
            {[
              <span key="free">个人版</span>,
              <span key="team">团队版</span>,
              <span key="ent">企业版</span>,
            ]}
          </TextLoop>
        </span>
      </p>
    </div>
  )
}
