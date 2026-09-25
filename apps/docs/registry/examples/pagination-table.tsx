"use client"

import * as React from "react"

import { Input } from "@/registry/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

const TOTAL_ITEMS = 286

function getPageRange(page: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const start = Math.max(2, Math.min(page - 1, total - 4))
  const end = Math.min(total - 1, Math.max(page + 1, 5))
  const range: Array<number | "start-ellipsis" | "end-ellipsis"> = [1]

  if (start > 2) range.push("start-ellipsis")
  for (let item = start; item <= end; item++) range.push(item)
  if (end < total - 1) range.push("end-ellipsis")
  range.push(total)

  return range
}

export default function PaginationTable() {
  const [page, setPage] = React.useState(5)
  const [pageSize, setPageSize] = React.useState(20)
  const [jump, setJump] = React.useState("")
  const totalPages = Math.ceil(TOTAL_ITEMS / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, TOTAL_ITEMS)

  function go(next: number) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setPage(Math.min(totalPages, Math.max(1, next)))
    }
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t pt-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-3">
        <span className="tabular-nums">
          第 {from}–{to} 条，共 {TOTAL_ITEMS} 条
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            setPageSize(Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger size="sm" className="min-w-24" aria-label="每页条数">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 条/页</SelectItem>
            <SelectItem value="20">20 条/页</SelectItem>
            <SelectItem value="50">50 条/页</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                size="icon"
                className="px-0 sm:pr-0"
                disabled={page === 1}
                onClick={go(page - 1)}
              >
                <span className="sr-only">上一页</span>
              </PaginationPrevious>
            </PaginationItem>
            {getPageRange(page, totalPages).map((item) =>
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
                size="icon"
                className="px-0 sm:pl-0"
                disabled={page === totalPages}
                onClick={go(page + 1)}
              >
                <span className="sr-only">下一页</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <form
          className="text-muted-foreground hidden items-center gap-2 md:flex"
          onSubmit={(event) => {
            event.preventDefault()
            const target = Number(jump)
            if (!Number.isFinite(target) || target < 1) return
            setPage(Math.min(totalPages, Math.round(target)))
            setJump("")
          }}
        >
          <label htmlFor="pagination-jump">前往</label>
          <Input
            id="pagination-jump"
            size="sm"
            inputMode="numeric"
            value={jump}
            placeholder={String(page)}
            onChange={(event) => setJump(event.target.value.replace(/\D/g, ""))}
            wrapperClassName="w-14"
            className="px-2 text-center tabular-nums"
          />
          <span>页</span>
        </form>
      </div>
    </div>
  )
}
