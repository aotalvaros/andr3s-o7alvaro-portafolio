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
import { ItemsMenu } from './items.components'

export function Navbar() {

  const { online } = useSocketContext();

  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const setLoading = useLoadingStore((state) => state.setLoading)
  const logoSrc = isDarkMode 
    ? "/assets/LogoAndresClaro.svg"
    : "/assets/LogoAndres.svg"

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
    <motion.header className="fixed top-0 left-0 w-full bg-background text-foreground shadow-md dark:shadow-white/10 z-90 dark:bg-gray-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4 dark:bg-gray-800">
        <Link href="/" className="relative w-[18%] h-[68px] min-w-[120px] max-w-[180px] flex items-center">
        <Image
          src={logoSrc}
          alt="Logo"
          width={155}
          height={90}
          className="object-cover w-[33dvw] min-w-[120px] md:w-[90%] select-none"
          loading="lazy"
        />
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
          <Link onClick={handleClickLink} href="/contact" className="hover:underline dark:text-secondary">Contacto</Link>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <button className="hover:underline dark:text-secondary">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <ItemsMenu handleClickLink={handleClickLink} />
            
          </DropdownMenu>

          <Link onClick={handleClickLink} href="/login" className="hover:underline">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} className='filter dark:invert' />
          </Link>
  
          <Button onClick={toggleTheme} variant="outline" className="bg-primary hover:bg-amber-700 dark:bg-primary cursor-pointer">
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </nav>

      {/* Menú móvil (visible solo cuando está abierto) */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4  dark:border-primary">
          <Link onClick={handleClickLink} href="/contact" className="hover:underline dark:text-secondary">Contacto</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:underline text-start dark:text-secondary">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-secondary dark:bg-blue-900">NASA → </DropdownMenuSubTrigger>
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

              <DropdownMenuItem asChild>
                <Link href="/lab/pokemon" className="w-full p-1"> 🐲 Pokédex </Link>
              </DropdownMenuItem>  
            </DropdownMenuContent>
          </DropdownMenu>
          <Link onClick={handleClickLink} href="/login" className="hover:underline">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} className='filter dark:invert'/>
          </Link>
        </div>
      )}
    </motion.header>
 )
}