import { useModuleFilters } from '../../../../../../components/sections/admin/modules/hooks/useModuleFilters';
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'

describe('useModuleFilters', () => {
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
      isBlocked: false
    }
  ]

  describe('Search filtering', () => {
    it('should filter modules by search term (case-insensitive)', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'react', 'all')
      )

      expect(result.current).toHaveLength(2)
      expect(result.current?.map(m => m.name)).toEqual([
        'React Basics',
        'React Advanced'
      ])
    })

    it('should handle uppercase search terms', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'REACT', 'all')
      )

      expect(result.current).toHaveLength(2)
      expect(result.current?.every(m => m.name.toLowerCase().includes('react'))).toBe(true)
    })

    it('should handle mixed case search terms', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'NoDE.js', 'all')
      )

      expect(result.current).toHaveLength(1)
      expect(result.current?.[0].name).toBe('Node.js Advanced')
    })

    it('should return empty array when no matches found', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'nonexistent', 'all')
      )

      expect(result.current).toHaveLength(0)
    })

    it('should return all modules with empty search term', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, '', 'all')
      )

      expect(result.current).toHaveLength(5)
    })

    it('should handle partial matches', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'adv', 'all')
      )

      expect(result.current).toHaveLength(2)
      expect(result.current?.map(m => m.name)).toEqual([
        'Node.js Advanced',
        'React Advanced'
      ])
    })
  })

  describe('Category filtering', () => {
    it('should filter modules by category', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, '', 'frontend')
      )

      expect(result.current).toHaveLength(3)
      expect(result.current?.every(m => m.category === 'frontend')).toBe(true)
    })

    it('should filter backend category', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, '', 'backend')
      )

      expect(result.current).toHaveLength(2)
      expect(result.current?.map(m => m.name)).toEqual([
        'Node.js Advanced',
        'Database Design'
      ])
    })

    it('should return all modules when category is "all"', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, '', 'all')
      )

      expect(result.current).toHaveLength(5)
    })

    it('should return empty array for non-existent category', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, '', 'nonexistent')
      )

      expect(result.current).toHaveLength(0)
    })
  })

  describe('Combined filtering', () => {
    it('should filter by both search term and category', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'react', 'frontend')
      )

      expect(result.current).toHaveLength(2)
      expect(result.current?.every(m => m.category === 'frontend')).toBe(true)
      expect(result.current?.every(m => m.name.toLowerCase().includes('react'))).toBe(true)
    })

    it('should return empty when search matches but category does not', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'react', 'backend')
      )

      expect(result.current).toHaveLength(0)
    })

    it('should return empty when category matches but search does not', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'python', 'frontend')
      )

      expect(result.current).toHaveLength(0)
    })

    it('should handle specific search in specific category', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'database', 'backend')
      )

      expect(result.current).toHaveLength(1)
      expect(result.current?.[0].name).toBe('Database Design')
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined modules', () => {
      const { result } = renderHook(() =>
        useModuleFilters(undefined, 'test', 'all')
      )

      expect(result.current).toBeUndefined()
    })

    it('should handle empty modules array', () => {
      const { result } = renderHook(() =>
        useModuleFilters([], 'test', 'all')
      )

      expect(result.current).toHaveLength(0)
    })

    it('should handle special characters in search term', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'node.js', 'all')
      )

      expect(result.current).toHaveLength(1)
      expect(result.current?.[0].name).toBe('Node.js Advanced')
    })
  })

  describe('Memoization behavior', () => {
    it('should return same reference when dependencies do not change', () => {
      const { result, rerender } = renderHook(
        ({ modules, search, category }) =>
          useModuleFilters(modules, search, category),
        {
          initialProps: {
            modules: mockModules,
            search: 'react',
            category: 'all'
          }
        }
      )

      const firstResult = result.current

      rerender({
        modules: mockModules,
        search: 'react',
        category: 'all'
      })

      expect(result.current).toBe(firstResult)
    })

    it('should return new reference when search term changes', () => {
      const { result, rerender } = renderHook(
        ({ modules, search, category }) =>
          useModuleFilters(modules, search, category),
        {
          initialProps: {
            modules: mockModules,
            search: 'react',
            category: 'all'
          }
        }
      )

      const firstResult = result.current

      rerender({
        modules: mockModules,
        search: 'node',
        category: 'all'
      })

      expect(result.current).not.toBe(firstResult)
      expect(result.current).toHaveLength(1)
    })

    it('should return new reference when category changes', () => {
      const { result, rerender } = renderHook(
        ({ modules, search, category }) =>
          useModuleFilters(modules, search, category),
        {
          initialProps: {
            modules: mockModules,
            search: '',
            category: 'all'
          }
        }
      )

      const firstResult = result.current

      rerender({
        modules: mockModules,
        search: '',
        category: 'frontend'
      })

      expect(result.current).not.toBe(firstResult)
      expect(result.current).toHaveLength(3)
    })

    it('should return new reference when modules change', () => {
      const { result, rerender } = renderHook(
        ({ modules, search, category }) =>
          useModuleFilters(modules, search, category),
        {
          initialProps: {
            modules: mockModules,
            search: '',
            category: 'all'
          }
        }
      )

      const firstResult = result.current

      const newModules = [...mockModules.slice(0, 3)]

      rerender({
        modules: newModules,
        search: '',
        category: 'all'
      })

      expect(result.current).not.toBe(firstResult)
      expect(result.current).toHaveLength(3)
    })
  })

  describe('Data integrity', () => {
    it('should not modify original modules array', () => {
      const originalModules = [...mockModules]

      renderHook(() =>
        useModuleFilters(mockModules, 'react', 'frontend')
      )

      expect(mockModules).toEqual(originalModules)
    })

    it('should preserve all module properties', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'react', 'all')
      )

      result.current?.forEach(module => {
        expect(module).toHaveProperty('_id')
        expect(module).toHaveProperty('name')
        expect(module).toHaveProperty('moduleName')
        expect(module).toHaveProperty('category')
        expect(module).toHaveProperty('isBlocked')
      })
    })

    it('should maintain correct module structure', () => {
      const { result } = renderHook(() =>
        useModuleFilters(mockModules, 'database', 'backend')
      )

      const module = result.current?.[0]
      expect(module?._id).toBe('4')
      expect(module?.name).toBe('Database Design')
      expect(module?.moduleName).toBe('database-design')
      expect(module?.category).toBe('backend')
      expect(module?.isBlocked).toBe(false)
    })
  })
})