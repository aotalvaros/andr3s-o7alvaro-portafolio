'use client'

import { About } from '@/components/sections/about'
import { Hero } from '@/components/sections/hero'
import { Skills } from '@/components/sections/skills'

export default function Home() {

  return (
    <main className="overflow-y-auto h-full snap-y snap-mandatory scroll-smooth px-10">
      <Hero />
      <Skills/>
      <About/>
    </main>
  )
}
