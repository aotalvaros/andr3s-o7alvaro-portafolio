'use client'

import { useMaintenance } from '@/components/maintenance/hooks/useMaintenance';
import ModuleInMaintenance from '@/components/maintenance/ModuleInMaintenance';
import { PokemonList } from '@/components/pokemon/components/PokemonList';

export default function PokemonPage() {

    const { isInMaintenance } = useMaintenance();

    if (isInMaintenance) {
        return (<ModuleInMaintenance moduleName="Pokemon"/>)
    }

    return (
        <main className="py-24 px-4">
            <PokemonList/>
        </main>
    )
}