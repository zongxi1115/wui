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

export default function PaginationTable() {
  const [page, setPage] = React.useState(5)
  const [pageSize, setPageSize] = React.useState(10)
  const totalItems = 286
  const totalPages = Math.ceil(totalItems / pageSize)

  // 动态生成页码数组 (支持双侧省略)
  const getPageNumbers = () => {
    const delta = 1
    const range: number[] = []
    const rangeWithDots: (number | "dots")[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i)
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push("dots")
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border bg-background p-4 shadow-xs">
      {/* 左侧总数统计与每页条数 */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>共 <strong className="text-foreground font-semibold">{totalItems}</strong> 条数据</span>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <span>每页</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-7 rounded border bg-transparent px-2 text-xs text-foreground outline-none focus:border-ring"
          >
            <option value={10}>10 条</option>
            <option value={20}>20 条</option>
            <option value={50}>50 条</option>
          </select>
        </div>
      </div>

      {/* 中间页码翻页器 */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
              onClick={(e) => {
                e.preventDefault()
                setPage((p) => Math.max(1, p - 1))
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((item, index) =>
            item === "dots" ? (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={page === item}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(item)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
              onClick={(e) => {
                e.preventDefault()
                setPage((p) => Math.min(totalPages, p + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* 右侧快速跳转 */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>跳至</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          defaultValue={page}
          key={page}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = Math.max(1, Math.min(totalPages, Number((e.target as HTMLInputElement).value)))
              setPage(target)
            }
          }}
          className="h-7 w-12 rounded border bg-transparent px-1.5 text-center text-xs text-foreground outline-none focus:border-ring tabular-nums"
        />
        <span>页</span>
      </div>
    </div>
  )
}
