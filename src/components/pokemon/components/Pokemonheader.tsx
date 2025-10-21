"use client"

import { Sparkles } from "lucide-react"

export function PokemonHeader() {
  const letters = ["P", "o", "k", "é", "d", "e", "x"]
  return (
   <header className="mb-12 text-center space-y-4" itemID="pokemon-header" data-testid="pokemon-header">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
      </div>

      <div className="animated-title-wrapper">
        <h1 className="animated-title text-6xl md:text-7xl font-bold tracking-tight">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="animated-char bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Explora el universo Pokémon con nuestra colección completa de criaturas increíbles
      </p>
    </header>
  )
}
