"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
} from "@/registry/ui/table"
import { cn } from "@/registry/lib/utils"

type Order = {
  id: string
  customer: string
  createdAt: string
  amount: number
  status: "待发货" | "运输中" | "已签收"
  address: string
  carrier: string
  items: Array<{ name: string; qty: number; price: number }>
}

const orders: Order[] = [
  {
    id: "SO-240918",
    customer: "陈一鸣",
    createdAt: "09-18 14:32",
    amount: 2396,
    status: "运输中",
    address: "上海市徐汇区漕溪北路 88 号 1203 室",
    carrier: "顺丰速运 SF1402 8837 6620",
    items: [
      { name: "人体工学办公椅 · 灰", qty: 1, price: 1899 },
      { name: "头枕加高配件", qty: 1, price: 199 },
      { name: "静音万向轮（5 只装）", qty: 1, price: 298 },
    ],
  },
  {
    id: "SO-240917",
    customer: "王书宁",
    createdAt: "09-17 09:05",
    amount: 568,
    status: "待发货",
    address: "杭州市西湖区文三路 259 号",
    carrier: "等待仓库出库",
    items: [
      { name: "桌面显示器支架", qty: 1, price: 369 },
      { name: "理线槽套装", qty: 1, price: 199 },
    ],
  },
  {
    id: "SO-240915",
    customer: "赵可欣",
    createdAt: "09-15 20:47",
    amount: 4280,
    status: "已签收",
    address: "成都市高新区天府大道中段 1366 号",
    carrier: "京东物流 JDVB 0917 2231",
    items: [{ name: "电动升降桌 1.4m · 胡桃木", qty: 1, price: 4280 }],
  },
  {
    id: "SO-240912",
    customer: "刘星河",
    createdAt: "09-12 11:18",
    amount: 1136,
    status: "已签收",
    address: "北京市朝阳区望京街 10 号",
    carrier: "中通快递 7531 0028 4410",
    items: [
      { name: "护腰靠垫", qty: 2, price: 239 },
      { name: "脚踏板 · 可调角度", qty: 1, price: 658 },
    ],
  },
]

const statusVariant = {
  待发货: "warning",
  运输中: "info",
  已签收: "secondary",
} as const

const MotionTableRow = motion.create(TableRow)
const ease = [0.22, 1, 0.36, 1] as const
const money = (value: number) =>
  `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`

export default function TableExpandable() {
  const reduceMotion = useReducedMotion()
  const [expanded, setExpanded] = React.useState<string | null>("SO-240918")
  const [direction, setDirection] = React.useState<"asc" | "desc" | false>(false)

  const rows = React.useMemo(() => {
    if (!direction) return orders
    return [...orders].sort((a, b) =>
      direction === "asc" ? a.amount - b.amount : b.amount - a.amount
    )
  }, [direction])

  const cycleSort = () =>
    setDirection((current) =>
      current === false ? "desc" : current === "desc" ? "asc" : false
    )

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease }

  return (
    <div className="w-full rounded-md border">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <span className="sr-only">展开</span>
            </TableHead>
            <TableHead>订单号</TableHead>
            <TableHead>客户</TableHead>
            <TableHead>下单时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead
              className="text-right"
              aria-sort={
                direction === "asc"
                  ? "ascending"
                  : direction === "desc"
                    ? "descending"
                    : undefined
              }
            >
              <TableSortButton direction={direction} onClick={cycleSort}>
                实付金额
              </TableSortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => {
            const open = expanded === order.id
            const detailId = `${order.id}-detail`
            return (
              <React.Fragment key={order.id}>
                <MotionTableRow
                  layout={reduceMotion ? false : "position"}
                  transition={layoutTransition}
                  data-state={open ? "selected" : undefined}
                  className={cn("cursor-pointer", open && "border-b-0")}
                  onClick={() => setExpanded(open ? null : order.id)}
                >
                  <TableCell className="pr-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={detailId}
                      aria-label={
                        open ? `收起订单 ${order.id}` : `展开订单 ${order.id}`
                      }
                      onClick={(event) => {
                        event.stopPropagation()
                        setExpanded(open ? null : order.id)
                      }}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 flex size-6 items-center justify-center rounded-sm outline-none focus-visible:ring-2"
                    >
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                          open && "rotate-90"
                        )}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {order.createdAt}
                  </TableCell>
                  <TableCell>
                    <Badge size="sm" variant={statusVariant[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {money(order.amount)}
                  </TableCell>
                </MotionTableRow>
                <AnimatePresence initial={false}>
                  {open ? (
                    <MotionTableRow
                      key="detail"
                      layout={reduceMotion ? false : "position"}
                      transition={layoutTransition}
                      className="bg-muted/30 hover:bg-muted/30"
                    >
                      <TableCell colSpan={6} className="whitespace-normal p-0">
                        <motion.div
                          id={detailId}
                          initial={
                            reduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            reduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: reduceMotion ? 0 : 0.26, ease }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-6 py-4 pr-4 pl-14 sm:grid-cols-[1fr_220px]">
                            <div>
                              <p className="text-muted-foreground mb-2 text-xs">
                                商品明细
                              </p>
                              <ul className="divide-y text-sm">
                                {order.items.map((item) => (
                                  <li
                                    key={item.name}
                                    className="flex items-center justify-between gap-4 py-1.5"
                                  >
                                    <span>
                                      {item.name}
                                      <span className="text-muted-foreground ml-2 text-xs">
                                        × {item.qty}
                                      </span>
                                    </span>
                                    <span className="tabular-nums">
                                      {money(item.price * item.qty)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <dl className="space-y-3 text-sm">
                              <div>
                                <dt className="text-muted-foreground mb-0.5 text-xs">
                                  收货地址
                                </dt>
                                <dd>{order.address}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground mb-0.5 text-xs">
                                  物流
                                </dt>
                                <dd className="tabular-nums">{order.carrier}</dd>
                              </div>
                            </dl>
                          </div>
                        </motion.div>
                      </TableCell>
                    </MotionTableRow>
                  ) : null}
                </AnimatePresence>
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
