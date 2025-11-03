// src/components/layout/navbar/constants/navigation.ts
export const NAVIGATION_ITEMS = {
  contact: {
    href: '/#contact',
    label: 'Contacto',
    testId: 'contact-link'
  },
  login: {
    href: '/login',
    label: 'Iniciar sesión',
    testId: 'login-link',
    icon: '/assets/settings_24dp.svg'
  },
  lab: {
    label: 'Laboratorio de APIs',
    testId: 'api-lab-dropdown',
    items: {
      nasa: {
        label: 'NASA',
        items: {
          asteroids: {
            href: '/lab/asteroids',
            label: '🌌 Asteroides',
            testId: 'api-lab-asteroids-link'
          },
          marsRover: {
            href: '/lab/mars-rover',
            label: '🚀 Mars Rover',
            testId: 'api-lab-mars-rover-link'
          }
        }
      },
      pokemon: {
        href: '/lab/pokemon',
        label: '🐲 Pokédex',
        testId: 'api-lab-pokemon-link'
      }
    }
  }
} as const

export const LOGO_PATHS = {
  light: '/assets/LogoAndres.svg',
  dark: '/assets/LogoAndresClaro.svg'
} as const