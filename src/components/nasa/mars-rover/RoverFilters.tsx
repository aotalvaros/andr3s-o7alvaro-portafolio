'use client'

import { useState } from 'react'
import { MarsGallery } from './MarsGallery'
import { Button } from '@/components/ui/button'
import { cameras } from '@/constants/nasa/cameras'
import { rovers } from '@/constants/nasa/rovers'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function RoverFilters() {
  const [rover, setRover] = useState<'curiosity' | 'opportunity' | 'spirit'>('curiosity')
  const [camera, setCamera] = useState<string | undefined>(undefined)

  const cameraOptions = cameras[rover]

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap">
        {/* Rover selector */}
        <Select value={rover} onValueChange={(value) => setRover(value as 'curiosity' | 'opportunity' | 'spirit')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Rover" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {rovers.map((r) => (
                <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Cámara */}
        <Select value={camera ?? 'all'} onValueChange={(value) => { setCamera(value === 'all' ? undefined : value)}}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Cámara (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {cameraOptions.map((cam) => (
              <SelectItem key={cam} value={cam.toLowerCase()}>
                {cam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <Button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
          🔭 Explorar
        </Button>
      </div>

      {/* Galería dinámica */}
      <MarsGallery rover={rover} camera={camera} />
    </section>
  )
}
