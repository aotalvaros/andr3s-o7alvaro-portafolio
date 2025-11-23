'use client'

import { useNavbar } from './hooks/useNavbar'
import { Logo, CommandPaletteButton, DesktopMenu,
  MobileMenu, MobileMenuToggle, StatusIndicator } from './components'

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
    <header className="fixed top-0 left-0 right-0 z-50 glass text-foreground shadow-md dark:shadow-white/10 ">
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
    </header>
 )
}