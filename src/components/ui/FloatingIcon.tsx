"use client"

import type React from "react"

interface FloatingIconProps {
  children: React.ReactNode
  delay?: number
  className?: string
  stopAnimation?: boolean
}

export function FloatingIcon({ children, delay = 0, className = "", stopAnimation = false }: Readonly<FloatingIconProps>) {
  
  return (
    <div className={`animate-float ${className}`} style={{ animationDelay: `${delay}s`, animationPlayState: stopAnimation ? "paused" : "running" }}>
      {children}
    </div>
  )
}
