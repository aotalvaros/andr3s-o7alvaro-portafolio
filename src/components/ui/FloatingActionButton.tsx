"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export const FloatingActionButton = ({
    onClick,
    className,
    icon = <Plus className="h-6 w-6 text-white" />
}: {
  onClick: () => void,
  icon?: React.ReactNode | string,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-105 transition-transform",
        className
      )}
    >
    {icon}
    </Button>
  )
}
