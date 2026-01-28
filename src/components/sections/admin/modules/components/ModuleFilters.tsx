import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { CustomSearch } from '@/components/ui/CustomSearch'

interface ModuleFiltersProps {
  searchTerm: string
  categoryFilter: string
  textExamples: string[]
  categories: Record<string, number>
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function ModuleFilters({ 
  searchTerm, 
  categoryFilter, 
  textExamples, 
  categories,
  onSearchChange, 
  onCategoryChange 
}: Readonly<ModuleFiltersProps>) {
  return (
    <section>
      <Card className="bg-muted/60">
        <CardHeader>
          <CardTitle>Gestión de Módulos</CardTitle>
          <CardDescription>Controla la visibilidad y estado de cada módulo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center sm:flex-row">
            <div className="relative flex-1">
              <CustomSearch
                onSearch={onSearchChange}
                placeholder="Buscar módulos..."
                textExample={textExamples}
                classNameContainer="max-w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.keys(categories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category} ({categories[category]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
