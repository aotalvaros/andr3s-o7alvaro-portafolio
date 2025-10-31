"use client";
import React, { Fragment } from "react";
import { LoaderOverlay } from "../LoaderOverlay";
import { Navbar } from "@/components/layout/navbar.components";
import dynamic from "next/dynamic";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { SpaceLoading } from "@/components/ui/spaceLoading";
import { BackToTop } from "@/components/ui/BackToTop";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useThemeStore } from "@/store/themeStore";

const ModuleInMaintenance = dynamic(
  () => import("@/components/maintenance/ModuleInMaintenance"),
  {
    loading: () => <div>Cargando...</div>,
  }
);

export const App = ({ children }: { readonly children: React.ReactNode }) => {
  const { 
    isAplicationInMaintenance, 
    isLoading
  } = useMaintenance();

  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  if (isLoading) {
    return <SpaceLoading isLoading={true} />;
  }

  if (isAplicationInMaintenance) {
    return (
      <ModuleInMaintenance message="La aplicación en este momento está en mantenimiento, por favor intenta más tarde." />
    );
  }

  return (
    <Fragment>
      <LoaderOverlay />
      <Navbar />
      <FloatingActionButton 
        onClick={toggleTheme} 
        className="bg-primary hover:bg-amber-700 dark:bg-primary cursor-pointer top-23 right-1 md:hidden" 
        icon={isDarkMode ? '☀️' : '🌙'}
        data-testid="theme-toggle-button"    
      />
      {children}
      <footer className="border-t border-border/70 py-8 bg-muted/30">
        <div className="container mx-auto px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Todos los derechos reservados.
              Desarrollado por Andrés Otalvaro
            </p>
            <p className="text-sm text-(var(--primary))">
              Portafolio en construcción
            </p>
            <p className="text-sm text-muted-foreground">andr3s.o7alvaro@gmail.com</p>
          </div>
        </div>
      </footer>
      <BackToTop />
    </Fragment>
  );
};
