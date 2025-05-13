'use client'

import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useLoadingStore } from '@/store/loadingStore'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const setLoading = useLoadingStore((state) => state.setLoading)

  const handleClickLink = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000) 
  }

  return (
    <motion.header className="w-full bg-background text-foreground shadow-md dark:shadow-white/10 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary dark:text-light">
          Andrés otalvaro dev
        </Link>

        {/* Botón hamburguesa solo visible en mobile */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links (ocultos en mobile, visibles en md+) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Aquí luego vamos a mover el Dropdown */}
          <Link onClick={handleClickLink} href="/skills" className="hover:underline">Skills</Link>
          <Link onClick={handleClickLink} href="/sobre-mi" className="hover:underline">Sobre mí</Link>
          <Link onClick={handleClickLink} href="/contact" className="hover:underline">Contacto</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:underline">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-light dark:bg-blue-900">NASA - </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                  <DropdownMenuSubContent className='z-[90] left-3 p-1 w-max shadow-lg rounded-[10px] shadow-blue-900 dark:shadow-white/10'>
                    <Link href="/lab" className="w-full p-1 bg-white left-1 dark:bg-blue-900"  onClick={handleClickLink}>🌌 Asteroides</Link>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
            </DropdownMenuContent>
          </DropdownMenu>
  
          <Button onClick={toggleTheme} variant="outline" className="bg-blue-900 hover:bg-amber-500 dark:bg-white cursor-pointer">
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </nav>

      {/* Menú móvil (visible solo cuando está abierto) */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          <Link onClick={handleClickLink} href="/skills" className="hover:underline">Skills</Link>
          <Link onClick={handleClickLink} href="/sobre-mi" className="hover:underline">Sobre mí</Link>
          <Link onClick={handleClickLink} href="/contact" className="hover:underline">Contacto</Link>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:underline text-start">Laboratorio de APIs ▼</button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-light dark:bg-blue-900">NASA - </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent className='z-[90] left-3 p-1 w-max shadow-lg rounded-[10px] shadow-blue-900 dark:shadow-white/10'>
                  <Link href="/lab" className="w-full p-1 bg-white left-1 dark:bg-blue-900"  onClick={handleClickLink}>🌌 Asteroides</Link>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.header>
  )
}