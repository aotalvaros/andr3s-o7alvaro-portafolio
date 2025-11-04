'use client'

import { useMemo } from 'react'
import { Search, ArrowUp, Command } from 'lucide-react'
import { useCommandPalette } from '@/hooks/commandPalette/useCommandPalette'
import type { CommandItem } from '@/store/commandPaletteStore'

const categoryLabels = {
  navigation: 'Navegación',
  lab: 'Laboratorio',
  actions: 'Acciones',
  social: 'Social',
  custom: 'Personalizado',
}

function CommandList({ 
  groupedCommands, 
  selectedIndex, 
  onSelectCommand,
  onExecuteCommand 
}: {
  readonly groupedCommands: Record<string, CommandItem[]>
  readonly selectedIndex: number
  readonly onSelectCommand: (index: number) => void
  readonly onExecuteCommand: (index: number) => void
}) {
  let currentIndex = 0

  return (
    <div className="space-y-2">
      {Object.entries(groupedCommands).map(([category, commands]) => {
        if (commands.length === 0) return null

        const categoryCommands = commands.map((command) => {
          const isSelected = currentIndex === selectedIndex
          const commandIndex = currentIndex++
          
          return (
            <button
              key={command.id}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => onExecuteCommand(commandIndex)}
              onMouseEnter={() => onSelectCommand(commandIndex)}
              data-testid={`command-item-${command.id}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-background/50">
                {command.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{command.label}</div>
                {command.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {command.description}
                  </div>
                )}
              </div>
              {isSelected && (
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ↵
                </kbd>
              )}
            </button>
          )
        })

        return (
          <div key={category} className="space-y-1">
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {categoryLabels[category as keyof typeof categoryLabels] || category}
            </div>
            {categoryCommands}
          </div>
        )
      })}
    </div>
  )
}

function CommandPaletteFooter() {
  return (
    <div className="border-t border-border/50 px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            <ArrowUp className="h-2.5 w-2.5" />
          </kbd>
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            ↓
          </kbd>
          <span>Navegar</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            ↵
          </kbd>
          <span>o</span>
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            Click
          </kbd>
          <span>Ejecutar</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            <Command className="h-2.5 w-2.5" />
          </kbd>
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium">
            K
          </kbd>
          <span>Abrir</span>
        </div>
      </div>
    </div>
  )
}

export function CommandPalette() {
  const { 
    isOpen, 
    search, 
    selectedIndex, 
    filteredCommands,
    executeCommandByIndex,
    setOpen, 
    setSearch, 
    setSelectedIndex 
  } = useCommandPalette()

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      lab: [],
      actions: [],
      social: [],
      custom: [],
    }

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd)
    })

    return groups
  }, [filteredCommands])

  if (!isOpen) return null

  return (
    <>
      <button
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in border-0 p-0"
        onClick={() => setOpen(false)}
        aria-label="Cerrar paleta de comandos"
        data-testid="command-palette-overlay"
      />

      <div 
        className="fixed left-1/2 top-[10%] z-[101] w-full max-w-2xl -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300"
        data-testid="command-palette"
      >
        <div className="mx-4 overflow-hidden rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar comandos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
              data-testid="command-palette-input"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No se encontraron comandos
              </div>
            ) : (
              <CommandList 
                groupedCommands={groupedCommands}
                selectedIndex={selectedIndex}
                onSelectCommand={setSelectedIndex}
                onExecuteCommand={executeCommandByIndex}
              />
            )}
          </div>

          <CommandPaletteFooter />
        </div>
      </div>
    </>
  )
}