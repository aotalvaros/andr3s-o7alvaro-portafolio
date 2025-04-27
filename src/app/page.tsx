'use client'

import { About } from '@/components/sections/about'
import { Hero } from '@/components/sections/hero'

export default function Home() {

  return (
    <main>
      <Hero />
      <About />
      {/* Después agregamos otras secciones aquí */}
    </main>
  )
}
