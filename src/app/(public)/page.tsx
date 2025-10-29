'use client'

import { About } from '@/components/sections/about'
import { Hero } from '@/components/sections/hero'
import { Skills } from '@/components/sections/skills'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

export default function Home() {
  return (
    <main className="overflow-y-auto h-full snap-y snap-mandatory scroll-smooth py">
      <ScrollProgress />
      <Hero />
      <About/>
      <Skills/>
    </main>
  )
}
