"use client"

import { useEffect, useState } from "react"

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem("has-visited")

    if (hasVisited) {
      setIsFirstVisit(false)
    } else {
      localStorage.setItem("has-visited", "true")
      setIsFirstVisit(true)
    }

    setIsChecking(false)
  }, [])

  return { isFirstVisit, isChecking }
}
