'use client'

import { useMaintenance } from '@/components/maintenance/hooks/useMaintenance';
import dynamic from 'next/dynamic';
import { PokemonList }  from '@/components/pokemon/components/PokemonList';

const ModuleInMaintenance = dynamic(() => import('@/components/maintenance/ModuleInMaintenance'), {
  loading: () => <div>Cargando...</div>,
});

export default function PokemonPage() {

    const { isInMaintenance } = useMaintenance();

    if (isInMaintenance) {
        return (<ModuleInMaintenance moduleName="Pokemon" />)
    }

    return (
        <main className="py-24 px-4 mx-8">
            <PokemonList/>
        </main>
    )
}