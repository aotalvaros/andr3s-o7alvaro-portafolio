import { useModuleStats } from '../../../../../components/sections/admin/modules/hooks/useModuleStats';
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'

describe('useModuleStats', () => {
  const mockModules = [
    {
      _id: '1',
      name: 'React Basics',
      moduleName: 'react-basics',
      category: 'frontend',
      isBlocked: false
    },
    {
      _id: '2',
      name: 'Node.js Advanced',
      moduleName: 'nodejs-advanced',
      category: 'backend',
      isBlocked: false
    },
    {
      _id: '3',
      name: 'React Advanced',
      moduleName: 'react-advanced',
      category: 'frontend',
      isBlocked: true
    },
    {
      _id: '4',
      name: 'Database Design',
      moduleName: 'database-design',
      category: 'backend',
      isBlocked: false
    },
    {
      _id: '5',
      name: 'TypeScript Fundamentals',
      moduleName: 'typescript-fundamentals',
      category: 'frontend',
      isBlocked: true
    },
    {
      _id: '6',
      name: 'API Design',
      moduleName: 'api-design',
      category: 'backend',
      isBlocked: false
    }
  ]

  describe('Basic statistics calculations', () => {
    it('should calculate total modules correctly', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.totalModules).toBe(6)
    })

    it('should calculate active modules correctly', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.activeModules).toBe(4)
    })

    it('should calculate blocked modules correctly', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.blockedModules).toBe(2)
    })

    it('should sum active and blocked to equal total', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      const { activeModules, blockedModules, totalModules } = result.current
      expect(activeModules + blockedModules).toBe(totalModules)
    })

    it('should handle all modules being active', () => {
      const allActive = mockModules.map(m => ({ ...m, isBlocked: false }))
      const { result } = renderHook(() => useModuleStats(allActive))

      expect(result.current.activeModules).toBe(6)
      expect(result.current.blockedModules).toBe(0)
    })

    it('should handle all modules being blocked', () => {
      const allBlocked = mockModules.map(m => ({ ...m, isBlocked: true }))
      const { result } = renderHook(() => useModuleStats(allBlocked))

      expect(result.current.activeModules).toBe(0)
      expect(result.current.blockedModules).toBe(6)
    })
  })

  describe('Category aggregation', () => {
    it('should aggregate modules by category correctly', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.byCategory).toEqual({
        frontend: 3,
        backend: 3
      })
    })

    it('should handle single category', () => {
      const singleCategory = mockModules.filter(m => m.category === 'frontend')
      const { result } = renderHook(() => useModuleStats(singleCategory))

      expect(result.current.byCategory).toEqual({
        frontend: 3
      })
    })

    it('should handle modules with empty category as "Uncategorized"', () => {
      const modulesWithEmpty = [
        ...mockModules,
        {
          _id: '7',
          name: 'Uncategorized Module',
          moduleName: 'uncategorized',
          category: '',
          isBlocked: false
        }
      ]

      const { result } = renderHook(() => useModuleStats(modulesWithEmpty))

      expect(result.current.byCategory).toHaveProperty('Uncategorized', 1)
      expect(result.current.byCategory.frontend).toBe(3)
      expect(result.current.byCategory.backend).toBe(3)
    })

    it('should count multiple uncategorized modules', () => {
      const modulesWithMultipleEmpty = [
        {
          _id: '1',
          name: 'Module 1',
          moduleName: 'module-1',
          category: '',
          isBlocked: false
        },
        {
          _id: '2',
          name: 'Module 2',
          moduleName: 'module-2',
          category: '',
          isBlocked: false
        },
        {
          _id: '3',
          name: 'Module 3',
          moduleName: 'module-3',
          category: 'frontend',
          isBlocked: false
        }
      ]

      const { result } = renderHook(() => useModuleStats(modulesWithMultipleEmpty))

      expect(result.current.byCategory).toEqual({
        Uncategorized: 2,
        frontend: 1
      })
    })

    it('should handle diverse categories', () => {
      const diverseModules = [
        { ...mockModules[0], category: 'frontend' },
        { ...mockModules[1], category: 'backend' },
        { ...mockModules[2], category: 'devops' },
        { ...mockModules[3], category: 'testing' },
        { ...mockModules[4], category: 'security' }
      ]

      const { result } = renderHook(() => useModuleStats(diverseModules))

      expect(Object.keys(result.current.byCategory)).toHaveLength(5)
      expect(result.current.byCategory.frontend).toBe(1)
      expect(result.current.byCategory.backend).toBe(1)
      expect(result.current.byCategory.devops).toBe(1)
      expect(result.current.byCategory.testing).toBe(1)
      expect(result.current.byCategory.security).toBe(1)
    })
  })

  describe('Text examples extraction', () => {
    it('should extract first 3 module names', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.textExamples).toEqual([
        'React Basics',
        'Node.js Advanced',
        'React Advanced'
      ])
      expect(result.current.textExamples).toHaveLength(3)
    })

    it('should handle less than 3 modules', () => {
      const twoModules = mockModules.slice(0, 2)
      const { result } = renderHook(() => useModuleStats(twoModules))

      expect(result.current.textExamples).toEqual([
        'React Basics',
        'Node.js Advanced'
      ])
      expect(result.current.textExamples).toHaveLength(2)
    })

    it('should handle single module', () => {
      const oneModule = [mockModules[0]]
      const { result } = renderHook(() => useModuleStats(oneModule))

      expect(result.current.textExamples).toEqual(['React Basics'])
      expect(result.current.textExamples).toHaveLength(1)
    })

    it('should handle more than 3 modules (only first 3)', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.textExamples).toHaveLength(3)
      expect(result.current.textExamples).not.toContain('Database Design')
    })

    it('should maintain order of modules in examples', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current.textExamples[0]).toBe('React Basics')
      expect(result.current.textExamples[1]).toBe('Node.js Advanced')
      expect(result.current.textExamples[2]).toBe('React Advanced')
    })
  })

  describe('Edge cases', () => {
    it('should return default values when modules is undefined', () => {
      const { result } = renderHook(() => useModuleStats(undefined))

      expect(result.current).toEqual({
        activeModules: 0,
        blockedModules: 0,
        totalModules: 0,
        byCategory: {},
        textExamples: []
      })
    })

    it('should handle empty modules array', () => {
      const { result } = renderHook(() => useModuleStats([]))

      expect(result.current.totalModules).toBe(0)
      expect(result.current.activeModules).toBe(0)
      expect(result.current.blockedModules).toBe(0)
      expect(result.current.byCategory).toEqual({})
      expect(result.current.textExamples).toEqual([])
    })

    it('should handle modules with special characters in names', () => {
      const specialModules = [
        { ...mockModules[0], name: 'React & Redux' },
        { ...mockModules[1], name: 'Node.js/Express' },
        { ...mockModules[2], name: 'TypeScript (Advanced)' }
      ]

      const { result } = renderHook(() => useModuleStats(specialModules))

      expect(result.current.textExamples).toEqual([
        'React & Redux',
        'Node.js/Express',
        'TypeScript (Advanced)'
      ])
    })

    it('should handle modules with very long names', () => {
      const longNameModule = [
        {
          ...mockModules[0],
          name: 'A'.repeat(200)
        }
      ]

      const { result } = renderHook(() => useModuleStats(longNameModule))

      expect(result.current.textExamples[0]).toHaveLength(200)
    })

    it('should handle modules with empty names', () => {
      const emptyNameModules = [
        { ...mockModules[0], name: '' },
        { ...mockModules[1], name: '' }
      ]

      const { result } = renderHook(() => useModuleStats(emptyNameModules))

      expect(result.current.textExamples).toEqual(['', ''])
    })
  })

  describe('Memoization behavior', () => {
    it('should return same reference when modules do not change', () => {
      const { result, rerender } = renderHook(
        ({ modules }) => useModuleStats(modules),
        { initialProps: { modules: mockModules } }
      )

      const firstResult = result.current

      rerender({ modules: mockModules })

      expect(result.current).toBe(firstResult)
    })

    it('should return new reference when modules change', () => {
      const { result, rerender } = renderHook(
        ({ modules }) => useModuleStats(modules),
        { initialProps: { modules: mockModules } }
      )

      const firstResult = result.current

      const newModules = mockModules.slice(0, 3)
      rerender({ modules: newModules })

      expect(result.current).not.toBe(firstResult)
      expect(result.current.totalModules).toBe(3)
    })

  })

  describe('Data integrity', () => {
    it('should not modify original modules array', () => {
      const originalModules = [...mockModules]

      renderHook(() => useModuleStats(mockModules))

      expect(mockModules).toEqual(originalModules)
      expect(mockModules).toHaveLength(originalModules.length)
    })

    it('should not modify individual module objects', () => {
      const firstModule = { ...mockModules[0] }

      renderHook(() => useModuleStats(mockModules))

      expect(mockModules[0]).toEqual(firstModule)
    })

    it('should return independent byCategory object', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      const byCategory = result.current.byCategory
      byCategory.newCategory = 999

      const { result: result2 } = renderHook(() => useModuleStats(mockModules))

      expect(result2.current.byCategory).not.toHaveProperty('newCategory')
    })
  })

  describe('Complex scenarios', () => {
    it('should handle large number of modules', () => {
      const largeModuleArray = Array.from({ length: 1000 }, (_, i) => ({
        _id: `${i}`,
        name: `Module ${i}`,
        moduleName: `module-${i}`,
        category: i % 2 === 0 ? 'frontend' : 'backend',
        isBlocked: i % 3 === 0
      }))

      const { result } = renderHook(() => useModuleStats(largeModuleArray))

      expect(result.current.totalModules).toBe(1000)
      expect(result.current.activeModules + result.current.blockedModules).toBe(1000)
      expect(result.current.byCategory.frontend).toBe(500)
      expect(result.current.byCategory.backend).toBe(500)
    })

    it('should calculate stats correctly with mixed blocked states', () => {
      const mixedModules = [
        { ...mockModules[0], isBlocked: true },
        { ...mockModules[1], isBlocked: false },
        { ...mockModules[2], isBlocked: true },
        { ...mockModules[3], isBlocked: false },
        { ...mockModules[4], isBlocked: true }
      ]

      const { result } = renderHook(() => useModuleStats(mixedModules))

      expect(result.current.activeModules).toBe(2)
      expect(result.current.blockedModules).toBe(3)
      expect(result.current.totalModules).toBe(5)
    })

    it('should handle modules with duplicate categories correctly', () => {
      const duplicateCategories = Array.from({ length: 10 }, (_, i) => ({
        _id: `${i}`,
        name: `Module ${i}`,
        moduleName: `module-${i}`,
        category: 'frontend',
        isBlocked: false
      }))

      const { result } = renderHook(() => useModuleStats(duplicateCategories))

      expect(result.current.byCategory).toEqual({
        frontend: 10
      })
    })
  })

  describe('Return value structure', () => {
    it('should return object with all required properties', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(result.current).toHaveProperty('activeModules')
      expect(result.current).toHaveProperty('blockedModules')
      expect(result.current).toHaveProperty('totalModules')
      expect(result.current).toHaveProperty('byCategory')
      expect(result.current).toHaveProperty('textExamples')
    })

    it('should return correct types for all properties', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      expect(typeof result.current.activeModules).toBe('number')
      expect(typeof result.current.blockedModules).toBe('number')
      expect(typeof result.current.totalModules).toBe('number')
      expect(typeof result.current.byCategory).toBe('object')
      expect(Array.isArray(result.current.textExamples)).toBe(true)
    })

    it('should ensure byCategory values are numbers', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      Object.values(result.current.byCategory).forEach(value => {
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThan(0)
      })
    })

    it('should ensure textExamples contains strings', () => {
      const { result } = renderHook(() => useModuleStats(mockModules))

      result.current.textExamples.forEach(text => {
        expect(typeof text).toBe('string')
      })
    })
  })
})