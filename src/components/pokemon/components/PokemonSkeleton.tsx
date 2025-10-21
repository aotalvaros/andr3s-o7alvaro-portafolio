import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PokemonSkeleton() {
  return (
    <Card className="p-6 space-y-4" itemID="pokemon-skeleton-card" data-testid="pokemon-skeleton-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-[#262626]" />
        <div className="flex gap-1">
          <Skeleton className="w-2 h-2 rounded-full bg-gray-200 dark:bg-[#262626]" />
          <Skeleton className="w-2 h-2 rounded-full bg-gray-200 dark:bg-[#262626]" />
        </div>
      </div>

      <Skeleton className="aspect-square rounded-xl bg-gray-200 dark:bg-[#262626]" />

      <Skeleton className="h-6 w-32 mx-auto bg-gray-200 dark:bg-[#262626]" />

      <div className="flex gap-2 justify-center">
        <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-[#262626]" />
        <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-[#262626]" />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto bg-gray-200 dark:bg-[#262626]" />
          <Skeleton className="h-4 w-6 mx-auto bg-gray-200 dark:bg-[#262626]" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto bg-gray-200 dark:bg-[#262626]" />
          <Skeleton className="h-4 w-6 mx-auto bg-gray-200 dark:bg-[#262626]" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto bg-gray-200 dark:bg-[#262626]" />
          <Skeleton className="h-4 w-6 mx-auto bg-gray-200 dark:bg-[#262626]" />
        </div>
      </div>
    </Card>
  )
}
