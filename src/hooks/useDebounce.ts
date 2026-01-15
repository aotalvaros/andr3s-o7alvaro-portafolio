"use client"

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
  El hook useDebounce se utiliza para retrasar la actualización de un valor hasta que haya pasado un período de tiempo específico 
  sin cambios adicionales en ese valor. Esto es útil para optimizar el rendimiento en situaciones donde los cambios frecuentes pueden 
  causar efectos secundarios no deseados, como llamadas a APIs o renderizados innecesarios.

  Parámetros:
  - value: El valor que se desea debilitar.
  - delay: El tiempo en milisegundos que se debe esperar antes de actualizar el valor debilitado.

 */