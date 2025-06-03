'use client'

import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuItem, } from '@radix-ui/react-dropdown-menu'
import { useLoadingStore } from '@/store/loadingStore'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Router } from 'next/router'
import { useSocketContext } from '@/context/SocketContext'
import Image from 'next/image'

export function Navbar() {

  const { online } = useSocketContext();

  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const setLoading = useLoadingStore((state) => state.setLoading)

   useEffect(() => {
    const handleStart   = () => setLoading(true)
    const handleFinish  = () => setLoading(false)

    Router.events.on('routeChangeStart',  handleStart)
    Router.events.on('routeChangeComplete', handleFinish)
    Router.events.on('routeChangeError', handleFinish)

    return () => {                          
      Router.events.off('routeChangeStart',  handleStart)
      Router.events.off('routeChangeComplete', handleFinish)
      Router.events.off('routeChangeError', handleFinish)
    }
  }, [setLoading])

    const handleClickLink = () =>  setLoading(true)

  return (
    <motion.header className="w-full bg-background text-foreground shadow-md dark:shadow-white/10 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-primary dark:text-light">
          Andrés otalvaro dev
        </Link>

        <div className="alert">
          {
            online
              ? <span className="text-green-500"> Online</span>
              : <span className="text-red-500"> Offline</span>
          }
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="hidden md:flex items-center gap-6">
          <Link onClick={handleClickLink} href="/contact" className="hover:underline">Contacto</Link>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <button className="hover:underline">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-light dark:bg-blue-900">NASA - </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                  <DropdownMenuSubContent className='flex flex-col z-[90] left-3 p-1 w-max shadow-lg rounded-[10px] shadow-blue-900 bg-white dark:shadow-white/10'>
                     <DropdownMenuItem asChild>
                      <Link href="/lab/asteroids" onClick={handleClickLink} className="w-full p-1">
                        🌌 Asteroides
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/lab/mars-rover" onClick={handleClickLink} className="w-full p-1">
                        🚀 Mars Rover
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
            </DropdownMenuContent>
          </DropdownMenu>

          <Link onClick={handleClickLink} href="/login" className="hover:underline">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} />
          </Link>
  
          <Button onClick={toggleTheme} variant="outline" className="bg-blue-900 hover:bg-amber-500 dark:bg-white cursor-pointer">
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </nav>

      {/* Menú móvil (visible solo cuando está abierto) */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          <Link onClick={handleClickLink} href="/contact" className="hover:underline">Contacto</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:underline text-start">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-light dark:bg-blue-900">NASA - </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                  <DropdownMenuSubContent className="flex flex-col z-[90] left-3 p-1 w-max shadow-lg rounded-[10px] shadow-blue-900 bg-white dark:shadow-white/10">
                    <DropdownMenuItem asChild>
                      <Link href="/lab/asteroids" className="w-full p-1 bg-white left-1 dark:bg-blue-900" >🌌 Asteroides</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/lab/mars-rover" className="w-full p-1 bg-white left-1 dark:bg-blue-900">🚀 Mars Rover</Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>  
            </DropdownMenuContent>
          </DropdownMenu>
          <Link onClick={handleClickLink} href="/login" className="hover:underline">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} />
          </Link>
           <Button onClick={toggleTheme} variant="outline" className="bg-blue-900 hover:bg-amber-500 dark:bg-white cursor-pointer">
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      )}
    </motion.header>
 )
}