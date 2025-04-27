'use client'

import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useScrollDirection } from '@/hooks/useScrollDirection'

export function Navbar() {
    const isDarkMode = useThemeStore((state) => state.isDarkMode)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)
    
    const visible = useScrollDirection()
  
    return (
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-full bg-background text-foreground shadow-md dark:shadow-white/10 z-50"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary dark:text-light">
            Andrés o7alvaro Dev
          </Link>
  
          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="#proyectos" className="hover:underline">
              Proyectos
            </Link>
            <Link href="#sobre-mi" className="hover:underline">
              Sobre mí
            </Link>
            <Link href="#contacto" className="hover:underline">
              Contacto
            </Link>
  
            {/* Toggle Tema */}
            <Button onClick={toggleTheme} variant="outline" className="bg-blue-900 hover:bg-amber-500 dark:bg-white ">
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </nav>
      </motion.header>
    )
  }