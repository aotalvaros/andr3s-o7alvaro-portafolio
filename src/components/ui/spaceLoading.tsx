"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface SpaceLoadingProps {
  isLoading?: boolean
  onLoadingComplete?: () => void
  shouldShow?: boolean,
  hasError?: boolean
}

export function SpaceLoading({ isLoading = true, onLoadingComplete, shouldShow = true, hasError = false }: Readonly<SpaceLoadingProps>) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [timeoutReached, setTimeoutReached] = useState(false)

  const handleLoadingComplete = () => {
    setIsComplete(true)
    setTimeout(() => {
      onLoadingComplete?.()
    }, 800)
  }

   const calculateNextProgress = (prev: number): number => {
    if (!isLoading || timeoutReached || hasError) {
      // Completar carga cuando termina, hay error o timeout
      if (prev >= 98) {
        handleLoadingComplete()
        return 100
      }
      return Math.min(prev + 5, 100)
    }

    // Mientras está cargando
    if (prev < 40) return prev + Math.random() * 3 + 1 // más rápido al inicio
    if (prev < 70) return prev + Math.random() * 1.5 + 0.5
    if (prev < 95) return prev + Math.random() * 0.4 // avanza más lento al final
    return prev // se queda flotando entre 95–98
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, calculateNextProgress(prev)))
    }, 120)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, timeoutReached, hasError])

  // 🔹 Fallback de seguridad (por si tarda o hay error)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) setTimeoutReached(true)
    }, 25000) // 25 segundos máx. de carga
    return () => clearTimeout(timeout)
  }, [isLoading])

  if (!shouldShow) return null
  
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0a0e27] via-[#16213e] to-[#0f1729] transition-opacity duration-700 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 px-4">
        <div className="relative">
          <div className="animate-float">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              <circle cx="60" cy="45" r="25" fill="#E8F4F8" opacity="0.9" />
              <circle cx="60" cy="45" r="22" fill="#1E3A8A" opacity="0.1" />

              <ellipse cx="60" cy="45" rx="18" ry="12" fill="#0EA5E9" opacity="0.6" />
              <ellipse cx="60" cy="45" rx="15" ry="10" fill="#38BDF8" opacity="0.4" />

              <ellipse cx="55" cy="42" rx="6" ry="4" fill="white" opacity="0.8" />

              <rect x="45" y="65" width="30" height="35" rx="8" fill="#F1F5F9" />
              <rect x="48" y="68" width="24" height="29" rx="6" fill="#E2E8F0" />

              <circle cx="60" cy="80" r="4" fill="#0EA5E9" />
              <rect x="52" y="88" width="16" height="2" rx="1" fill="#0EA5E9" />

              <rect x="35" y="70" width="8" height="20" rx="4" fill="#E2E8F0" />
              <rect x="77" y="70" width="8" height="20" rx="4" fill="#E2E8F0" />

              <rect x="48" y="98" width="8" height="18" rx="4" fill="#CBD5E1" />
              <rect x="64" y="98" width="8" height="18" rx="4" fill="#CBD5E1" />

              <ellipse cx="52" cy="116" rx="6" ry="3" fill="#64748B" />
              <ellipse cx="68" cy="116" rx="6" ry="3" fill="#64748B" />

              <rect x="50" y="68" width="20" height="8" rx="4" fill="#94A3B8" opacity="0.8" />

              <line x1="60" y1="20" x2="60" y2="28" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="60" cy="18" r="3" fill="#F59E0B" />
            </svg>
          </div>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/20 rounded-full blur-sm animate-shadow-pulse" />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Explorando portafolio</h2>
            <p className="text-blue-200/80 text-sm">Preparando los modulos....</p>
          </div>

          <div className="space-y-3">
            <Progress value={progress} className="h-2 bg-white/10 backdrop-blur-sm" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-blue-300/70 font-mono">{progress.toFixed(0)}%</span>
              <span className="text-blue-300/70">
                {progress < 30 && "Iniciando sistemas..."}
                {progress >= 30 && progress < 60 && "Cargando módulos..."}
                {progress >= 60 && progress < 98 && "Casi listo..."}
                {progress >= 98 && "¡Despegando!"}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
