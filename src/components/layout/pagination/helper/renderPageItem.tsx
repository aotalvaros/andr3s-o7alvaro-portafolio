import { Button } from "@/components/ui/button"
import { PAGINATION_CONFIG } from "../constants/paginationConfig"

export function renderPageItem(
  page: number | string, 
  index: number, 
  currentPage: number, 
  onPageChangeNext: (page: number) => void
) {
  if (typeof page === "number") {
    const isActive = currentPage === page
    
    return (
      <Button
        key={index}
        variant={isActive ? "default" : "outline"}
        onClick={() => onPageChangeNext(page)}
        className={getPageButtonStyles(isActive)}
        aria-label={`Ir a la página ${page}`}
        aria-current={isActive ? "page" : undefined}
        data-testid={`pagination-page-${page}`}
      >
        {page}
      </Button>
    )
  }

  return (
    <span 
      key={index} 
      className="flex items-center px-2 text-muted-foreground"
      aria-hidden="true"
    >
      {page}
    </span>
  )
}


function getPageButtonStyles(isActive: boolean): string {
  const baseStyles = `h-10 ${PAGINATION_CONFIG.MIN_BUTTON_WIDTH} px-3`
  
  if (isActive) {
    return `${baseStyles} bg-primary text-amber-50 dark:bg-gray-800 dark:border border-input`
  }
  
  return `${baseStyles} hover:bg-chart-2 hover:text-amber-50`
}