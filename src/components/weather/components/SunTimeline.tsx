
import { motion } from "framer-motion"
import { Sunrise, Sunset } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Fragment } from "react"
import { formatTime } from "@/services/weather/utils/weatherFormatters"


interface SunTimelineProps {
  sunrise: number
  sunset: number
  currentTime: number
}

export function SunTimeline({ sunrise, sunset, currentTime }: Readonly<SunTimelineProps>) {
  const dayDuration = sunset - sunrise
  const timeElapsed = currentTime - sunrise
  const currentProgress = Math.max(0, Math.min(1, timeElapsed / dayDuration))

  const isDaytime = currentTime >= sunrise && currentTime <= sunset
  
  const arcLength = 360
  const sunX = 20 + (arcLength * currentProgress)
  const sunY = 90 - Math.abs(Math.sin((currentProgress * Math.PI))) * 100

  return (
    <Card className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-900">
      <h3 className="text-lg font-semibold mb-6">Ciclo Solar</h3>

      <div className="relative h-[40dvh] lg:h-40 xl:h-45 m-0_auto flex justify-center items-center">
        <svg className="w-[75%] lg:w-full h-full" viewBox="0 0 400 100">
        <path 
            d="M 20 80 Q 200 -20, 380 80" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            className="text-muted-foreground opacity-30" 
          />
          
          {isDaytime && (
            <motion.path
              d="M 20 80 Q 200 -20, 380 80"
              stroke="url(#sunGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="530"
              initial={{ strokeDashoffset: 530 }}
              animate={{ strokeDashoffset: 530 - (530 * currentProgress) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          )}
          
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <radialGradient id="sunRadial">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>

          {isDaytime && (
            <Fragment>
              <circle
                cx={sunX}
                cy={sunY}
                r="18"
                fill="orange"
                opacity="0.3"
              />
              <circle
                cx={sunX}
                cy={sunY}
                r="12"
                fill="url(#sunRadial)"
              />
            </Fragment>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Sunrise className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Amanecer</div>
            <div className="font-semibold">{formatTime(sunrise)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <div className="text-xs text-muted-foreground text-right">Atardecer</div>
            <div className="font-semibold">{formatTime(sunset)}</div>
          </div>
          <div className="p-2 rounded-full bg-orange-500/20">
            <Sunset className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Duración del día: {Math.floor(Math.abs(dayDuration) / 3600)}h {Math.floor((Math.abs(dayDuration) % 3600) / 60)}m
      </div>
    </Card>
  )
}
