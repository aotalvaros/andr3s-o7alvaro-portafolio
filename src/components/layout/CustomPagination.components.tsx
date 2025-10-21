"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChangeNext: (page: number) => void
}

export function CustomPagination({ currentPage, totalPages, onPageChangeNext }: CustomPaginationProps) {

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= showPages; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - showPages + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div itemID="pagination_component" className="flex items-center justify-center gap-2 flex-wrap mt-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChangeNext(1)}
        disabled={currentPage === 1}
        className="h-10 w-10 hover:bg-chart-2 hover:text-amber-50"
        data-testid="pagination-first-page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChangeNext(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 hover:bg-chart-2 hover:text-amber-50"
        data-testid="pagination-prev-page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChangeNext(page)}
              className={`h-10 min-w-10 px-3 ${currentPage === page ? 'bg-primary-foreground text-amber-50 dark:bg-gray-800 dark:border border-input' : 'hover:bg-chart-2 hover:text-amber-50'}`}
              data-testid={`pagination-page-${page}`}
           >
              {page}
            </Button>
          ) : (
            <span key={index} className="flex items-center px-2 text-muted-foreground">
              {page}
            </span>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChangeNext(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 hover:bg-chart-2 hover:text-amber-50"
        data-testid="pagination-next-page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChangeNext(totalPages)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 hover:bg-chart-2 hover:text-amber-50"
        data-testid="pagination-last-page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
