'use client'

import { useThemeStore } from '@/store/themeStore'
export default function Home() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  return (
    <main className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-blue-950 text-white' : 'bg-white text-black'}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a mi portafolio 🚀</h1>
      </div>
    </main>
  );
}
