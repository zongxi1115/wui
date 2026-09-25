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

const sizes = [
  { size: "sm", label: "sm · 32px", item: "size-8 px-0" },
  { size: "default", label: "default · 36px", item: "size-9 px-0" },
  { size: "lg", label: "lg · 40px", item: "size-10 px-0" },
] as const

export default function PaginationSizes() {
  return (
    <div className="grid gap-6">
      {sizes.map((preset) => (
        <SizedPagination key={preset.size} {...preset} />
      ))}
    </div>
  )
}

function SizedPagination({
  size,
  label,
  item,
}: (typeof sizes)[number]) {
  const [page, setPage] = React.useState(2)
  const total = 4

  function go(next: number) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setPage(Math.min(total, Math.max(1, next)))
    }
  }

  return (
    <div className="flex items-center gap-6">
      <span className="text-muted-foreground w-28 shrink-0 text-xs tabular-nums">
        {label}
      </span>
      <Pagination className="mx-0 w-auto justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size={size}
              href="#"
              disabled={page === 1}
              onClick={go(page - 1)}
            />
          </PaginationItem>
          {Array.from({ length: total }, (_, index) => index + 1).map((value) => (
            <PaginationItem key={value}>
              <PaginationLink
                size={size}
                href={`#page-${value}`}
                className={item}
                isActive={page === value}
                onClick={go(value)}
              >
                {value}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              size={size}
              href="#"
              disabled={page === total}
              onClick={go(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
