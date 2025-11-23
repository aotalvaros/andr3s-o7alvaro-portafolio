
import { Menu, X } from 'lucide-react'

interface MobileMenuToggleProps {
  isOpen: boolean
  onClick: () => void
}

export function MobileMenuToggle({ isOpen, onClick }: Readonly<MobileMenuToggleProps>) {
  return (
    <button
      className="md:hidden text-foreground"
      onClick={onClick}
      aria-label="Toggle mobile menu"
      aria-expanded={isOpen}
      data-testid="mobile-menu-toggle"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
}