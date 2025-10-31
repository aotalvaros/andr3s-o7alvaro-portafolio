"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Hook para manejar la primera visita del usuario
 * 
 * @description
 * Este hook detecta si es la primera vez que un usuario visita la aplicación
 * usando localStorage para persistir el estado entre sesiones.
 * 
 * @example
 * ```tsx
 * const { isFirstVisit, markAsVisited } = useFirstVisit()
 * 
 * // Mostrar tutorial solo en primera visita
 * if (isFirstVisit) {
 *   return <WelcomeTutorial onComplete={markAsVisited} />
 * }
 * 
 * // Mostrar onboarding
 * {isFirstVisit && (
 *   <OnboardingModal onClose={markAsVisited} />
 * )}
 * ```
 * 
 * @returns {Object} Objeto con isFirstVisit boolean y función markAsVisited
 * 
 * @future-use
 * - Tutorial de primera visita
 * - Onboarding de usuarios nuevos
 * - Analytics de nuevos usuarios
 * - Tours guiados de la interfaz
 */
export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true)

  useEffect(() => {
    // Verificar si existe la key 'has-visited' en localStorage
    const hasVisited = localStorage.getItem('has-visited')
    setIsFirstVisit(!hasVisited)
  }, [])

  const markAsVisited = useCallback(() => {
    localStorage.setItem('has-visited', 'true')
    setIsFirstVisit(false)
  }, [])

  return {
    isFirstVisit,
    markAsVisited
  }
}
