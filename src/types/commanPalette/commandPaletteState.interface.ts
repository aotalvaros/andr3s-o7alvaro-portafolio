
export interface ICommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  category: "navigation" | "actions" | "social" | "lab" | "custom"
  priority?: number // Para ordenar comandos
}

export interface ICommandPaletteState {
  isOpen: boolean
  search: string
  selectedIndex: number
  commands: ICommandItem[]
  
  // Actions
  setOpen: (open: boolean) => void
  setSearch: (search: string) => void
  setSelectedIndex: (index: number) => void
  registerCommand: (command: ICommandItem) => void
  unregisterCommand: (commandId: string) => void
  executeSelectedCommand: () => void
  resetState: () => void
}