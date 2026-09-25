"use client"

import * as React from "react"
import { FileTextIcon, FolderIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb"

type Node = { name: string; children?: Node[] }

const tree: Node = {
  name: "团队空间",
  children: [
    {
      name: "设计系统",
      children: [
        {
          name: "组件规范",
          children: [
            {
              name: "表单",
              children: [
                {
                  name: "输入框",
                  children: [{ name: "状态说明.md" }, { name: "交互稿.fig" }],
                },
                { name: "选择器", children: [{ name: "多选规范.md" }] },
              ],
            },
            { name: "导航", children: [{ name: "面包屑.md" }] },
          ],
        },
        { name: "色彩与字体", children: [{ name: "色板.fig" }] },
      ],
    },
    { name: "产品需求", children: [{ name: "Q4 路线图.md" }] },
  ],
}

const MAX_VISIBLE = 4

const MotionItem = motion.create(BreadcrumbItem)
const MotionSeparator = motion.create(BreadcrumbSeparator)

export default function BreadcrumbAnimated() {
  const reduceMotion = useReducedMotion()
  const [path, setPath] = React.useState<number[]>([0, 0, 0])
  const [expanded, setExpanded] = React.useState(false)

  const trail = path.reduce<Node[]>(
    (nodes, index) => [...nodes, nodes[nodes.length - 1].children![index]],
    [tree]
  )
  const current = trail[trail.length - 1]
  const collapsible = trail.length > MAX_VISIBLE && !expanded
  // 折叠时保留根节点与最后两级，中间层级收进省略号。
  const hidden = collapsible ? trail.slice(1, trail.length - 2) : []

  function navigate(depth: number) {
    setPath((value) => value.slice(0, depth))
    setExpanded(false)
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 40, mass: 0.7 }

  const crumbMotion = {
    layout: "position" as const,
    initial: reduceMotion ? false : { opacity: 0, x: -6 },
    animate: { opacity: 1, x: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 },
    transition,
  }

  return (
    <div className="w-full max-w-lg">
      <Breadcrumb aria-label="文件位置">
        <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {trail.flatMap((node, depth) => {
              const isLast = depth === trail.length - 1
              if (hidden.includes(node)) {
                if (depth !== 1) return []
                return [
                  <MotionItem key="ellipsis" {...crumbMotion}>
                    <button
                      type="button"
                      aria-label={`展开 ${hidden.length} 个折叠层级`}
                      onClick={() => setExpanded(true)}
                      className="hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 rounded-sm outline-none transition-colors focus-visible:ring-[3px]"
                    >
                      <BreadcrumbEllipsis className="size-6" />
                    </button>
                  </MotionItem>,
                  <MotionSeparator key="ellipsis-separator" {...crumbMotion} />,
                ]
              }
              const key = `${depth}-${node.name}`
              return [
                <MotionItem key={key} {...crumbMotion}>
                  {isLast ? (
                    <BreadcrumbPage className="truncate">{node.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      className="truncate"
                      onClick={(event) => {
                        event.preventDefault()
                        navigate(depth)
                      }}
                    >
                      {node.name}
                    </BreadcrumbLink>
                  )}
                </MotionItem>,
                isLast ? null : (
                  <MotionSeparator key={`${key}-separator`} {...crumbMotion} />
                ),
              ]
            })}
          </AnimatePresence>
        </BreadcrumbList>
      </Breadcrumb>

      <ul className="mt-4 divide-y border-y text-sm">
        {current.children?.map((child, index) => (
          <li key={child.name}>
            {child.children ? (
              <button
                type="button"
                className="hover:bg-accent/60 flex w-full items-center gap-2.5 px-2 py-2.5 text-left transition-colors"
                onClick={() => setPath((value) => [...value, index])}
              >
                <FolderIcon className="text-muted-foreground size-4" />
                {child.name}
                <span className="text-muted-foreground ml-auto text-xs">
                  {child.children.length} 项
                </span>
              </button>
            ) : (
              <div className="text-muted-foreground flex items-center gap-2.5 px-2 py-2.5">
                <FileTextIcon className="size-4" />
                {child.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
