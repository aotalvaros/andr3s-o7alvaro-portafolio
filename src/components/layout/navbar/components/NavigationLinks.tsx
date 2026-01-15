
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ItemsMenu } from '../../items.components'

interface NavigationLinksProps {
  onContactClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onLinkClick: () => void
  onThemeToggle: () => void
  isDarkMode: boolean
  variant?: 'desktop' | 'mobile'
}

export function NavigationLinks({ 
  onContactClick, 
  onLinkClick, 
  onThemeToggle, 
  isDarkMode,
  variant = 'desktop'
}: Readonly<NavigationLinksProps>) {

  return (
    <>
      <Link 
        onClick={onContactClick} 
        href="/#contact" 
        className='hover:underline dark:text-secondary'
        data-testid="contact-link"
      >
        Contacto
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={`hover:underline ${variant === 'mobile' ? 'text-start' : ''} dark:text-secondary`} 
            data-testid="api-lab-dropdown"
          >
            Lab. de APIs ▼
          </button>
        </DropdownMenuTrigger>
        <ItemsMenu handleClickLink={onLinkClick} />
      </DropdownMenu>

      <Link 
        onClick={onLinkClick} 
        href="/login" 
        className="hover:underline" 
        data-testid="login-link"
      >
        <Image 
          src="/assets/settings_24dp.svg" 
          alt="Iniciar sesión" 
          width={24} 
          height={24} 
          className='filter dark:invert' 
          loading="lazy"
        />
      </Link>

      {variant === 'desktop' && (
        <Button 
          onClick={onThemeToggle} 
          variant="outline" 
          className="rounded-full transition-all duration-300 hover:scale-110 bg-transparent" 
          data-testid="theme-toggle-button"
        >
          {isDarkMode ? 
            <Sun className="h-5 w-5" data-testid="sun-icon" /> : 
            <Moon className="h-5 w-5" data-testid="moon-icon" />
          }
        </Button>
      )}
    </>
  )
}