import { useMemo } from 'react'

interface Module {
  _id: string
  name: string
  moduleName: string
  category: string
  isBlocked: boolean
}

export function useModuleFilters(
  modules: Module[] | undefined,
  searchTerm: string,
  categoryFilter: string
) {
  return useMemo(() => {
    return modules?.filter((module) => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || module.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [modules, categoryFilter, searchTerm])
}
