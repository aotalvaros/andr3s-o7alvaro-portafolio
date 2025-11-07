"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useMemo } from "react"
import { calculatePageNumbers } from "./helper/calculatePageNumbers"
import { PaginationButton } from "./components/PaginationButton"
import { renderPageItem } from "./helper/renderPageItem"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChangeNext: (page: number) => void
}


export function CustomPagination({ 
  currentPage, 
  totalPages, 
  onPageChangeNext 
}: Readonly<CustomPaginationProps>) {

  const pageNumbers = useMemo(() => {
    return calculatePageNumbers(currentPage, totalPages)
  }, [currentPage, totalPages])

  // Handlers para mejorar legibilidad
  const handleFirstPage = () => onPageChangeNext(1)
  const handlePreviousPage = () => onPageChangeNext(currentPage - 1)
  const handleNextPage = () => onPageChangeNext(currentPage + 1)
  const handleLastPage = () => onPageChangeNext(totalPages)

  // Estados de botones para evitar repetición
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <nav 
      role="navigation" 
      aria-label="Navegación de páginas"
      aria-describedby="pagination-info"
      className="flex items-center justify-center gap-2 flex-wrap mt-3"
      data-testid="pagination-component"
    >
      {/* Botón primera página */}
      <PaginationButton
        onClick={handleFirstPage}
        disabled={isFirstPage}
        ariaLabel="Ir a la primera página"
        testId="pagination-first-page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </PaginationButton>

      {/* Botón página anterior */}
      <PaginationButton
        onClick={handlePreviousPage}
        disabled={isFirstPage}
        ariaLabel="Ir a la página anterior"
        testId="pagination-prev-page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      {/* Números de página */}
      <div className="flex gap-1">
        {pageNumbers.map((page, index) => 
          renderPageItem(page, index, currentPage, onPageChangeNext)
        )}
      </div>

      {/* Botón página siguiente */}
      <PaginationButton
        onClick={handleNextPage}
        disabled={isLastPage}
        ariaLabel="Ir a la página siguiente"
        testId="pagination-next-page"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>

      {/* Botón última página */}
      <PaginationButton
        onClick={handleLastPage}
        disabled={isLastPage}
        ariaLabel="Ir a la última página"
        testId="pagination-last-page"
      >
        <ChevronsRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  )
}