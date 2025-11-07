import { PAGINATION_CONFIG } from "../constants/paginationConfig"

export function calculatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const { SHOW_PAGES, ELLIPSIS } = PAGINATION_CONFIG
  const pages: (number | string)[] = []

  // Caso 1: Pocas páginas, mostrar todas
  if (totalPages <= SHOW_PAGES + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Caso 2: Página actual al inicio
  if (currentPage <= 3) {
    for (let i = 1; i <= SHOW_PAGES; i++) {
      pages.push(i)
    }
    pages.push(ELLIPSIS, totalPages)
    return pages
  }

  // Caso 3: Página actual al final
  if (currentPage >= totalPages - 2) {
    pages.push(1, ELLIPSIS)
    for (let i = totalPages - SHOW_PAGES + 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Caso 4: Página actual en el medio
  pages.push(1, ELLIPSIS)
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    pages.push(i)
  }
  pages.push(ELLIPSIS, totalPages)

  return pages
}