import type { Metadata } from "next";
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { SocketProvider } from '@/context/SocketContext'
import { ToastMessage } from '@/components/ui/ToastMessageComponent'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/providers/theme-provider'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata= {
  title: 'Portafolio | Andrés Dev',
  description: 'Desarrollador Frontend especializado en React y Next.js',
  icons: {
    icon: "/favicon.png", 
  },
  keywords: [
    'Andres',
    'Andres Dev',
    'Andrés otalvaro sanchez',
    'Portafolio',
    'Desarrollador Frontend',
    'React',
    'Frontend'
  ]
}

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="es">
    <body className={`${inter.className} grid min-h-dvh grid-rows-[auto_1fr_auto] bg-muted`}>
      <ThemeProvider>
        <Providers>
            <SocketProvider>
               <Toaster
                  expand={false}
                  richColors
                  visibleToasts={1}
                  duration={4000}
                  position="top-right"
                />
              <ToastMessage />
              {children}
            </SocketProvider>
        </Providers>
      </ThemeProvider>
      <Analytics />
    </body>
  </html>
  )
}
