"use client";

import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { WeatherContent } from "@/components/weather/components/WeatherContent";
import dynamic from "next/dynamic";

const ModuleInMaintenance = dynamic(
  () => import("@/components/maintenance/ModuleInMaintenance"),
  {
    loading: () => <div>Cargando...</div>,
  }
);

export default function WeatherPage() {
  const { isInMaintenance } = useMaintenance();

  // if (isInMaintenance) {
  //   return <ModuleInMaintenance moduleName="Weather" />;
  // }

  return (
    <main className="pt-20">
      <WeatherContent />
    </main>
  );
}
