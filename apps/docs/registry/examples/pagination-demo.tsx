"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

const TOTAL = 5

export default function PaginationDemo() {
  const [page, setPage] = React.useState(1)

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
            disabled={page === 1}
            onClick={go(page - 1)}
          />
        </PaginationItem>
        {Array.from({ length: TOTAL }, (_, index) => index + 1).map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              href={`#page-${item}`}
              isActive={page === item}
              onClick={go(item)}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={page === TOTAL}
            onClick={go(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
