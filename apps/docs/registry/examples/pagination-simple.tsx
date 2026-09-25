"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationCounter,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

const TOTAL = 18

export default function PaginationSimple() {
  const [page, setPage] = React.useState(3)

  function go(next: number) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setPage(Math.min(TOTAL, Math.max(1, next)))
    }
  }

  return (
    <Pagination>
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
        <PaginationItem>
          <PaginationCounter page={page} total={TOTAL} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            size="icon"
            className="px-0 sm:pl-0"
            disabled={page === TOTAL}
            onClick={go(page + 1)}
          >
            <span className="sr-only">下一页</span>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
