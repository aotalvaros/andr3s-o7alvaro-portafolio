'use client'

import { motion } from 'framer-motion'
import { useNavbar } from './hooks/useNavbar'
import { Logo } from './components/Logo'
import { StatusIndicator } from './components/StatusIndicator'
import { CommandPaletteButton } from './components/CommandPaletteButton'
import { MobileMenuToggle } from './components/MobileMenuToggle'
import { DesktopMenu } from './components/DesktopMenu'
import { MobileMenu } from './components/MobileMenu'

export function Navbar() {

 const {
    online,
    mobileMenuOpen,
    isDarkMode,
    logoSrc,
    handleClickLink,
    handleContactClick,
    toggleMobileMenu,
    closeMobileMenu,
    toggleTheme,
  } = useNavbar()

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 glass text-foreground shadow-md dark:shadow-white/10 ">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4 ">
        <Logo logoSrc={logoSrc} />
        <StatusIndicator online={online} />
        <CommandPaletteButton />
        
        <MobileMenuToggle 
          isOpen={mobileMenuOpen} 
          onClick={toggleMobileMenu} 
        />
        
        <DesktopMenu
          onContactClick={handleContactClick}
          onLinkClick={handleClickLink}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onContactClick={handleContactClick}
        onLinkClick={handleClickLink}
        onClose={closeMobileMenu}
      />
    </motion.header>
 )
}