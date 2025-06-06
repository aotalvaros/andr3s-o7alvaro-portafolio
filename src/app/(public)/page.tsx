'use client'

import { About } from '@/components/sections/about'
import { Hero } from '@/components/sections/hero'
import { Skills } from '@/components/sections/skills'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton'
import { sectionsOrder } from '@/constants/sectionsOrder.constants'

import { useActiveSection } from '@/context/ActiveSectionProvider'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function Home() {

  const { activeSection } = useActiveSection()

  const currentIndex = sectionsOrder.indexOf(activeSection as typeof sectionsOrder[number])
  const isAtEnd = currentIndex === sectionsOrder.length - 1
 
  const handleFabClick = () => {
    const nextSection = isAtEnd ? sectionsOrder[0] : sectionsOrder[currentIndex + 1]
    const target = document.getElementById(nextSection)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="overflow-y-auto h-full snap-y snap-mandatory scroll-smooth py">
      <FloatingActionButton 
        onClick={handleFabClick}
        className='m-auto left-0 bg-gray-400 dark:bg-secondary '
        icon={
          isAtEnd 
            ? <ArrowUp className="text-white dark:text-primary-foreground" />
            : <ArrowDown className="text-white dark:text-primary-foreground" />
        }
      />
      <Hero />
      <Skills/>
      <About/>
    </main>
  )
}
