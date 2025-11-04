import { useEffect, useCallback } from 'react'
import { useCommandPaletteStore, type CommandItem } from '@/store/commandPaletteStore'

// Utility function to filter commands
function filterCommands(commands: CommandItem[], search: string): CommandItem[] {
  if (!search) return commands

  const searchLower = search.toLowerCase()
  return commands.filter((cmd) => {
    const labelMatch = cmd.label.toLowerCase().includes(searchLower)
    const descMatch = cmd.description?.toLowerCase().includes(searchLower)
    const keywordMatch = cmd.keywords?.some((kw) => kw.toLowerCase().includes(searchLower))
    return labelMatch || descMatch || keywordMatch
  })
}

export function useCommandPalette() {
  const store = useCommandPaletteStore()

  // Keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { isOpen, setOpen, executeSelectedCommand, setSelectedIndex, search, commands, selectedIndex } = store
    const filteredCommands = filterCommands(commands, search)

    const inputRegex = /INPUT|TEXTAREA/
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === 'k' && !isOpen && !inputRegex.exec((e.target as HTMLElement)?.tagName || ''))) {
      e.preventDefault()
      setOpen(!isOpen)
      return
    }

    // Close palette
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setOpen(false)
      return
    }

    // Navigation when open
    if (isOpen) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((selectedIndex + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(
            (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length
          )
          break
        case 'Enter':
          e.preventDefault()
          executeSelectedCommand()
          break
      }
    }
  }, [store])

  // Setup keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Get filtered commands
  const filteredCommands = filterCommands(store.commands, store.search)

  // Function to execute command by index
  const executeCommandByIndex = useCallback((index: number) => {
    const command = filteredCommands[index]
    if (command) {
      command.action()
      store.setOpen(false)
    }
  }, [filteredCommands, store])

  return {
    ...store,
    filteredCommands,
    executeCommandByIndex,
    registerCommand: store.registerCommand,
    unregisterCommand: store.unregisterCommand,
  }
}

// Hook for registering commands from components
export function useRegisterCommand(command: CommandItem) {
  const { registerCommand, unregisterCommand } = useCommandPalette()

  useEffect(() => {
    registerCommand(command)
    return () => unregisterCommand(command.id)
  }, [command, registerCommand, unregisterCommand])
}