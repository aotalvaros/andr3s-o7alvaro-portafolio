import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Router } from 'next/router'
import { useLoadingStore } from '@/store/loadingStore'
import { useThemeStore } from '@/store/themeStore'
import { useSocketContext } from '@/context/SocketContext'

export const useNavbar = () => {
  const { online } = useSocketContext()
  const pathname = usePathname()
  const isHome = pathname === "/"
  
  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setLoading = useLoadingStore((state) => state.setLoading)
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Logo source based on theme
  const logoSrc = isDarkMode 
    ? "/assets/LogoAndresClaro.svg"
    : "/assets/LogoAndres.svg"

  // Router event handlers
  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleFinish = () => setLoading(false)

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleFinish)
    Router.events.on('routeChangeError', handleFinish)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleFinish)
      Router.events.off('routeChangeError', handleFinish)
    }
  }, [setLoading])

  // Handlers
  const handleClickLink = useCallback(() => {
    setLoading(true)
    setMobileMenuOpen(false) // Close mobile menu on navigation
  }, [setLoading])

  const handleContactClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false)
    if (isHome) {
      e.preventDefault()
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [isHome])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return {
    // State
    online,
    mobileMenuOpen,
    isDarkMode,
    logoSrc,
    isHome,
    
    // Handlers
    handleClickLink,
    handleContactClick,
    toggleMobileMenu,
    closeMobileMenu,
    toggleTheme,
  }
}