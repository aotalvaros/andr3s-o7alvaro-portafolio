import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleStatsGridProps {
  totalModules: number
  activeModules: number
  blockedModules: number
  categoriesCount: number
}

export function ModuleStatsGrid({ totalModules, activeModules, blockedModules, categoriesCount }: Readonly<ModuleStatsGridProps>) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <Card className="bg-muted/60">
        <CardHeader className="pb-3">
          <CardDescription>Total Módulos</CardDescription>
          <CardTitle className="text-3xl" data-testid="total-modules">{totalModules}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-muted/60">
        <CardHeader className="pb-3">
          <CardDescription>Activos</CardDescription>
          <CardTitle className="text-3xl text-green-500" data-testid="active-modules">{activeModules}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-muted/60">
        <CardHeader className="pb-3">
          <CardDescription>Bloqueados</CardDescription>
          <CardTitle className="text-3xl text-red-500" data-testid="blocked-modules">{blockedModules}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-muted/60">
        <CardHeader className="pb-3">
          <CardDescription>Categorías</CardDescription>
          <CardTitle className="text-3xl" data-testid="categories-count">{categoriesCount}</CardTitle>
        </CardHeader>
      </Card>
    </section>
  )
}
