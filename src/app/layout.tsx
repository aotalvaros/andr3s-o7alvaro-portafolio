import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar.components'
import { LoaderOverlay } from './LoaderOverlay'


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
        {children}
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; {new Date().getFullYear()} Andrés Otalvaro. Todos los derechos reservados.</p>
          <p className="text-sm">Desarrollado por Andrés Otalvaro</p>
          <p className="text-sm text-red-300">Portafolio en construcción</p>
        </footer>
      </ThemeProvider>
    </body>
  </html>
  )
}
