'use client'

import React, { createContext, useContext, useState } from 'react'

type ActiveSectionContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
}

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined)

export const ActiveSectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = useState('')

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  )
}

export const useActiveSection = () => {
  const context = useContext(ActiveSectionContext)
  if (!context) {
    throw new Error('useActiveSection must be used within ActiveSectionProvider')
  }
  return context
}
