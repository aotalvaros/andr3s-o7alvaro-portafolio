'use client';

import dynamic from 'next/dynamic';
import { RoverFilters } from "@/components/nasa/mars-rover/RoverFilters";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";

const ModuleInMaintenance = dynamic(() => import('@/components/maintenance/ModuleInMaintenance'), {
  loading: () => <div>Cargando...</div>,
});

export default function MarsRoverPage() {

  const { isInMaintenance, isError } = useMaintenance();

  if (isError || isInMaintenance) {
    return (<ModuleInMaintenance moduleName="Mars Rover"/>)
  }

  return (
    <main className="py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          📸 Imágenes desde Marte
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explora las fotografías tomadas por los rovers de la NASA en la superficie de Marte.
          Elige el rover y la cámara para ver imágenes reales del planeta rojo.
        </p>
      </div>

      <RoverFilters />
    </main>
  )
}
