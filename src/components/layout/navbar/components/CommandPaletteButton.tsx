
import { useCallback } from 'react'
import { Command } from 'lucide-react'

export function CommandPaletteButton() {
  const handleClick = useCallback(() => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [])

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/50 hover:bg-muted transition-colors group"
      data-testid="command-palette-button"
    >
      <Command className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="hidden md:inline-flex  text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          Buscar
        </span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          Ctrl+K
      </kbd>
    </button>
  )
}