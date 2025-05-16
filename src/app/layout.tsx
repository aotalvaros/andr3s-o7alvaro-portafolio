import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar.components'
import { LoaderOverlay } from './LoaderOverlay'
import { Providers } from './providers'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Portafolio | Andrés Dev',
  description: 'Desarrollador Frontend especializado en React y Next.js',
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="es">
    <body className={`${inter.className} grid min-h-[100dvh] grid-rows-[auto_1fr_auto]`}>
      <ThemeProvider>
        <LoaderOverlay />
        <Navbar />
        <Providers>
          {children}
        </Providers>
        <footer className="bg-gray-800 text-white py-4 text-center sm:py-4">
          <p className="text-fluid-base">&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
          <p className="text-sm sm:block hidden">Desarrollado por Andrés Otalvaro - andr3s.o7alvaro@gmail.com</p>
          <p className="text-fluid-sm text-red-300">Portafolio en construcción</p>
        </footer>
      </ThemeProvider>
    </body>
  </html>
  )
}
