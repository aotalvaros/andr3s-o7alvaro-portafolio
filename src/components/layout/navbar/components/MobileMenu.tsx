
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import Image from 'next/image'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface MobileMenuProps {
  isOpen: boolean
  onContactClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onLinkClick: () => void
  onClose: () => void
}

export function MobileMenu({ isOpen, onContactClick, onLinkClick, onClose }: Readonly<MobileMenuProps>) {
  if (!isOpen) return null

  const handleLinkClick = () => {
    onLinkClick()
    onClose()
  }

  const handleContactLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onContactClick(e)
    onClose()
  }

  return (
    <div className="md:hidden flex flex-col gap-4 px-4 pb-4 dark:border-primary" data-testid="mobile-menu">
      <Link  
        onClick={handleContactLinkClick} 
        href="/#contact" 
        className="hover:underline dark:text-secondary" 
        data-testid="contact-link"
      >
        Contacto
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="hover:underline text-start dark:text-secondary" 
            data-testid="api-lab-dropdown"
          >
            Lab. de APIs ▼
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start" 
          className="z-15 w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10"
        >
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-secondary dark:bg-blue-900">
              NASA → 
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col z-[90] left-3 p-1 w-max shadow-lg rounded-[10px] shadow-blue-900 bg-white dark:bg-secondary dark:shadow-white/10">
                <DropdownMenuItem asChild>
                  <Link 
                    href="/lab/asteroids" 
                    onClick={handleLinkClick} 
                    className="w-full p-1 bg-white left-1 dark:bg-blue-900 rounded-[8px_8px_0_0]" 
                    data-testid="api-lab-asteroids-link"
                  >
                    🌌 Asteroides
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/lab/mars-rover" 
                    onClick={handleLinkClick} 
                    className="w-full p-1 bg-white left-1 dark:bg-blue-900 rounded-[0_0_8px_8px]" 
                    data-testid="api-lab-mars-rover-link"
                  >
                    🚀 Mars Rover
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link 
              href="/lab/pokemon" 
              onClick={handleLinkClick} 
              className="w-full p-1" 
              data-testid="api-lab-pokemon-link"
            > 
              🐲 Pokédex 
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link 
              href="/lab/weather" 
              onClick={handleLinkClick} 
              className="w-full p-1" 
              data-testid="api-lab-weather-link"
            > 
              <span>🌤️</span> Weather
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Link 
        onClick={handleLinkClick} 
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
    </div>
  )
}