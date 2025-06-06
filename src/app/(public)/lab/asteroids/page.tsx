'use client';

import { useMaintenance } from '@/components/maintenance/hooks/useMaintenance';
import dynamic from 'next/dynamic';
import { AsteroidList } from '@/components/nasa/AsteroidList';

const ModuleInMaintenance = dynamic(() => import('@/components/maintenance/ModuleInMaintenance'), {
  loading: () => <div>Cargando...</div>,
});

export default function LaboratorioPage() {
  const { isInMaintenance } = useMaintenance();

   if (isInMaintenance) {
    return (<ModuleInMaintenance moduleName="asteoids"/>)
  }

  return (
    <main>
      <AsteroidList />
    </main>
  );
}