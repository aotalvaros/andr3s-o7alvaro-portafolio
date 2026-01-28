"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  icon?: React.ReactNode
}

export const FloatingActionButton = ({
    onClick,
    className,
    icon = <Plus className="h-6 w-6 text-white" />,
    ...rest
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-105 transition-transform",
        className
      )}
      {...rest}
    >
    {icon}
    </Button>
  )
}
