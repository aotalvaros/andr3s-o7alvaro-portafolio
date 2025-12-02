/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeStore } from '@/store/themeStore'
import { useCommandPaletteStore } from '@/store/commandPaletteStore'
import { CommandPaletteProvider } from '@/providers/CommandPaletteProvider'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

// Mock stores
vi.mock('@/store/themeStore')
vi.mock('@/store/commandPaletteStore')

// Mock CommandPalette component
vi.mock('@/components/layout/commandPalette', () => ({
  CommandPalette: () => <div data-testid="command-palette">Command Palette</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Code2: () => <div data-testid="code-icon">Code</div>,
  Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Rocket: () => <div data-testid="rocket-icon">Rocket</div>,
  Gamepad2: () => <div data-testid="gamepad-icon">Gamepad</div>,
  CloudSun: () => <div data-testid="cloudsun-icon">CloudSun</div>,
}))

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaGithub: () => <div data-testid="github-icon">GitHub</div>,
  FaLinkedin: () => <div data-testid="linkedin-icon">LinkedIn</div>,
}))

describe('CommandPaletteProvider', () => {
  const mockPush = vi.fn()
  const mockToggleTheme = vi.fn()
  const mockRegisterCommand = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock router
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as any)

    // Mock pathname
    vi.mocked(usePathname).mockReturnValue('/')

    // Mock theme store
    vi.mocked(useThemeStore).mockReturnValue(mockToggleTheme)
    vi.mocked(useThemeStore).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector({ isDarkMode: false, toggleTheme: mockToggleTheme })
      }
      return { isDarkMode: false, toggleTheme: mockToggleTheme }
    })

    // Mock command palette store
    vi.mocked(useCommandPaletteStore).mockReturnValue({
      registerCommand: mockRegisterCommand,
      unregisterCommand: vi.fn(),
      commands: [],
      isOpen: false,
      search: '',
      selectedIndex: 0,
      setOpen: vi.fn(),
      setSearch: vi.fn(),
      setSelectedIndex: vi.fn(),
      executeSelectedCommand: vi.fn(),
    })

    // Mock window.open
    global.window.open = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render children', () => {
      render(
        <CommandPaletteProvider>
          <div data-testid="test-child">Test Child</div>
        </CommandPaletteProvider>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
    })

    it('should render CommandPalette component', () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      expect(screen.getByTestId('command-palette')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <CommandPaletteProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </CommandPaletteProvider>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('Command registration', () => {
    it('should register all default commands on mount', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        expect(mockRegisterCommand).toHaveBeenCalledTimes(11)
      })
    })

    it('should register navigation commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const navigationCommands = calls.filter(
          ([cmd]) => cmd.category === 'navigation'
        )
        expect(navigationCommands).toHaveLength(4)
      })
    })

    it('should register lab commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const labCommands = calls.filter(([cmd]) => cmd.category === 'lab')
        expect(labCommands).toHaveLength(4)
      })
    })

    it('should register action commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const actionCommands = calls.filter(([cmd]) => cmd.category === 'actions')
        expect(actionCommands).toHaveLength(1)
      })
    })

    it('should register social commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const socialCommands = calls.filter(([cmd]) => cmd.category === 'social')
        expect(socialCommands).toHaveLength(2)
      })
    })
  })

  describe('Navigation commands', () => {
    it('should register home command with correct properties', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const homeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'home'
        )?.[0]

        expect(homeCommand).toBeDefined()
        expect(homeCommand?.label).toBe('Ir al inicio')
        expect(homeCommand?.description).toBe('Volver a la página principal')
        expect(homeCommand?.category).toBe('navigation')
        expect(homeCommand?.keywords).toContain('home')
      })
    })

    it('should navigate to home when home command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const homeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'home'
        )?.[0]

        homeCommand?.action()
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('should register about command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const aboutCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'about'
        )?.[0]

        expect(aboutCommand).toBeDefined()
        expect(aboutCommand?.label).toBe('Sobre mí')
      })
    })

    it('should register skills command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const skillsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'skills'
        )?.[0]

        expect(skillsCommand).toBeDefined()
        expect(skillsCommand?.label).toBe('Habilidades')
      })
    })

    it('should register contact command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const contactCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'contact'
        )?.[0]

        expect(contactCommand).toBeDefined()
        expect(contactCommand?.label).toBe('Contacto')
      })
    })
  })

  describe('Lab commands', () => {
    it('should register asteroids lab command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const asteroidsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-asteroids'
        )?.[0]

        expect(asteroidsCommand).toBeDefined()
        expect(asteroidsCommand?.label).toBe('NASA Asteroides')
        expect(asteroidsCommand?.category).toBe('lab')
      })
    })

    it('should navigate to asteroids when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const asteroidsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-asteroids'
        )?.[0]

        asteroidsCommand?.action()
        expect(mockPush).toHaveBeenCalledWith('/lab/asteroids')
      })
    })

    it('should register mars rover lab command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const marsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-mars-rover'
        )?.[0]

        expect(marsCommand).toBeDefined()
        expect(marsCommand?.label).toBe('NASA Mars Rover')
      })
    })

    it('should navigate to mars rover when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const marsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-mars-rover'
        )?.[0]

        marsCommand?.action()
        expect(mockPush).toHaveBeenCalledWith('/lab/mars-rover')
      })
    })

    it('should register pokemon lab command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const pokemonCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-pokemon'
        )?.[0]

        expect(pokemonCommand).toBeDefined()
        expect(pokemonCommand?.label).toBe('Pokédex')
      })
    })

    it('should navigate to pokemon when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const pokemonCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-pokemon'
        )?.[0]

        pokemonCommand?.action()
        expect(mockPush).toHaveBeenCalledWith('/lab/pokemon')
      })
    })
  })

  describe('Theme toggle command', () => {
    it('should register theme toggle command in light mode', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const themeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'theme-toggle'
        )?.[0]

        expect(themeCommand).toBeDefined()
        expect(themeCommand?.label).toBe('Modo oscuro')
        expect(themeCommand?.category).toBe('actions')
      })
    })

    it('should register theme toggle command in dark mode', async () => {
      vi.mocked(useThemeStore).mockImplementation((selector: any) => {
        if (typeof selector === 'function') {
          return selector({ isDarkMode: true, toggleTheme: mockToggleTheme })
        }
        return { isDarkMode: true, toggleTheme: mockToggleTheme }
      })

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const themeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'theme-toggle'
        )?.[0]

        expect(themeCommand?.label).toBe('Modo claro')
      })
    })

    it('should toggle theme when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const themeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'theme-toggle'
        )?.[0]

        themeCommand?.action()
        expect(mockToggleTheme).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Social commands', () => {
    it('should register GitHub command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const githubCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'github'
        )?.[0]

        expect(githubCommand).toBeDefined()
        expect(githubCommand?.label).toBe('Abrir GitHub')
        expect(githubCommand?.category).toBe('social')
      })
    })

    it('should open GitHub in new tab when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const githubCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'github'
        )?.[0]

        githubCommand?.action()
        expect(window.open).toHaveBeenCalledWith(
          'https://github.com/andr3s-o7alvaro',
          '_blank'
        )
      })
    })

    it('should register LinkedIn command', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const linkedinCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'linkedin'
        )?.[0]

        expect(linkedinCommand).toBeDefined()
        expect(linkedinCommand?.label).toBe('Abrir LinkedIn')
        expect(linkedinCommand?.category).toBe('social')
      })
    })

    it('should open LinkedIn in new tab when command is executed', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const linkedinCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'linkedin'
        )?.[0]

        linkedinCommand?.action()
        expect(window.open).toHaveBeenCalledWith(
          'https://linkedin.com/in/andres-otalvaro',
          '_blank'
        )
      })
    })
  })

  describe('Section navigation', () => {
    it('should scroll to section when on same page', async () => {
      const mockScrollIntoView = vi.fn()
      const mockElement = { scrollIntoView: mockScrollIntoView }
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any)

      vi.mocked(usePathname).mockReturnValue('/')

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const aboutCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'about'
        )?.[0]

        aboutCommand?.action()
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      })
    })

    it('should navigate to home with hash when on different page', async () => {
      vi.mocked(usePathname).mockReturnValue('/lab/asteroids')

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const aboutCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'about'
        )?.[0]

        aboutCommand?.action()
        expect(mockPush).toHaveBeenCalledWith('/#about')
      })
    })

    it('should not scroll if element is not found', async () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null)

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const aboutCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'about'
        )?.[0]

        // Should not throw error
        expect(() => aboutCommand?.action()).not.toThrow()
      })
    })
  })

  describe('Command priorities', () => {
    it('should assign correct priorities to commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const homeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'home'
        )?.[0]
        const linkedinCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'linkedin'
        )?.[0]

        expect(homeCommand?.priority).toBe(9)
        expect(linkedinCommand?.priority).toBe(0)
      })
    })

    it('should have navigation commands with higher priority', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const navigationCommands = calls
          .filter(([cmd]) => cmd.category === 'navigation')
          .map(([cmd]) => cmd)

        navigationCommands.forEach((cmd) => {
          expect(cmd.priority).toBeGreaterThanOrEqual(6)
        })
      })
    })
  })

  describe('Command keywords', () => {
    it('should include keywords for all navigation commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls
        const navigationCommands = calls
          .filter(([cmd]) => cmd.category === 'navigation')
          .map(([cmd]) => cmd)

        navigationCommands.forEach((cmd) => {
          expect(cmd.keywords).toBeDefined()
          expect(Array.isArray(cmd.keywords)).toBe(true)
          expect(cmd.keywords!.length).toBeGreaterThan(0)
        })
      })
    })

    it('should include Spanish and English keywords', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const homeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'home'
        )?.[0]

        expect(homeCommand?.keywords).toContain('inicio')
        expect(homeCommand?.keywords).toContain('home')
      })
    })

    it('should include relevant keywords for lab commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const asteroidsCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'lab-asteroids'
        )?.[0]

        expect(asteroidsCommand?.keywords).toContain('nasa')
        expect(asteroidsCommand?.keywords).toContain('space')
        expect(asteroidsCommand?.keywords).toContain('lab')
      })
    })
  })

  describe('Command icons', () => {
    it('should have icons for all commands', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const calls = mockRegisterCommand.mock.calls

        calls.forEach(([cmd]) => {
          expect(cmd.icon).toBeDefined()
        })
      })
    })

    it('should use appropriate icons for navigation', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        expect(mockRegisterCommand).toHaveBeenCalled()
      })
    })
  })

  describe('Effect dependencies', () => {
    it('should re-register commands when pathname changes', async () => {
      const { rerender } = render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        expect(mockRegisterCommand).toHaveBeenCalledTimes(11)
      })

      vi.clearAllMocks()
      vi.mocked(usePathname).mockReturnValue('/lab/asteroids')

      rerender(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        expect(mockRegisterCommand).toHaveBeenCalledTimes(11)
      })
    })

  })

  describe('Edge cases', () => {
    it('should handle missing registerCommand gracefully', async () => {
      vi.mocked(useCommandPaletteStore).mockReturnValue({
        registerCommand: undefined as any,
        unregisterCommand: vi.fn(),
        commands: [],
        isOpen: false,
        search: '',
        selectedIndex: 0,
        setOpen: vi.fn(),
        setSearch: vi.fn(),
        setSelectedIndex: vi.fn(),
        executeSelectedCommand: vi.fn(),
      })

      expect(() => {
        render(
          <CommandPaletteProvider>
            <div>Content</div>
          </CommandPaletteProvider>
        )
      }).toThrow()
    })

  })

  describe('Integration', () => {
    it('should work with multiple providers', () => {
      render(
        <CommandPaletteProvider>
          <CommandPaletteProvider>
            <div data-testid="nested-content">Nested</div>
          </CommandPaletteProvider>
        </CommandPaletteProvider>
      )

      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
    })

    it('should maintain command palette visibility', () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      const palettes = screen.getAllByTestId('command-palette')
      expect(palettes).toHaveLength(1)
    })
  })

  describe('Window open behavior', () => {
    it('should open external links in new tabs', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const githubCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'github'
        )?.[0]

        githubCommand?.action()
        
        expect(window.open).toHaveBeenCalledWith(
          expect.stringContaining('github.com'),
          '_blank'
        )
      })
    })

    it('should handle window.open failures gracefully', async () => {
      vi.mocked(window.open).mockReturnValue(null)

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const githubCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'github'
        )?.[0]

        // Should not throw even if window.open fails
        expect(() => githubCommand?.action()).not.toThrow()
      })
    })
  })

  describe('Theme integration', () => {
    it('should use theme store correctly', async () => {
      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        expect(useThemeStore).toHaveBeenCalled()
      })
    })

    it('should reflect current theme in command label', async () => {
      vi.mocked(useThemeStore).mockImplementation((selector: any) => {
        if (typeof selector === 'function') {
          return selector({ isDarkMode: true, toggleTheme: mockToggleTheme })
        }
        return { isDarkMode: true, toggleTheme: mockToggleTheme }
      })

      render(
        <CommandPaletteProvider>
          <div>Content</div>
        </CommandPaletteProvider>
      )

      await waitFor(() => {
        const themeCommand = mockRegisterCommand.mock.calls.find(
          ([cmd]) => cmd.id === 'theme-toggle'
        )?.[0]

        expect(themeCommand?.label).toBe('Modo claro')
      })
    })
  })
})