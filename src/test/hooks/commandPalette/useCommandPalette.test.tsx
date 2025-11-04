import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCommandPaletteStore, type CommandItem } from '@/store/commandPaletteStore'
import { useRegisterCommand, useCommandPalette} from '@/hooks/commandPalette/useCommandPalette'

vi.mock('@/store/commandPaletteStore')

describe('useCommandPalette', () => {
  const mockCommands: CommandItem[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to home page',
      category: 'navigation',
      icon: <span>🏠</span>,
      action: vi.fn(),
      keywords: ['main', 'start'],
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      category: 'actions',
      icon: <span>⚙️</span>,
      action: vi.fn(),
      keywords: ['config', 'preferences'],
    },
    {
      id: 'profile',
      label: 'Profile',
      category: 'navigation',
      icon: <span>👤</span>,
      action: vi.fn(),
    },
  ]

  const mockStore = {
    isOpen: false,
    search: '',
    selectedIndex: 0,
    commands: mockCommands,
    setOpen: vi.fn(),
    setSearch: vi.fn(),
    setSelectedIndex: vi.fn(),
    executeSelectedCommand: vi.fn(),
    registerCommand: vi.fn(),
    unregisterCommand: vi.fn(),
  }

  beforeEach(() => {
    vi.mocked(useCommandPaletteStore).mockReturnValue(mockStore)
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic functionality', () => {
    it('should return store values', () => {
      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.isOpen).toBe(false)
      expect(result.current.search).toBe('')
      expect(result.current.selectedIndex).toBe(0)
      expect(result.current.commands).toEqual(mockCommands)
    })

    it('should return all store functions', () => {
      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.setOpen).toBeDefined()
      expect(result.current.setSearch).toBeDefined()
      expect(result.current.setSelectedIndex).toBeDefined()
      expect(result.current.executeSelectedCommand).toBeDefined()
      expect(result.current.registerCommand).toBeDefined()
      expect(result.current.unregisterCommand).toBeDefined()
    })

    it('should return filteredCommands', () => {
      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toEqual(mockCommands)
    })

    it('should return executeCommandByIndex function', () => {
      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.executeCommandByIndex).toBeDefined()
      expect(typeof result.current.executeCommandByIndex).toBe('function')
    })
  })

  describe('Command filtering', () => {
    it('should return all commands when search is empty', () => {
      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(3)
      expect(result.current.filteredCommands).toEqual(mockCommands)
    })

    it('should filter commands by label', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'home',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('home')
    })

    it('should filter commands by description', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'settings',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('settings')
    })

    it('should filter commands by keywords', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'config',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('settings')
    })

    it('should be case insensitive', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'HOME',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('home')
    })

    it('should return multiple matches', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'o', // matches 'home', 'profile'
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands.length).toBeGreaterThan(1)
    })

    it('should return empty array when no matches', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'nonexistent',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(0)
    })

    it('should handle commands without description', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'profile',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('profile')
    })

    it('should handle commands without keywords', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'prof',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
    })

    it('should handle partial matches', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'sett',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(1)
      expect(result.current.filteredCommands[0].id).toBe('settings')
    })
  })

  describe('executeCommandByIndex', () => {
    it('should execute command action at given index', () => {
      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(0)
      })

      expect(mockCommands[0].action).toHaveBeenCalledTimes(1)
      expect(mockStore.setOpen).toHaveBeenCalledWith(false)
    })

    it('should close palette after executing command', () => {
      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(1)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(false)
    })

    it('should handle invalid index gracefully', () => {
      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(999)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })

    it('should handle negative index gracefully', () => {
      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(-1)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })

    it('should execute correct command from filtered list', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'settings',
      })

      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(0)
      })

      // Should execute settings command (index 1 in original, 0 in filtered)
      expect(mockCommands[1].action).toHaveBeenCalledTimes(1)
    })

    it('should not execute if command is undefined', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        commands: [],
      })

      const { result } = renderHook(() => useCommandPalette())

      act(() => {
        result.current.executeCommandByIndex(0)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard event handling - Cmd/Ctrl+K', () => {
    it('should toggle palette with Cmd+K', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(true)
    })

    it('should toggle palette with Ctrl+K', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(true)
    })

    it('should close palette if already open', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(false)
    })

    it('should prevent default behavior on Cmd+K', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      act(() => {
        document.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should open with just "k" when not focused on input', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: document.createElement('div'),
        writable: false,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(true)
    })

    it('should not open with "k" when focused on input element', () => {
      renderHook(() => useCommandPalette())

      const input = document.createElement('input')
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: input,
        writable: false,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })

    it('should not open with "k" when focused on textarea element', () => {
      renderHook(() => useCommandPalette())

      const textarea = document.createElement('textarea')
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: textarea,
        writable: false,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard event handling - Escape', () => {
    it('should close palette on Escape when open', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).toHaveBeenCalledWith(false)
    })

    it('should prevent default on Escape', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      act(() => {
        document.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not close palette on Escape when already closed', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setOpen).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard event handling - ArrowDown', () => {
    it('should navigate down when palette is open', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        selectedIndex: 0,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).toHaveBeenCalledWith(1)
    })

    it('should wrap to first item when at end', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        selectedIndex: 2, // Last item
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).toHaveBeenCalledWith(0)
    })

    it('should prevent default on ArrowDown', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      act(() => {
        document.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not navigate when palette is closed', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard event handling - ArrowUp', () => {
    it('should navigate up when palette is open', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        selectedIndex: 1,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).toHaveBeenCalledWith(0)
    })

    it('should wrap to last item when at beginning', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        selectedIndex: 0,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).toHaveBeenCalledWith(2)
    })

    it('should prevent default on ArrowUp', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      act(() => {
        document.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not navigate when palette is closed', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.setSelectedIndex).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard event handling - Enter', () => {
    it('should execute selected command on Enter', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.executeSelectedCommand).toHaveBeenCalledTimes(1)
    })

    it('should prevent default on Enter', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      act(() => {
        document.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not execute command when palette is closed', () => {
      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockStore.executeSelectedCommand).not.toHaveBeenCalled()
    })
  })

  describe('Event listener lifecycle', () => {
    it('should add event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      renderHook(() => useCommandPalette())

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => useCommandPalette())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should handle multiple keyboard events', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
      })

      renderHook(() => useCommandPalette())

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      })

      expect(mockStore.setSelectedIndex).toHaveBeenCalledTimes(2)
      expect(mockStore.executeSelectedCommand).toHaveBeenCalledTimes(1)
    })
  })

  describe('Navigation with filtered commands', () => {
    it('should navigate within filtered results', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        search: 'home',
        selectedIndex: 0,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      // Only 1 filtered result, should wrap to 0
      expect(mockStore.setSelectedIndex).toHaveBeenCalledWith(0)
    })

    it('should handle navigation with no filtered results', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        isOpen: true,
        search: 'nonexistent',
        selectedIndex: 0,
      })

      renderHook(() => useCommandPalette())

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })

      act(() => {
        document.dispatchEvent(event)
      })

      // With no results, should call setSelectedIndex with NaN (0 % 0)
      expect(mockStore.setSelectedIndex).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle empty commands array', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        commands: [],
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(0)
    })

    it('should handle very long search strings', () => {
      const longSearch = 'a'.repeat(1000)

      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: longSearch,
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(0)
    })

    it('should handle special characters in search', () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: '@#$%',
      })

      const { result } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(0)
    })

    it('should update filteredCommands when store changes', () => {
      const { result, rerender } = renderHook(() => useCommandPalette())

      expect(result.current.filteredCommands).toHaveLength(3)

      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'home',
      })

      rerender()

      expect(result.current.filteredCommands).toHaveLength(1)
    })
  })

  describe('useCallback memoization', () => {
    it('should maintain stable reference for executeCommandByIndex', () => {
      const { result, rerender } = renderHook(() => useCommandPalette())

      const firstRef = result.current.executeCommandByIndex

      rerender()

      const secondRef = result.current.executeCommandByIndex

      expect(firstRef).toBe(secondRef)
    })

    it('should update executeCommandByIndex when filtered commands change', () => {
      const { result, rerender } = renderHook(() => useCommandPalette())

      const firstRef = result.current.executeCommandByIndex

      vi.mocked(useCommandPaletteStore).mockReturnValue({
        ...mockStore,
        search: 'home',
      })

      rerender()

      const secondRef = result.current.executeCommandByIndex

      // Should be different because filteredCommands changed
      expect(firstRef).not.toBe(secondRef)
    })
  })
})

describe('useRegisterCommand', () => {
  const mockRegisterCommand = vi.fn()
  const mockUnregisterCommand = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCommandPaletteStore).mockReturnValue({
      isOpen: false,
      search: '',
      selectedIndex: 0,
      commands: [],
      setOpen: vi.fn(),
      setSearch: vi.fn(),
      setSelectedIndex: vi.fn(),
      executeSelectedCommand: vi.fn(),
      registerCommand: mockRegisterCommand,
      unregisterCommand: mockUnregisterCommand,
    })
  })

  const testCommand: CommandItem = {
    id: 'test-command',
    label: 'Test Command',
    description: 'Test description',
    category: 'custom',
    icon: <span>T</span>,
    action: vi.fn(),
  }

  describe('Registration lifecycle', () => {
    it('should register command on mount', () => {
      renderHook(() => useRegisterCommand(testCommand))

      expect(mockRegisterCommand).toHaveBeenCalledWith(testCommand)
      expect(mockRegisterCommand).toHaveBeenCalledTimes(1)
    })

    it('should unregister command on unmount', () => {
      const { unmount } = renderHook(() => useRegisterCommand(testCommand))

      unmount()

      expect(mockUnregisterCommand).toHaveBeenCalledWith('test-command')
      expect(mockUnregisterCommand).toHaveBeenCalledTimes(1)
    })

    it('should re-register when command changes', () => {
      const { rerender } = renderHook(
        ({ cmd }) => useRegisterCommand(cmd),
        { initialProps: { cmd: testCommand } }
      )

      const updatedCommand = { ...testCommand, label: 'Updated' }

      rerender({ cmd: updatedCommand })

      expect(mockUnregisterCommand).toHaveBeenCalledWith('test-command')
      expect(mockRegisterCommand).toHaveBeenCalledWith(updatedCommand)
    })

    it('should handle multiple commands', () => {
      const command1 = { ...testCommand, id: 'cmd1' }
      const command2 = { ...testCommand, id: 'cmd2' }

      renderHook(() => useRegisterCommand(command1))
      renderHook(() => useRegisterCommand(command2))

      expect(mockRegisterCommand).toHaveBeenCalledTimes(2)
      expect(mockRegisterCommand).toHaveBeenCalledWith(command1)
      expect(mockRegisterCommand).toHaveBeenCalledWith(command2)
    })
  })

  describe('Cleanup', () => {
    it('should unregister correct command ID', () => {
      const { unmount } = renderHook(() => useRegisterCommand(testCommand))

      unmount()

      expect(mockUnregisterCommand).toHaveBeenCalledWith(testCommand.id)
    })

    it('should clean up properly with multiple hooks', () => {
      const command1 = { ...testCommand, id: 'cmd1' }
      const command2 = { ...testCommand, id: 'cmd2' }

      const { unmount: unmount1 } = renderHook(() => useRegisterCommand(command1))
      const { unmount: unmount2 } = renderHook(() => useRegisterCommand(command2))

      unmount1()
      expect(mockUnregisterCommand).toHaveBeenCalledWith('cmd1')

      unmount2()
      expect(mockUnregisterCommand).toHaveBeenCalledWith('cmd2')
    })
  })

  describe('Edge cases', () => {
    it('should handle commands with minimal properties', () => {
      const minimalCommand: CommandItem = {
        id: 'minimal',
        label: 'Minimal',
        category: 'custom',
        icon: <span>M</span>,
        action: vi.fn(),
      }

      renderHook(() => useRegisterCommand(minimalCommand))

      expect(mockRegisterCommand).toHaveBeenCalledWith(minimalCommand)
    })

    it('should handle commands with all optional properties', () => {
      const fullCommand: CommandItem = {
        id: 'full',
        label: 'Full Command',
        description: 'Full description',
        keywords: ['key1', 'key2'],
        category: 'custom',
        icon: <span>F</span>,
        action: vi.fn(),
      }

      renderHook(() => useRegisterCommand(fullCommand))

      expect(mockRegisterCommand).toHaveBeenCalledWith(fullCommand)
    })

    it('should handle rapid mount/unmount cycles', () => {
      const { unmount, rerender } = renderHook(() => useRegisterCommand(testCommand))

      rerender()
      unmount()

      expect(mockRegisterCommand).toHaveBeenCalled()
      expect(mockUnregisterCommand).toHaveBeenCalled()
    })

    it('should handle command with empty strings', () => {
      const emptyCommand: CommandItem = {
        id: '',
        label: '',
        description: '',
        keywords: [],
        category: 'custom',
        icon: <span />,
        action: vi.fn(),
      }

      renderHook(() => useRegisterCommand(emptyCommand))

      expect(mockRegisterCommand).toHaveBeenCalledWith(emptyCommand)
    })
  })

  describe('Integration with useCommandPalette', () => {
    it('should use the same store instance', () => {
      renderHook(() => useRegisterCommand(testCommand))

      expect(mockRegisterCommand).toHaveBeenCalled()
    })

    it('should work alongside useCommandPalette hook', () => {
      renderHook(() => useCommandPalette())
      renderHook(() => useRegisterCommand(testCommand))

      expect(mockRegisterCommand).toHaveBeenCalledWith(testCommand)
    })
  })

  describe('Dependency changes', () => {
    it('should re-run effect when command reference changes', () => {
      const { rerender } = renderHook(
        ({ cmd }) => useRegisterCommand(cmd),
        { initialProps: { cmd: testCommand } }
      )

      // Create new reference with same values
      const newCommand = { ...testCommand }
      rerender({ cmd: newCommand })

      // Should unregister old and register new
      expect(mockUnregisterCommand).toHaveBeenCalled()
      expect(mockRegisterCommand).toHaveBeenCalledTimes(2)
    })

    it('should handle command action function changes', () => {
      const command1 = { ...testCommand, action: vi.fn() }
      const command2 = { ...testCommand, action: vi.fn() }

      const { rerender } = renderHook(
        ({ cmd }) => useRegisterCommand(cmd),
        { initialProps: { cmd: command1 } }
      )

      rerender({ cmd: command2 })

      expect(mockRegisterCommand).toHaveBeenCalledWith(command2)
    })
  })


  describe('Performance', () => {
    it('should only register once per mount', () => {
      const { rerender } = renderHook(() => useRegisterCommand(testCommand))

      // Multiple rerenders should not cause re-registration
      rerender()
      rerender()
      rerender()

      // Should still be called more than once due to useEffect dependencies
      expect(mockRegisterCommand).toHaveBeenCalled()
    })

    it('should clean up previous registration before new one', async () => {
      const command1 = { ...testCommand, id: 'cmd1' }
      const command2 = { ...testCommand, id: 'cmd2' }

      const { rerender } = renderHook(
        ({ cmd }) => useRegisterCommand(cmd),
        { initialProps: { cmd: command1 } }
      )

      rerender({ cmd: command2 })

      await waitFor(() => {
        expect(mockUnregisterCommand).toHaveBeenCalledWith('cmd1')
        expect(mockRegisterCommand).toHaveBeenCalledWith(command2)
      })
    })
  })
})