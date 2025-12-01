'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeStore } from '@/store/themeStore'
import { 
  Home, User, Code2, Mail, Moon, Sun, 
  Rocket, Gamepad2 
} from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useCommandPaletteStore } from '@/store/commandPaletteStore'
import { CommandPalette } from '@/components/layout/commandPalette'


export function CommandPaletteProvider({ children }: { readonly children: React.ReactNode }) {
  const { registerCommand } = useCommandPaletteStore()
  const router = useRouter()
  const pathname = usePathname()
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const navigateToSection = useCallback((sectionId: string, path = '/') => {
    if (pathname === path) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(`${path}#${sectionId}`)
    }
  }, [pathname, router])

  useEffect(() => {
    // Register default commands
    const defaultCommands = [
      {
        id: 'home',
        label: 'Ir al inicio',
        description: 'Volver a la página principal',
        icon: <Home className="h-4 w-4" />,
        action: () => router.push('/'),
        keywords: ['inicio', 'home', 'principal'],
        category: 'navigation' as const,
        priority: 9,
      },
      {
        id: 'about',
        label: 'Sobre mí',
        description: 'Ver información personal',
        icon: <User className="h-4 w-4" />,
        action: () => navigateToSection('about'),
        keywords: ['sobre', 'about', 'bio', 'información'],
        category: 'navigation' as const,
        priority: 8,
      },
      {
        id: 'skills',
        label: 'Habilidades',
        description: 'Ver mis habilidades técnicas',
        icon: <Code2 className="h-4 w-4" />,
        action: () => navigateToSection('skills'),
        keywords: ['habilidades', 'skills', 'tecnologías', 'tech'],
        category: 'navigation' as const,
        priority: 7,
      },
      {
        id: 'contact',
        label: 'Contacto',
        description: 'Enviar un mensaje',
        icon: <Mail className="h-4 w-4" />,
        action: () => navigateToSection('contact'),
        keywords: ['contacto', 'contact', 'mensaje', 'email'],
        category: 'navigation' as const,
        priority: 6,
      },
      {
        id: 'lab-asteroids',
        label: 'NASA Asteroides',
        description: 'Explorar asteroides cercanos a la Tierra',
        icon: <Rocket className="h-4 w-4" />,
        action: () => router.push('/lab/asteroids'),
        keywords: ['nasa', 'asteroides', 'espacio', 'space', 'lab', 'laboratorio'],
        category: 'lab' as const,
        priority: 5,
      },
      {
        id: 'lab-mars-rover',
        label: 'NASA Mars Rover',
        description: 'Ver imágenes del rover de Marte',
        icon: <Rocket className="h-4 w-4" />,
        action: () => router.push('/lab/mars-rover'),
        keywords: ['nasa', 'mars', 'marte', 'rover', 'espacio', 'lab'],
        category: 'lab' as const,
        priority: 4,
      },
      {
        id: 'lab-pokemon',
        label: 'Pokédex',
        description: 'Explorar el Pokédex',
        icon: <Gamepad2 className="h-4 w-4" />,
        action: () => router.push('/lab/pokemon'),
        keywords: ['pokemon', 'pokédex', 'pokedex', 'lab', 'laboratorio'],
        category: 'lab' as const,
        priority: 3,
      },
      {
        id: 'theme-toggle',
        label: isDarkMode ? 'Modo claro' : 'Modo oscuro',
        description: 'Cambiar el tema de la página',
        icon: isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        action: () => toggleTheme(),
        keywords: ['tema', 'theme', 'dark', 'light', 'oscuro', 'claro'],
        category: 'actions' as const,
        priority: 2,
      },
      {
        id: 'github',
        label: 'Abrir GitHub',
        description: 'Ver mi perfil de GitHub',
        icon: <FaGithub className="h-4 w-4" />,
        action: () => {
          window.open('https://github.com/andr3s-o7alvaro', '_blank')
        },
        keywords: ['github', 'código', 'code', 'repositorio'],
        category: 'social' as const,
        priority: 1,
      },
      {
        id: 'linkedin',
        label: 'Abrir LinkedIn',
        description: 'Ver mi perfil profesional',
        icon: <FaLinkedin className="h-4 w-4" />,
        action: () => {
          window.open('https://linkedin.com/in/andres-otalvaro', '_blank')
        },
        keywords: ['linkedin', 'perfil', 'profesional', 'trabajo'],
        category: 'social' as const,
        priority: 0,
      },
    ]

    defaultCommands.forEach(registerCommand)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerCommand, router, pathname, navigateToSection])

  return (
    <>
      {children}
      <CommandPalette />
    </>
  )
}