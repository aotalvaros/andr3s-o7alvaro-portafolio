"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Card } from "./card"

interface SkillCardProps {
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
  stack?: string
  className?: string
}

export function SkillCard({ title, description, icon, details, stack, className = "" }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      className={`group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 h-full flex flex-col">
        {/* Icon */}
        <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>

        {/* Expandable Details */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-2 mb-4">
            {details.map((detail, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          {stack && (
            <p className="text-xs text-primary font-semibold">
              Stack: <span className="text-foreground font-normal">{stack}</span>
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-primary font-medium">
          <span>{isExpanded ? "Ver menos" : "Ver más"}</span>
          <ArrowRight
            className={`h-4 w-4 transition-transform duration-300 ${
              isExpanded ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          />
        </div>
      </div>
    </Card>
  )
}
