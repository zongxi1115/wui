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

const pages = [1, 2, 3]

export default function PaginationAdvanced() {
  const [page, setPage] = React.useState(2)
  const lastPage = 12

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center text-sm">
        当前第 {page} 页，共 {lastPage} 页
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
              tabIndex={page === 1 ? -1 : undefined}
              onClick={(event) => {
                event.preventDefault()
                setPage((value) => Math.max(1, value - 1))
              }}
            />
          </PaginationItem>
          {pages.map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={page === lastPage}
              onClick={(event) => {
                event.preventDefault()
                setPage(lastPage)
              }}
            >
              {lastPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === lastPage}
              className={
                page === lastPage ? "pointer-events-none opacity-50" : undefined
              }
              tabIndex={page === lastPage ? -1 : undefined}
              onClick={(event) => {
                event.preventDefault()
                setPage((value) => Math.min(lastPage, value + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
