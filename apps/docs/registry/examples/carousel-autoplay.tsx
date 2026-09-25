"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  useCarousel,
} from "@/registry/ui/carousel"

const features = [
  {
    step: "智能分组",
    title: "照片按行程自动归档",
    description: "上传后根据拍摄时间与地点聚合成行程，无需手动建相册。",
    image: "/wui/demo/field-notes/aerial-coast.jpg",
  },
  {
    step: "协作挑图",
    title: "邀请同行者一起挑图",
    description: "成员可对照片标星和评论，最终入选结果实时同步给所有人。",
    image: "/wui/demo/field-notes/white-stairs.jpg",
  },
  {
    step: "一键成册",
    title: "生成可分享的在线图集",
    description: "选定照片后自动排版，支持设置访问密码与下载权限。",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
  },
]

function FeatureCopy() {
  const { currentIndex } = useCarousel()
  const reduceMotion = useReducedMotion()
  const feature = features[currentIndex]

  return (
    <div className="relative min-h-24 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={feature.step}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary text-xs font-medium tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")} · {feature.step}
          </p>
          <h3 className="mt-2 text-base font-semibold">{feature.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            {feature.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function CarouselAutoplay() {
  return (
    <Carousel
      autoplay={4000}
      className="grid w-full max-w-3xl gap-6 sm:grid-cols-[1fr_1.2fr] sm:items-center"
      aria-label="新功能导览"
    >
      <div className="order-2 sm:order-1">
        <FeatureCopy />
        <div className="mt-5 flex items-center justify-between gap-4">
          <CarouselDots className="-ml-1" />
          <Button size="sm">开始使用</Button>
        </div>
      </div>
      <CarouselContent className="order-1 rounded-lg sm:order-2">
        {features.map((feature) => (
          <CarouselItem key={feature.step}>
            <img
              src={feature.image}
              alt={feature.title}
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
