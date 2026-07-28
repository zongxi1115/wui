"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  BellIcon,
  CircleDotIcon,
  MoonIcon,
  PlusIcon,
  Volume2Icon,
} from "lucide-react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
} from "@/registry/ui/ai-todo"
import type { AiTodoStatus } from "@/registry/ui/ai-todo"
import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ui/avatar"
import {
  Bubble,
  BubbleAvatar,
  BubbleBody,
  BubbleContent,
  BubbleHeader,
} from "@/registry/ui/bubble"
import { ColorPicker } from "@/registry/ui/color-picker"
import { InView } from "@/registry/ui/in-view"
import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  KanbanColumnBody,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  type KanbanMove,
} from "@/registry/ui/kanban"
import { Progress } from "@/registry/ui/progress"
import { Slider } from "@/registry/ui/slider"
import { SlidingNumber } from "@/registry/ui/sliding-number"
import { Switch } from "@/registry/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextLoop } from "@/registry/ui/text-loop"
import { TextShimmer } from "@/registry/ui/text-shimmer"
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"
import { cn } from "@/registry/lib/utils"

interface TileProps {
  zh: string
  en: string
  href: string
  /** Entrance delay in seconds, used to stagger the grid. */
  delay?: number
  className?: string
  /** Overrides the body padding for components that bring their own insets. */
  bodyClassName?: string
  children: React.ReactNode
}

function Tile({
  zh,
  en,
  href,
  delay = 0,
  className,
  bodyClassName,
  children,
}: TileProps) {
  return (
    <InView
      as="section"
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      viewOptions={{ margin: "0px 0px -80px 0px" }}
      className={cn("bg-card flex flex-col rounded-lg border", className)}
    >
      <header className="flex items-center justify-between gap-3 border-b px-3 py-2.5">
        <div className="flex min-w-0 items-baseline gap-2">
          <h3 className="truncate text-sm font-medium">{zh}</h3>
          <span className="text-muted-foreground truncate font-mono text-xs">
            {en}
          </span>
        </div>
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1 text-xs transition-colors"
        >
          文档
          <ArrowRightIcon className="size-3" />
        </Link>
      </header>
      <div
        className={cn("flex flex-1 flex-col justify-center p-3", bodyClassName)}
      >
        {children}
      </div>
    </InView>
  )
}

const boardLabels: Record<string, string> = {
  backlog: "待规划",
  progress: "进行中",
  done: "已完成",
}
const initialBoard: Record<
  string,
  Array<{ id: string; title: string; meta: string }>
> = {
  backlog: [{ id: "nav", title: "重构移动端导航", meta: "设计 · 中优先级" }],
  progress: [
    { id: "calendar", title: "日历键盘交互", meta: "开发 · 高优先级" },
    { id: "tokens", title: "校对深色主题 token", meta: "设计系统 · 中" },
  ],
  done: [{ id: "api", title: "确认组件 API", meta: "开发 · 已完成" }],
}

function KanbanTile() {
  const [board, setBoard] = React.useState(initialBoard)

  function move({ itemId, from, to }: KanbanMove) {
    setBoard((current) => {
      const item = current[from].find((task) => task.id === itemId)
      if (!item) return current
      return {
        ...current,
        [from]: current[from].filter((task) => task.id !== itemId),
        [to]: [...current[to], item],
      }
    })
  }

  return (
    <Kanban
      onMove={move}
      className="w-full auto-cols-[minmax(10.5rem,1fr)] gap-2 pb-0"
    >
      {Object.entries(board).map(([column, tasks]) => (
        <KanbanColumn key={column} value={column} className="min-h-44">
          <KanbanColumnHeader className="min-h-10 px-3">
            <div className="flex items-center gap-2">
              <CircleDotIcon className="text-muted-foreground size-3.5" />
              <KanbanColumnTitle className="text-xs">
                {boardLabels[column]}
              </KanbanColumnTitle>
              <KanbanColumnCount>{tasks.length}</KanbanColumnCount>
            </div>
            <button
              type="button"
              aria-label={`添加到${boardLabels[column]}`}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-6 items-center justify-center rounded-md"
            >
              <PlusIcon className="size-3.5" />
            </button>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                value={task.id}
                className="p-2.5 text-xs"
              >
                <p className="pr-4 font-medium leading-5">{task.title}</p>
                <p className="text-muted-foreground mt-1.5 text-[11px]">
                  {task.meta}
                </p>
              </KanbanCard>
            ))}
          </KanbanColumnBody>
        </KanbanColumn>
      ))}
    </Kanban>
  )
}

const initialPlan: Array<{
  title: string
  description?: string
  status: AiTodoStatus
}> = [
  { title: "读取现有页面结构", status: "completed" },
  {
    title: "实现新的落地页布局",
    description: "保留主题变量与键盘交互。",
    status: "in-progress",
  },
  { title: "核对移动端密度", status: "pending" },
]

function AiTodoTile() {
  const [items, setItems] = React.useState(initialPlan)
  const completed = items.filter((item) => item.status === "completed").length

  return (
    <AiTodo className="w-full rounded-none border-0 bg-transparent">
      <AiTodoHeader>
        实施计划
        <span className="text-muted-foreground ml-auto text-xs font-normal tabular-nums">
          {completed}/{items.length}
        </span>
      </AiTodoHeader>
      <AiTodoList>
        {items.map((item, index) => (
          <AiTodoItem
            key={item.title}
            {...item}
            onStatusChange={(status) =>
              setItems((current) =>
                current.map((entry, entryIndex) =>
                  entryIndex === index ? { ...entry, status } : entry
                )
              )
            }
          />
        ))}
      </AiTodoList>
    </AiTodo>
  )
}

function BubbleTile() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Bubble>
        <BubbleAvatar>
          <Avatar size="sm">
            <AvatarFallback>林</AvatarFallback>
            <AvatarBadge status="online" size="sm" />
          </Avatar>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader>
            <span className="text-foreground font-medium">林晚</span>
            <time>10:24</time>
          </BubbleHeader>
          <BubbleContent>
            评审意见整理好了，键盘操作还要再确认一次。
          </BubbleContent>
        </BubbleBody>
      </Bubble>
      <Bubble side="end">
        <BubbleAvatar>
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              我
            </AvatarFallback>
          </Avatar>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader>
            <span className="text-foreground font-medium">你</span>
            <time>10:26</time>
          </BubbleHeader>
          <BubbleContent variant="primary">
            好，我来补齐焦点顺序和 Escape 关闭。
          </BubbleContent>
        </BubbleBody>
      </Bubble>
    </div>
  )
}

const events = [
  {
    title: "版本已发布",
    time: "今天 14:32",
    description: "v2.4.0 已部署到生产环境。",
    variant: "success" as const,
  },
  {
    title: "审核已通过",
    time: "今天 11:08",
    description: "设计与无障碍检查均已完成。",
    variant: "primary" as const,
  },
  {
    title: "提交变更",
    time: "昨天 18:46",
    description: "合并了 12 个组件更新。",
    variant: "default" as const,
  },
]

function TimelineTile() {
  return (
    <Timeline className="w-full">
      {events.map((event) => (
        <TimelineItem key={event.title}>
          <TimelineDot variant={event.variant} />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>{event.title}</TimelineTitle>
              <TimelineTime>{event.time}</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

function ColorPickerTile() {
  const [value, setValue] = React.useState("oklch(0.546 0.245 262.881)")

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <ColorPicker value={value} onValueChange={setValue} />
        <div
          aria-hidden
          className="size-9 shrink-0 rounded-md border"
          style={{ background: value }}
        />
      </div>
      <code className="text-muted-foreground w-full truncate font-mono text-xs">
        {value}
      </code>
      <p className="text-muted-foreground text-xs">
        感知色彩通道、透明度与精确 CSS 值，直接输出设计 Token。
      </p>
    </div>
  )
}

const invoices = [
  { invoice: "INV-2048", status: "已支付", method: "信用卡", total: "¥2,320" },
  {
    invoice: "INV-2047",
    status: "待支付",
    method: "银行转账",
    total: "¥1,145",
  },
  { invoice: "INV-2046", status: "已支付", method: "支付宝", total: "¥865" },
  { invoice: "INV-2045", status: "已逾期", method: "信用卡", total: "¥4,110" },
]

function TableTile() {
  return (
    <Table density="compact" striped>
      <TableHeader>
        <TableRow>
          <TableHead>单号</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>付款方式</TableHead>
          <TableHead className="text-right">金额</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-mono font-medium">
              {invoice.invoice}
            </TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="text-muted-foreground">
              {invoice.method}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {invoice.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ControlsTile() {
  const [notifications, setNotifications] = React.useState(true)
  const [dark, setDark] = React.useState(false)
  const [volume, setVolume] = React.useState([62])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="divide-y border-y">
        <SettingRow
          icon={<BellIcon />}
          title="重要通知"
          description="更新与提及"
        >
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
            aria-label="切换通知"
          />
        </SettingRow>
        <SettingRow icon={<MoonIcon />} title="深色外观" description="跟随系统">
          <Switch
            checked={dark}
            onCheckedChange={setDark}
            aria-label="切换深色外观"
          />
        </SettingRow>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Volume2Icon className="size-4" />
            输出音量
          </span>
          <span className="text-muted-foreground tabular-nums">
            {volume[0]}%
          </span>
        </div>
        <Slider
          value={volume}
          onValueChange={setVolume}
          formatValue={(value) => `${value}%`}
          aria-label="输出音量"
        />
      </div>
    </div>
  )
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="bg-muted text-foreground flex size-8 items-center justify-center rounded-md [&_svg]:size-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="text-muted-foreground block truncate text-xs">
          {description}
        </span>
      </span>
      {children}
    </div>
  )
}

function ProgressTile() {
  const [value, setValue] = React.useState(68)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 12 : current + 4))
    }, 900)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">正在下载更新</span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {value}%
        </span>
      </div>
      <Progress value={value} aria-label="正在下载更新" />
      <p className="text-muted-foreground text-xs">大约还需要一分钟</p>
    </div>
  )
}

function SlidingNumberTile() {
  const [value, setValue] = React.useState(64)

  return (
    <div className="w-full space-y-4">
      <div className="flex items-baseline justify-between border-b pb-3">
        <span className="text-muted-foreground text-sm">本月经常性收入</span>
        <span className="text-3xl font-semibold tracking-tight">
          ¥<SlidingNumber value={value} />k
        </span>
      </div>
      <input
        aria-label="本月经常性收入"
        type="range"
        min="0"
        max="999"
        value={value}
        className="accent-primary focus-visible:ring-ring/50 w-full rounded-full outline-none focus-visible:ring-[3px]"
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  )
}

function TextEffectsTile() {
  return (
    <div className="flex w-full flex-col gap-4">
      <TextShimmer className="text-lg font-medium" duration={1.8} spread={1.6}>
        正在生成代码…
      </TextShimmer>
      <p className="flex items-baseline gap-1.5 text-sm">
        <span className="text-muted-foreground">适用于</span>
        <TextLoop className="text-foreground font-medium" interval={2}>
          {["加载状态", "流式输出", "空状态提示", "英雄标题"]}
        </TextLoop>
      </p>
    </div>
  )
}

export function Showcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Tile
        zh="看板"
        en="Kanban"
        href="/docs/components/kanban"
        className="lg:col-span-2"
      >
        <KanbanTile />
      </Tile>
      <Tile
        zh="AI 待办"
        en="AI Todo"
        href="/docs/components/ai-todo"
        delay={0.05}
        bodyClassName="p-0"
      >
        <AiTodoTile />
      </Tile>

      <Tile zh="对话气泡" en="Bubble" href="/docs/components/bubble">
        <BubbleTile />
      </Tile>
      <Tile
        zh="时间轴"
        en="Timeline"
        href="/docs/components/timeline"
        delay={0.05}
      >
        <TimelineTile />
      </Tile>
      <Tile
        zh="颜色选择器"
        en="Color Picker"
        href="/docs/components/color-picker"
        delay={0.1}
      >
        <ColorPickerTile />
      </Tile>

      <Tile
        zh="表格"
        en="Table"
        href="/docs/components/table"
        className="lg:col-span-2"
        bodyClassName="p-0"
      >
        <TableTile />
      </Tile>
      <Tile
        zh="数字动效"
        en="Sliding Number"
        href="/docs/components/sliding-number"
        delay={0.05}
      >
        <SlidingNumberTile />
      </Tile>

      <Tile zh="开关与滑块" en="Switch · Slider" href="/docs/components/switch">
        <ControlsTile />
      </Tile>
      <Tile
        zh="进度条"
        en="Progress"
        href="/docs/components/progress"
        delay={0.05}
      >
        <ProgressTile />
      </Tile>
      <Tile
        zh="文字动效"
        en="Text Shimmer"
        href="/docs/components/text-shimmer"
        delay={0.1}
      >
        <TextEffectsTile />
      </Tile>
    </div>
  )
}
