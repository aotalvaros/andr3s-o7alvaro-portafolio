import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type ThemeState = {
  isDarkMode: boolean
  toggleTheme: () => void
}

export const useThemeStore =create<ThemeState>()(
  devtools(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode
        }), false, 'toggleTheme')
    }),
    { enabled: process.env.NODE_ENV === 'development' } // opcional para solo dev
  )
)