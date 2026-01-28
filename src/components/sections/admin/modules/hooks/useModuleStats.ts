import { useMemo } from 'react'

interface Module {
  _id: string
  name: string
  moduleName: string
  category: string
  isBlocked: boolean
}

export function useModuleStats(modules: Module[] | undefined) {
  return useMemo(() => {
    if (!modules) {
      return {
        activeModules: 0,
        blockedModules: 0,
        totalModules: 0,
        byCategory: {},
        textExamples: []
      }
    }

    const activeModules = modules.filter(module => !module.isBlocked).length
    const blockedModules = modules.filter(module => module.isBlocked).length
    const totalModules = modules.length
    const byCategory = modules.reduce((acc: Record<string, number>, module) => {
      const category = module.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
    const textExamples = modules.slice(0, 3).map(m => m.name)

    return {
      activeModules,
      blockedModules,
      totalModules,
      byCategory,
      textExamples
    }
  }, [modules])
}
