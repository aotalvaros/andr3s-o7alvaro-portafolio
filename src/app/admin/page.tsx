'use client';

import { AdminDashboard } from '@/components/sections/admin/AdminDashboard';
import { Fragment } from 'react';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import {  Sun, Moon } from "lucide-react"
import { useThemeStore } from '../../store/themeStore';

export default function AdminPage() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  return (
    <Fragment>
      <AdminDashboard />
      <FloatingActionButton
        onClick={toggleTheme} 
        className="rounded-full transition-all duration-300 hover:scale-110 bg-primary hover:bg-accent cursor-pointer top-23 right-1 md:hidden" 
        icon={isDarkMode ? <Sun className="h-5 w-5" data-testid="sun-icon" /> : <Moon className="h-5 w-5" data-testid="moon-icon" />}
        data-testid="theme-toggle-button"
      />
    </Fragment>
  );
}
