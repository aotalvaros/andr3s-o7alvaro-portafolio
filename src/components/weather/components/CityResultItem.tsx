
import { CitySearchResult } from "@/types/weather.interface"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

interface CityResultItemProps {
  result: CitySearchResult
  index: number
  onSelect: (result: CitySearchResult) => void
}

export function CityResultItem({ result, index, onSelect }: CityResultItemProps) {
  return (
    <motion.button
      key={`${result.name}-${result.country}-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseDown={(e) => {
        e.preventDefault()
        onSelect(result)
      }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        <MapPin className="h-5 w-5" />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-sm">
          {result.name}
          {result.state && `, ${result.state}`}
        </div>
        <div className="text-xs text-muted-foreground">{result.country}</div>
      </div>
    </motion.button>
  )
}