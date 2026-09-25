"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

const TOTAL = 24

/** 首尾页常驻，当前页两侧各保留 `siblings` 个页码，其余折叠。 */
function getPageRange(page: number, total: number, siblings = 1) {
  const slots = siblings * 2 + 5
  if (total <= slots) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const start = Math.max(2, Math.min(page - siblings, total - siblings * 2 - 2))
  const end = Math.min(total - 1, Math.max(page + siblings, siblings * 2 + 3))
  const range: Array<number | "start-ellipsis" | "end-ellipsis"> = [1]

  if (start > 2) range.push("start-ellipsis")
  for (let item = start; item <= end; item++) range.push(item)
  if (end < total - 1) range.push("end-ellipsis")
  range.push(total)

  return range
}

export default function PaginationAdvanced() {
  const [page, setPage] = React.useState(6)

  function go(next: number) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setPage(Math.min(TOTAL, Math.max(1, next)))
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={page === 1}
              onClick={go(page - 1)}
            />
          </PaginationItem>
          {getPageRange(page, TOTAL).map((item) =>
            typeof item === "number" ? (
              <PaginationItem key={item}>
                <PaginationLink
                  href={`#page-${item}`}
                  isActive={page === item}
                  onClick={go(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={page === TOTAL}
              onClick={go(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-muted-foreground text-xs">
        连续点击「下一页」，页码窗口会整体平移，当前页指示器保持在视线中心。
      </p>
    </div>
  )
}
