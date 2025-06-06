'use client';
import React, { Fragment } from "react";
import { LoaderOverlay } from "../LoaderOverlay";
import { Navbar } from "@/components/layout/navbar.components";
import { Toaster } from "sonner";
import { ToastMessage } from "@/components/ui/ToastMessageComponent";
import ModuleInMaintenance from "@/components/maintenance/ModuleInMaintenance";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useThemeStore } from "@/store/themeStore";


export const App = ({ children }: { readonly children: React.ReactNode }) => {

    const { isAplicationInMaintenance } = useMaintenance();
    const isDarkMode = useThemeStore((state) => state.isDarkMode)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)

    if (isAplicationInMaintenance) {
        return (<ModuleInMaintenance  message="La aplicación en este momento está en mantenimiento, por favor intenta más tarde."/>)
    }

    return (
        <Fragment>
            <LoaderOverlay />
            <Toaster
                expand={false}
                richColors
                visibleToasts={1}
                duration={4000}
                position="top-right"
            />
            <ToastMessage />
            <Navbar />
            <FloatingActionButton 
                onClick={toggleTheme} 
                className="bg-primary hover:bg-amber-700 dark:bg-primary cursor-pointer top-23 right-1 md:hidden" 
                icon={isDarkMode ? '☀️' : '🌙'}    
            />
            {children}
            <footer className="bg-gray-800 text-white py-4 text-center sm:py-4">
                <p className="text-fluid-base">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </p>
                <p className="text-sm sm:block hidden">
                Desarrollado por Andrés Otalvaro - andr3s.o7alvaro@gmail.com
                </p>
                <p className="text-fluid-sm text-red-300">Portafolio en construcción</p>
            </footer>
        </Fragment>
    );
};
