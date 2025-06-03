import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from './providers'
import { SocketProvider } from '@/context/SocketContext'

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
        <Providers>
          <SocketProvider>
            {children}
        </SocketProvider>
        </Providers>
      </ThemeProvider>
    </body>
  </html>
  )
}
