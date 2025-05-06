import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar.components'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Portafolio | Andrés Dev',
  description: 'Desarrollador Frontend especializado en React y Next.js',
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="es">
    <body className={inter.className}>
      <ThemeProvider>
        <Navbar />
        {children}
      </ThemeProvider>
    </body>
  </html>
  )
}
