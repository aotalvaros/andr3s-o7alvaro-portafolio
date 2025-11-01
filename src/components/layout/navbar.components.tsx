'use client'

import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuItem, } from '@radix-ui/react-dropdown-menu'
import { useLoadingStore } from '@/store/loadingStore'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Router } from 'next/router'
import { useSocketContext } from '@/context/SocketContext'
import Image from 'next/image'
import { ItemsMenu } from './items.components'
import { OnlineStatus } from '../ui/OnlineStatus'
import { usePathname } from "next/navigation"

export function Navbar() {

  const { online } = useSocketContext();

  const pathname = usePathname()
  const isHome = pathname === "/"

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

   const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (isHome) {
      e.preventDefault()
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 glass text-foreground shadow-md dark:shadow-white/10 ">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4 ">
        <Link href="/" className="relative w-[18%] h-[68px] min-w-[120px] max-w-[180px] flex items-center" data-testid="logo-link">
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
              ? <OnlineStatus text=" Online" backgroundColor="bg-green-500" textColor="text-green-500" />
              : <OnlineStatus text=" Offline" backgroundColor="bg-red-500" textColor="text-red-500" />
          }
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="hidden md:flex items-center gap-6">
          <Link 
            onClick={handleContactClick} 
            href="/#contact" className="hover:underline dark:text-secondary" data-testid="contact-link">Contacto</Link>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <button className="hover:underline dark:text-secondary" data-testid="api-lab-dropdown">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <ItemsMenu handleClickLink={handleClickLink}  data-testid="api-lab-items-menu" />
            
          </DropdownMenu>

          <Link onClick={handleClickLink} href="/login" className="hover:underline" data-testid="login-link">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} className='filter dark:invert' 
              loading="lazy"
            />
          </Link>
  
          <Button onClick={toggleTheme} variant="outline" 
            className="rounded-full transition-all duration-300 hover:scale-110 bg-transparent" 
            data-testid="theme-toggle-button">
            {isDarkMode ? <Sun className="h-5 w-5" data-testid="sun-icon" /> : <Moon className="h-5 w-5" data-testid="moon-icon" />}
          </Button>
        </div>
      </nav>

      {/* Menú móvil (visible solo cuando está abierto) */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4  dark:border-primary" data-testid="mobile-menu" >
          <Link  onClick={handleContactClick} href="/#contact" className="hover:underline dark:text-secondary" data-testid="contact-link">Contacto</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:underline text-start dark:text-secondary" data-testid="api-lab-dropdown">Laboratorio de APIs ▼</button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className=" z-15 w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-secondary dark:bg-blue-900">NASA → </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="flex flex-col z-[90] left-3 p-1  w-max shadow-lg rounded-[10px] shadow-blue-900 bg-white dark:bg-secondary  dark:shadow-white/10">
                    <DropdownMenuItem asChild>
                      <Link href="/lab/asteroids" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full p-1 bg-white left-1 dark:bg-blue-900 rounded-[8px_8px_0_0]" data-testid="api-lab-asteroids-link">🌌 Asteroides</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/lab/mars-rover" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full p-1 bg-white left-1 dark:bg-blue-900 rounded-[0_0_8px_8px]" data-testid="api-lab-mars-rover-link">🚀 Mars Rover</Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem asChild>
                <Link href="/lab/pokemon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full p-1" data-testid="api-lab-pokemon-link"> 🐲 Pokédex </Link>
              </DropdownMenuItem>  
            </DropdownMenuContent>
          </DropdownMenu>
          <Link onClick={handleClickLink} href="/login" className="hover:underline" data-testid="login-link">
            <Image src="/assets/settings_24dp.svg" alt="Iniciar sesión" width={24} height={24} className='filter dark:invert' loading="lazy"/>
          </Link>
        </div>
      )}
    </motion.header>
 )
}