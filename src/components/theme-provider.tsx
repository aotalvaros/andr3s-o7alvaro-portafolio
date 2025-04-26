"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({children}: { readonly children: React.ReactNode }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode, mounted]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
