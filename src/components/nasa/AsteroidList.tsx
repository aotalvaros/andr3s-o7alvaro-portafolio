/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { fetchAsteroids, fetchAsteroidById } from '@/services/nasaAsteroids';
import { AsteroidCard } from './AsteroidCard';
import Modal from '@/components/ui/Modal';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

export function AsteroidList() {
    const [asteroids, setAsteroids] = useState<any[]>([]);
    const [pageInfo, setPageInfo] = useState({
        current: 0,
        total: 0,
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

    const skeletonCount = 8;
    const skeletons = Array.from({ length: skeletonCount }, (_, index) => index);

   const loadAsteroids = async (page = 0) => {
        const data = await fetchAsteroids(page);
        setAsteroids(data.near_earth_objects);
        setPageInfo({
            current: data.page.number,
            total: data.page.total_pages,
        });
    };

    const loadAsteroidDetail = async (id: string) => {
        const detail = await fetchAsteroidById(id);
        setSelectedDetail(detail);
    };

    useEffect(() => {
        loadAsteroids(pageInfo.current);
    }, [pageInfo.current]);

    useEffect(() => {
        if (selectedId) {
            loadAsteroidDetail(selectedId);
        }
    }, [selectedId]);

    return (
        <section className="pt-10 pb-3 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Asteroides cercanos a la Tierra ☄️</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:max-h-[50vh] sm:overflow-auto px-1.5 py-1">
            {
                asteroids.length > 0 ?
                    asteroids.map((asteroid) => (
                        <AsteroidCard key={asteroid.id} asteroid={asteroid} onClick={() => setSelectedId(asteroid.id)} />
                    )) : 
                    skeletons.map((_, index) => (
                        <div className="flex flex-row space-y-3" key={index}>
                        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                        </div>
                    ))
            }
        </div>

        <div className="flex justify-center gap-4 mt-10">
           <button
                disabled={pageInfo.current === 0}
                onClick={() => setPageInfo((prev) => ({ ...prev, current: prev.current - 1 }))}
                className={`px-4 py-2 bg-primary text-white rounded ${pageInfo.current === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} dark:bg-black`}
            >
                Anterior
            </button>

            <button
                disabled={pageInfo.current + 1 >= pageInfo.total}
                onClick={() => setPageInfo((prev) => ({ ...prev, current: prev.current + 1 }))}
                className="px-4 py-2 bg-primary text-white rounded cursor-pointer dark:bg-black"
            >
                Siguiente
            </button>
        </div>

        <Modal open={!!selectedId} onClose={() => { setSelectedId(null); setSelectedDetail(null); }}>
            {selectedDetail ? (
            <div className='flex flex-col gap-3'>
                <section>
                    <Image 
                        src="/assets/NASA/asteroideGif.gif"
                        alt={selectedDetail.name}
                        width={500}
                        height={500}
                        className="rounded-lg shadow-lg m-auto" 
                          style={{
                            maskImage: 'linear-gradient(white 60%, transparent)',
                        }}
                    />
                </section>
              <section>
                  <h3 className="text-xl font-bold mb-2">{selectedDetail.name}</h3>
                    <p className="text-sm mb-1">Magnitud absoluta: {selectedDetail.absolute_magnitude_h}</p>
                    <p className="text-sm mb-1">
                    Tamaño: {selectedDetail.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                    </p>
                    <p className="text-sm">
                    ¿Peligroso? {selectedDetail.is_potentially_hazardous_asteroid ? 'Sí 😨' : 'No ✅'}
                    </p>
                </section>
            </div>
            ) : (
            <p>Cargando...</p>
            )}
        </Modal>
        </section>
    );
}
