import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  category: "navigation" | "actions" | "social" | "lab" | "custom"
  priority?: number
}

interface ICommandPaletteState {
  isOpen: boolean
  search: string
  selectedIndex: number
  commands: CommandItem[]
  
  // Actions
  setOpen: (open: boolean) => void
  setSearch: (search: string) => void
  setSelectedIndex: (index: number) => void
  registerCommand: (command: CommandItem) => void
  unregisterCommand: (commandId: string) => void
  executeSelectedCommand: () => void
  resetState: () => void
}

export const useCommandPaletteStore = create<ICommandPaletteState>()(
    devtools((set, get) => {
      return {
      isOpen: false,
      search: '',
      selectedIndex: 0,
      commands: [],

      setOpen: (isOpen) => {
        set({ isOpen })
        if (!isOpen) {
          // Reset state when closing
          set({ search: '', selectedIndex: 0 })
        }
      },

      setSearch: (search) => set({ search, selectedIndex: 0 }),

      setSelectedIndex: (selectedIndex) => set({ selectedIndex }),

      registerCommand: (command) =>
        set((state) => ({
          commands: [...state.commands.filter(cmd => cmd.id !== command.id), command]
            .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        })),

      unregisterCommand: (commandId) =>
        set((state) => ({
          commands: state.commands.filter(cmd => cmd.id !== commandId)
        })),

      executeSelectedCommand: () => {
        const { commands, selectedIndex, search } = get()
        const filteredCommands = filterCommands(commands, search)
        const selectedCommand = filteredCommands[selectedIndex]
        
        if (selectedCommand) {
          selectedCommand.action()
          set({ isOpen: false, search: '', selectedIndex: 0 })
        }
      },

      resetState: () => set({ isOpen: false, search: '', selectedIndex: 0 })
    };
    },
    { enabled: process.env.NODE_ENV === 'development' }
  )
)

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