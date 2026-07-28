"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Input } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { Message } from "@/registry/ui/message"
import { Progress } from "@/registry/ui/progress"
import { ProgressiveBlur } from "@/registry/ui/progressive-blur"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"
import { ShinyButton } from "@/registry/ui/shiny-button"
import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"
import { Slider } from "@/registry/ui/slider"
import { Spin } from "@/registry/ui/spin"
import { Switch } from "@/registry/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"
import { TextShimmer } from "@/registry/ui/text-shimmer"
import { cn } from "@/registry/lib/utils"

function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("bg-card w-full rounded-lg border p-4", className)}>
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-2.5 text-xs font-medium">
      {children}
    </p>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="truncate">{label}</span>
      {children}
    </div>
  )
}

const buttonsCard = (
  <Card key="buttons">
    <CardLabel>Button</CardLabel>
    <div className="flex flex-wrap gap-2">
      <Button size="sm">保存</Button>
      <Button size="sm" variant="outline">
        取消
      </Button>
      <Button size="sm" variant="secondary">
        预览
      </Button>
    </div>
  </Card>
)

const switchCard = (
  <Card key="switch">
    <CardLabel>Switch</CardLabel>
    <Row label="启用通知">
      <Switch defaultChecked />
    </Row>
    <Row label="深色外观">
      <Switch />
    </Row>
  </Card>
)

const progressCard = (
  <Card key="progress">
    <CardLabel>Progress</CardLabel>
    <Progress value={68} />
    <p className="text-muted-foreground mt-2.5 text-xs tabular-nums">
      68% · 正在同步
    </p>
  </Card>
)

const avatarCard = (
  <Card key="avatar">
    <CardLabel>Avatar</CardLabel>
    <AvatarGroup>
      <Avatar size="sm">
        <AvatarFallback>林</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          陈
        </AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback className="bg-primary text-primary-foreground">
          JW
        </AvatarFallback>
      </Avatar>
      <AvatarGroupCount size="sm">+4</AvatarGroupCount>
    </AvatarGroup>
  </Card>
)

const kbdCard = (
  <Card key="kbd">
    <CardLabel>Kbd</CardLabel>
    <Row label="打开搜索">
      <KbdGroup>
        <Kbd size="sm">Ctrl</Kbd>
        <Kbd size="sm">K</Kbd>
      </KbdGroup>
    </Row>
    <Row label="关闭面板">
      <KbdGroup>
        <Kbd size="sm">Esc</Kbd>
      </KbdGroup>
    </Row>
  </Card>
)

const checkboxCard = (
  <Card key="checkbox">
    <CardLabel>Checkbox</CardLabel>
    <Row label="同步设置">
      <Checkbox defaultChecked />
    </Row>
    <Row label="跨设备接力">
      <Checkbox defaultChecked />
    </Row>
    <Row label="共享分析数据">
      <Checkbox />
    </Row>
  </Card>
)

const successCard = (
  <Card key="success">
    <Message variant="success" size="compact" title="修改已保存">
      工作区设置已更新。
    </Message>
  </Card>
)

const sliderCard = (
  <Card key="slider">
    <CardLabel>Slider</CardLabel>
    <Slider defaultValue={[62]} aria-label="音量" />
  </Card>
)

const inputCard = (
  <Card key="input">
    <CardLabel>Input</CardLabel>
    <Input placeholder="搜索组件…" visualSize="sm" readOnly />
  </Card>
)

const spinCard = (
  <Card key="spin">
    <CardLabel>Spin</CardLabel>
    <div className="flex items-center gap-6 py-1">
      <Spin size="sm" label="同步中" />
    </div>
  </Card>
)

const tabsCard = (
  <Card key="tabs">
    <CardLabel>Tabs</CardLabel>
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="activity">动态</TabsTrigger>
        <TabsTrigger value="settings">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="pt-3 text-2xl font-semibold tracking-tight">68%</p>
      </TabsContent>
    </Tabs>
  </Card>
)

const skeletonCard = (
  <Card key="skeleton">
    <CardLabel>Skeleton</CardLabel>
    <div className="flex items-start gap-3">
      <Skeleton shape="circle" className="size-9" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton shape="text" className="h-3 w-24" />
        <SkeletonText lines={2} lastLineWidth="70%" />
      </div>
    </div>
  </Card>
)

const swatchesCard = (
  <Card key="swatches">
    <CardLabel>Design Tokens</CardLabel>
    <div className="flex gap-2">
      {[
        "bg-primary",
        "bg-info",
        "bg-success",
        "bg-warning",
        "bg-destructive",
      ].map((swatch) => (
        <span key={swatch} className={cn("size-7 rounded-md border", swatch)} />
      ))}
    </div>
  </Card>
)

const shimmerCard = (
  <Card key="shimmer">
    <CardLabel>Text Shimmer</CardLabel>
    <TextShimmer className="font-medium" duration={1.8}>
      正在生成代码…
    </TextShimmer>
  </Card>
)

const warningCard = (
  <Card key="warning">
    <Message variant="warning" size="compact" title="存储空间不足">
      清理未使用的文件以继续上传。
    </Message>
  </Card>
)

const radioCard = (
  <Card key="radio">
    <CardLabel>Radio Group</CardLabel>
    <RadioGroup defaultValue="auto" className="space-y-1.5">
      {[
        ["auto", "跟随系统"],
        ["light", "浅色"],
        ["dark", "深色"],
      ].map(([value, label]) => (
        <span key={value} className="flex items-center gap-3 text-sm">
          <RadioGroupItem value={value} size="sm" />
          {label}
        </span>
      ))}
    </RadioGroup>
  </Card>
)

const shinyCard = (
  <Card key="shiny">
    <CardLabel>Shiny Button</CardLabel>
    <ShinyButton className="w-full">立即升级</ShinyButton>
  </Card>
)

const infoCard = (
  <Card key="info">
    <Message variant="info" size="compact" title="有新版本">
      准备好后刷新页面即可更新。
    </Message>
  </Card>
)

const statCard = (
  <Card key="stat">
    <CardLabel>Descriptions</CardLabel>
    <Row label="活跃项目">
      <span className="font-medium tabular-nums">24</span>
    </Row>
    <Row label="本周交付">
      <span className="font-medium tabular-nums">8</span>
    </Row>
    <Row label="待处理">
      <span className="font-medium tabular-nums">13</span>
    </Row>
  </Card>
)

const dangerCard = (
  <Card key="danger">
    <CardLabel>Button</CardLabel>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="ghost">
        忽略
      </Button>
      <Button size="sm" variant="destructive">
        删除
      </Button>
    </div>
  </Card>
)

/**
 * Column contents for the hero wall. Everything is uncontrolled so the wall
 * carries no state, and the whole layer is `inert` so none of it is reachable.
 */
const columns: Array<{ duration: number; cards: React.ReactNode[] }> = [
  {
    duration: 52,
    cards: [buttonsCard, switchCard, progressCard, avatarCard, kbdCard],
  },
  {
    duration: 40,
    cards: [checkboxCard, successCard, sliderCard, inputCard, spinCard],
  },
  {
    duration: 46,
    cards: [tabsCard, skeletonCard, swatchesCard, shimmerCard, warningCard],
  },
  {
    duration: 36,
    cards: [radioCard, shinyCard, infoCard, statCard, dangerCard],
  },
]

/**
 * One looping column. The track holds the cards twice and animates by a
 * percentage of its own height, so — unlike a measured slider — it stays
 * seamless under the wall's rotation, which would otherwise inflate
 * `getBoundingClientRect()` into a rotated bounding box.
 */
function MarqueeColumn({
  cards,
  duration,
  reverse,
}: {
  cards: React.ReactNode[]
  duration: number
  reverse: boolean
}) {
  const reduceMotion = useReducedMotion()
  const from = reverse ? "-50%" : "0%"
  const to = reverse ? "0%" : "-50%"

  return (
    <div className="min-w-0 flex-1 overflow-hidden">
      <motion.div
        animate={reduceMotion ? undefined : { y: [from, to] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{ y: from }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-col gap-5 pb-5">
            {cards}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * The tilted, slowly scrolling wall of components behind the hero. Decorative
 * only: `inert` keeps every control out of the tab order and the pointer path,
 * and the scrim keeps the headline readable on top of it.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 flex h-[1100px] w-[1560px] -translate-x-1/2 -translate-y-1/2 -rotate-12 gap-5 opacity-90 blur-[1px]">
        {columns.map((column, index) => (
          <MarqueeColumn
            key={index}
            cards={column.cards}
            duration={column.duration}
            reverse={index % 2 === 1}
          />
        ))}
      </div>

      <div className="bg-background/55 absolute inset-0" />
      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={0.7}
        className="absolute inset-x-0 bottom-0 h-56"
      />
      <div className="from-background absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t to-transparent" />
      <div className="from-background absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent sm:w-40" />
      <div className="from-background absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent sm:w-40" />
    </div>
  )
}
