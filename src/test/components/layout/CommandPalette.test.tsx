import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCommandPalette } from '@/hooks/commandPalette/useCommandPalette'
import type { CommandItem } from '@/store/commandPaletteStore'
import { CommandPalette } from '@/components/layout/commandPalette'

vi.mock('@/hooks/commandPalette/useCommandPalette')

vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search Icon</div>,
  ArrowUp: () => <div data-testid="arrow-up-icon">ArrowUp Icon</div>,
  Command: () => <div data-testid="command-icon">Command Icon</div>,
}))

describe('CommandPalette', () => {
  const mockSetOpen = vi.fn()
  const mockSetSearch = vi.fn()
  const mockSetSelectedIndex = vi.fn()
  const mockExecuteCommandByIndex = vi.fn()

  const mockCommands: CommandItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      description: 'Ir a la página de inicio',
      category: 'navigation',
      icon: <span>🏠</span>,
      action: vi.fn(),
    },
    {
      id: 'lab',
      label: 'Laboratorio',
      description: 'Ir al laboratorio',
      category: 'lab',
      icon: <span>🔬</span>,
      action: vi.fn(),
    },
    {
      id: 'settings',
      label: 'Configuración',
      category: 'actions',
      icon: <span>⚙️</span>,
      action: vi.fn(),
    },
    {
      id: 'twitter',
      label: 'Twitter',
      description: 'Abrir Twitter',
      category: 'social',
      icon: <span>🐦</span>,
      action: vi.fn(),
    },
  ]

  const defaultMockValues = {
    isOpen: true,
    search: '',
    selectedIndex: 0,
    filteredCommands: mockCommands,
    commands: mockCommands,
    executeCommandByIndex: mockExecuteCommandByIndex,
    setOpen: mockSetOpen,
    setSearch: mockSetSearch,
    setSelectedIndex: mockSetSelectedIndex,
    registerCommand: vi.fn(),
    unregisterCommand: vi.fn(),
    executeSelectedCommand: vi.fn(),
    resetState: vi.fn(),
  } 

  beforeEach(() => {
    vi.mocked(useCommandPalette).mockReturnValue(defaultMockValues)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should not render anything when isOpen is false', () => {
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        isOpen: false,
      })

      const { container } = render(<CommandPalette />)
      expect(container.firstChild).toBeNull()
    })

    it('should render the component when isOpen is true', () => {
      render(<CommandPalette />)
      
      expect(screen.getByTestId('command-palette')).toBeInTheDocument()
      expect(screen.getByTestId('command-palette-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('command-palette-input')).toBeInTheDocument()
    })

    it('should render the input with the correct placeholder', () => {
      render(<CommandPalette />)
      
      const input = screen.getByPlaceholderText('Buscar comandos...')
      expect(input).toBeInTheDocument()
    })

    it('should render all UI icons', () => {
      render(<CommandPalette />)
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument()
      expect(screen.getByTestId('command-icon')).toBeInTheDocument()
    })
  })

  describe('Command Rendering', () => {
    it('should render all filtered commands', () => {
      render(<CommandPalette />)
      
      expect(screen.getByTestId('command-item-home')).toBeInTheDocument()
      expect(screen.getByTestId('command-item-lab')).toBeInTheDocument()
      expect(screen.getByTestId('command-item-settings')).toBeInTheDocument()
      expect(screen.getByTestId('command-item-twitter')).toBeInTheDocument()
    })

    it('should render all commands with their correct labels', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getAllByText('Laboratorio')[0]).toBeInTheDocument()
      expect(screen.getByText('Configuración')).toBeInTheDocument()
      expect(screen.getByText('Twitter')).toBeInTheDocument()
    })

    it('should render the descriptions when they exist', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('Ir a la página de inicio')).toBeInTheDocument()
      expect(screen.getByText('Ir al laboratorio')).toBeInTheDocument()
      expect(screen.getByText('Abrir Twitter')).toBeInTheDocument()
    })

    it('should render commands without description correctly', () => {
      render(<CommandPalette />)
      
      const settingsButton = screen.getByTestId('command-item-settings')
      expect(settingsButton).toBeInTheDocument()
      expect(settingsButton).toHaveTextContent('Configuración')
    })

    it('should group commands by category', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('Navegación')).toBeInTheDocument()
      expect(screen.getAllByText('Laboratorio')[0]).toBeInTheDocument()
      expect(screen.getByText('Acciones')).toBeInTheDocument()
      expect(screen.getByText('Social')).toBeInTheDocument()
    })

    it('should show message when there are no commands', () => {
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        filteredCommands: [],
      })

      render(<CommandPalette />)
      
      expect(screen.getByText('No se encontraron comandos')).toBeInTheDocument()
    })

    it('should not render empty categories', () => {
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        filteredCommands: [mockCommands[0]], // Solo navegación
      })

      render(<CommandPalette />)
      
      expect(screen.getByText('Navegación')).toBeInTheDocument()
      expect(screen.queryByText('Laboratorio')).not.toBeInTheDocument()
      expect(screen.queryByText('Social')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should close the palette when clicking on the overlay', async () => {
      render(<CommandPalette />)
      
      const overlay = screen.getByTestId('command-palette-overlay')
      fireEvent.click(overlay)
      
      expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    it('should update the search when typing in the input', async () => {
      const user = userEvent.setup()
      render(<CommandPalette />)
      
      const input = screen.getByTestId('command-palette-input')
      await user.type(input, 'test')
      
      expect(mockSetSearch).toHaveBeenCalledTimes(4) 
      expect(mockSetSearch).toHaveBeenLastCalledWith('t')
    })

    it('should execute command when clicking on an item', async () => {
      render(<CommandPalette />)
      
      const homeCommand = screen.getByTestId('command-item-home')
      fireEvent.click(homeCommand)
      
      expect(mockExecuteCommandByIndex).toHaveBeenCalledWith(0)
    })

    it('should update selectedIndex when hovering over a command', async () => {
      render(<CommandPalette />)
      
      const labCommand = screen.getByTestId('command-item-lab')
      fireEvent.mouseEnter(labCommand)
      
      expect(mockSetSelectedIndex).toHaveBeenCalledWith(1)
    })
  })

  describe('Command Selection', () => {
    it('should highlight the selected command', () => {
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        selectedIndex: 1,
      })

      render(<CommandPalette />)
      
      const labCommand = screen.getByTestId('command-item-lab')
      expect(labCommand).toHaveClass('bg-primary/10', 'text-primary')
    })

    it('should show the Enter indicator on the selected command', () => {
      render(<CommandPalette />)
      
      const homeCommand = screen.getByTestId('command-item-home')
      expect(homeCommand).toHaveTextContent('↵')
    })

    it('should not show the Enter indicator on unselected commands', () => {
      render(<CommandPalette />)
      
      const labCommand = screen.getByTestId('command-item-lab')
      expect(labCommand).not.toHaveTextContent('↵')
    })

    it('should apply hover styles to unselected commands', () => {
      render(<CommandPalette />)
      
      const labCommand = screen.getByTestId('command-item-lab')
      expect(labCommand).toHaveClass('hover:bg-muted')
    })
  })

  describe('Footer and Keyboard Shortcuts', () => {
    it('should render all footer instructions', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('Navegar')).toBeInTheDocument()
      expect(screen.getByText('Ejecutar')).toBeInTheDocument()
      expect(screen.getByText('Abrir')).toBeInTheDocument()
    })

    it('should show the ESC key', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('ESC')).toBeInTheDocument()
    })

    it('should show the navigation keys', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('↓')).toBeInTheDocument()
    })

    it('should show K to open', () => {
      render(<CommandPalette />)
      
      expect(screen.getByText('K')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have an accessible label for the overlay', () => {
      render(<CommandPalette />)
      
      const overlay = screen.getByLabelText('Cerrar paleta de comandos')
      expect(overlay).toBeInTheDocument()
    })

    it('should autofocus the input when opened', () => {
      render(<CommandPalette />)
      
      const input = screen.getByTestId('command-palette-input')
      expect(input).toHaveFocus()
    })

    it('should allow keyboard navigation in the input', async () => {
      const user = userEvent.setup()
      render(<CommandPalette />)
      
      const input = screen.getByTestId('command-palette-input')
      await user.tab()
      
      // El input debería recibir focus
      expect(input).toBeInTheDocument()
    })
  })

  describe('Command Handling', () => {
    it('should handle commands with custom icons', () => {
      const customCommand: CommandItem = {
        id: 'custom',
        label: 'Custom',
        category: 'custom',
        icon: <div data-testid="custom-icon">Custom</div>,
        action: vi.fn(),
      }

      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        filteredCommands: [customCommand],
      })

      render(<CommandPalette />)
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('should handle multiple commands in the same category', () => {
      const duplicateCommands: CommandItem[] = [
        { ...mockCommands[0], id: 'home-1' },
        { ...mockCommands[0], id: 'home-2', label: 'Inicio 2' },
        { ...mockCommands[0], id: 'home-3', label: 'Inicio 3' },
      ]

      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        filteredCommands: duplicateCommands,
      })

      render(<CommandPalette />)
      
      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getByText('Inicio 2')).toBeInTheDocument()
      expect(screen.getByText('Inicio 3')).toBeInTheDocument()
    })

    it('should handle commands with very long labels', () => {
      const longLabelCommand: CommandItem = {
        id: 'long',
        label: 'Este es un comando con un label extremadamente largo que debería truncarse',
        description: 'Esta es una descripción también muy larga que debería truncarse correctamente',
        category: 'custom',
        icon: <span>📝</span>,
        action: vi.fn(),
      }

      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        filteredCommands: [longLabelCommand],
      })

      render(<CommandPalette />)
      
      const command = screen.getByTestId('command-item-long')
      expect(command).toBeInTheDocument()
    })

    it('should handle changes in the search value of the hook', () => {
      const { rerender } = render(<CommandPalette />)
      
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        search: 'test search',
      })

      rerender(<CommandPalette />)
      
      const input = screen.getByTestId('command-palette-input')
      expect(input).toHaveValue('test search')
    })

    it('should handle selectedIndex out of range', () => {
      vi.mocked(useCommandPalette).mockReturnValue({
        ...defaultMockValues,
        selectedIndex: 999,
      })

      render(<CommandPalette />)
      
      // No debería crashear
      expect(screen.getByTestId('command-palette')).toBeInTheDocument()
    })
  })

  describe('Integration with the hook', () => {
    it('should use all hook values correctly', () => {
      const customValues = {
        isOpen: true,
        search: 'custom search',
        selectedIndex: 2,
        filteredCommands: mockCommands,
        executeCommandByIndex: mockExecuteCommandByIndex,
        setOpen: mockSetOpen,
        setSearch: mockSetSearch,
        setSelectedIndex: mockSetSelectedIndex,
        commands: mockCommands,
        registerCommand: vi.fn(),
        unregisterCommand: vi.fn(),
        executeSelectedCommand: vi.fn(),
        resetState: vi.fn(),
      }

      vi.mocked(useCommandPalette).mockReturnValue(customValues)

      render(<CommandPalette />)
      
      const input = screen.getByTestId('command-palette-input')
      expect(input).toHaveValue('custom search')
      
      const settingsCommand = screen.getByTestId('command-item-settings')
      expect(settingsCommand).toHaveClass('bg-primary/10')
    })

    it('should call all hook functions when appropriate', async () => {
      const user = userEvent.setup()
      render(<CommandPalette />)

      const input = screen.getByTestId('command-palette-input')
      await user.type(input, 'a')
      expect(mockSetSearch).toHaveBeenCalled()
      
      const overlay = screen.getByTestId('command-palette-overlay')
      fireEvent.click(overlay)
      expect(mockSetOpen).toHaveBeenCalled()
      
      const command = screen.getByTestId('command-item-lab')
      fireEvent.mouseEnter(command)
      expect(mockSetSelectedIndex).toHaveBeenCalled()

      fireEvent.click(command)
      expect(mockExecuteCommandByIndex).toHaveBeenCalled()
    })
  })

  describe('CSS styles and classes', () => {
    it('should apply animation classes correctly', () => {
      render(<CommandPalette />)
      
      const palette = screen.getByTestId('command-palette')
      const overlay = screen.getByTestId('command-palette-overlay')
      
      expect(overlay).toHaveClass('animate-in', 'fade-in')
      expect(palette).toHaveClass('animate-in', 'fade-in', 'slide-in-from-top-4')
    })

    it('should apply backdrop-blur to the overlay and the palette', () => {
      render(<CommandPalette />)
      
      const overlay = screen.getByTestId('command-palette-overlay')
      const palette = screen.getByTestId('command-palette')
      
      expect(overlay).toHaveClass('backdrop-blur-sm')
      expect(palette.firstChild).toHaveClass('backdrop-blur-xl')
    })

    it('should have scroll on the command list', () => {
      render(<CommandPalette />)
      
      const commandList = screen.getByTestId('command-palette').querySelector('.max-h-\\[400px\\]')
      expect(commandList).toHaveClass('overflow-y-auto')
    })
  })
})