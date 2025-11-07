import { Button } from "@/components/ui/button"
import { PAGINATION_CONFIG } from "../constants/paginationConfig"

interface PaginationButtonProps {
  onClick: () => void
  disabled: boolean
  ariaLabel: string
  testId: string
  children: React.ReactNode
}

export function PaginationButton({ 
  onClick, 
  disabled, 
  ariaLabel, 
  testId, 
  children 
}: Readonly<PaginationButtonProps>) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`${PAGINATION_CONFIG.BUTTON_SIZE} hover:bg-chart-2 hover:text-amber-50`}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </Button>
  )
}