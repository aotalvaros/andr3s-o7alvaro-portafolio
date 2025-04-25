'use client'

import { useThemeStore } from '@/store/themeStore'
export default function Home() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <main className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-blue-950 text-white' : 'bg-white text-black'}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a mi portafolio 🚀</h1>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={toggleTheme}
        >
          Cambiar a {isDarkMode ? 'Claro' : 'Oscuro'}
        </button>
      </div>
    </main>
  );
}
