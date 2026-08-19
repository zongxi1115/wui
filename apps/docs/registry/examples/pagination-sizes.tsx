"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

export default function PaginationSizes() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 紧凑尺寸 sm */}
      <div className="space-y-1.5 text-center">
        <p className="text-xs font-medium text-muted-foreground">紧凑尺寸 (Small / sm)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious size="sm" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm" href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm" href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm" href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext size="sm" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* 标准尺寸 default */}
      <div className="space-y-1.5 text-center">
        <p className="text-xs font-medium text-muted-foreground">标准尺寸 (Default)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  3
                </PaginationLink>
              </PaginationItem>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* 放大尺寸 lg */}
      <div className="space-y-1.5 text-center">
        <p className="text-xs font-medium text-muted-foreground">放大尺寸 (Large / lg)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious size="lg" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="lg" href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="lg" href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="lg" href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext size="lg" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
