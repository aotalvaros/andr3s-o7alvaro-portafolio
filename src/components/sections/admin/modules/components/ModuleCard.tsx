import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Switch } from "@/components/ui/switch"
import { Lock, Unlock } from "lucide-react"

interface Module {
  _id: string
  name: string
  moduleName: string
  category: string
  isBlocked: boolean
}

interface ModuleCardProps {
  module: Module
  lastModified?: string
  isPending: boolean
  onToggle: (moduleName: string, isBlocked: boolean) => void
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "api":
      return "🔌"
    case "component":
      return "🧩"
    case "feature":
      return "⚡"
    case "integration":
      return "🔗"
    default:
      return "📦"
  }
}

export function ModuleCard({ module, lastModified, isPending, onToggle }: Readonly<ModuleCardProps>) {
  return (
    <Card className="relative bg-muted/60">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(module.category)}</span>
            <div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <CardDescription className="text-xs capitalize">{module.category}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {module.isBlocked && (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20" data-testid="blocked-badge">
              Bloqueado
            </Badge>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {module.isBlocked ? (
                <Lock className="h-4 w-4 text-red-500" />
              ) : (
                <Unlock className="h-4 w-4 text-green-500" />
              )}
              <span className="text-muted-foreground">Bloqueado</span>
            </div>
            <Switch 
              checked={!module.isBlocked} 
              onCheckedChange={(checked) => onToggle(module.moduleName, !checked)}
              className="hover:cursor-pointer"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground">
          Última modificación: {lastModified || "N/A"}
        </div>
      </CardContent>
    </Card>
  )
}
