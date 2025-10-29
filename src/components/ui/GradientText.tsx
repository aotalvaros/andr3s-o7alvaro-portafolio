import type React from "react"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className = "" }: Readonly<GradientTextProps>) {
  return (
    <span
      className={`bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient ${className}`}
    >
      {children}
    </span>
  )
}
