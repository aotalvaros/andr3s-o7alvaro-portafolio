'use client';
import React, { Fragment } from "react";
import { LoaderOverlay } from "./LoaderOverlay";
import { Navbar } from "@/components/layout/navbar.components";
import { Toaster } from "sonner";
import { ToastMessage } from "@/components/ui/ToastMessageComponent";
import ModuleInMaintenance from "@/components/maintenance/ModuleInMaintenance";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";

export const App = ({ children }: { readonly children: React.ReactNode }) => {

    const { isAplicationInMaintenance } = useMaintenance();

    if (isAplicationInMaintenance) {
        return (<ModuleInMaintenance  message="La aplicación en este momento está en mantenimiento, por favor intenta más tarde."/>)
    }

    return (
        <Fragment>
        <LoaderOverlay />
        <Navbar />
        <Toaster
            expand={false}
            richColors
            visibleToasts={1}
            duration={4000}
            position="top-right"
        />
        <ToastMessage />
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
