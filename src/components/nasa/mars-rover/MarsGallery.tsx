'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMarsPhotos } from '../hooks/useMarsPhotos'

interface MarsGalleryProps {
  rover: 'curiosity' | 'opportunity' | 'spirit'
  camera?: string
  page?: number
}

export function MarsGallery({ rover, camera, page = 1 }: Readonly<MarsGalleryProps>) {
  const { data, isLoading, isError } = useMarsPhotos({ rover, sol: 1000, camera, page })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-red-500 text-center">Error cargando imágenes 🛠️</p>
  }

  if (!data || data?.length === 0) {
    return <p className="text-center text-muted-foreground">No hay imágenes para esta configuración 🚫</p>
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {
        data?.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-background border rounded-xl shadow-md dark:shadow-white/10 overflow-hidden"
          >
            <div className="relative w-full h-64">
              <Image
                src={item.img_src}
                alt={`Foto de Marte por ${item.rover.name}`}
                fill
                sizes="auto"
                className="object-cover"
                loading='lazy'
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-primary mb-1">{item.camera.full_name}</h3>
              <p className="text-sm text-muted-foreground">
              📅 {item.earth_date} | 🚀 {item.rover.name}
              </p>
            </div>
          </motion.div>
        ))
      }   
    </div>
  )
}
