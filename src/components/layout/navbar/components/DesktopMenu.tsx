"use client"

import { NavigationLinks } from './NavigationLinks'

interface DesktopMenuProps {
  onContactClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onLinkClick: () => void
  onThemeToggle: () => void
  isDarkMode: boolean
}

export function DesktopMenu(props: Readonly<DesktopMenuProps>) {
  return (
    <div className="hidden md:flex items-center gap-6">
      <NavigationLinks {...props} variant="desktop" />
    </div>
  )
}