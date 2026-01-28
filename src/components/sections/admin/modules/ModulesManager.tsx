import { useState } from 'react'
import { useBlockedModules } from '../hooks/useBlockedModules'
import { useRecentActivities } from '../hooks/useRecentActivities'
import { useModuleStats } from './hooks/useModuleStats'
import { useModuleFilters } from './hooks/useModuleFilters'
import { ModuleStatsGrid } from './components/ModuleStatsGrid'
import { ModuleFilters } from './components/ModuleFilters'
import { ModuleCard } from './components/ModuleCard'

export function ModulesManager() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  const { modules, handleToggleModule, isPending } = useBlockedModules()
  const recentActivities = useRecentActivities(3)
  const { activeModules, blockedModules, totalModules, byCategory, textExamples } = useModuleStats(modules)
  const filteredModules = useModuleFilters(modules, searchTerm, categoryFilter)

  return (
    <div className="space-y-6">
      <ModuleStatsGrid
        totalModules={totalModules}
        activeModules={activeModules}
        blockedModules={blockedModules}
        categoriesCount={Object.keys(byCategory).length}
      />
      
      <ModuleFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        textExamples={textExamples}
        categories={byCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules?.map((module) => (
          <ModuleCard
            key={module._id}
            module={module}
            lastModified={recentActivities.find(activity => activity.module === module.name)?.time}
            isPending={isPending}
            onToggle={handleToggleModule}
          />
        ))}
      </div>
    </div>
  )
}