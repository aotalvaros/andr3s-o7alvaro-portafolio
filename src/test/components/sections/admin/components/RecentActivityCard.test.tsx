import { RecentActivityCard } from '../../../../../components/sections/admin/components/RecentActivityCard';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentActivity } from '../../../../../components/sections/admin/types/dashboard.types';

describe('RecentActivityCard', () => {
  const mockActivities: RecentActivity[] = [
    {
      module: 'Authentication',
      lastModifiedBy: 'admin@example.com',
      time: 'hace 5 minutos',
      isBlocked: false,
    },
    {
      module: 'Payment Gateway',
      lastModifiedBy: 'john.doe@example.com',
      time: 'hace 15 minutos',
      isBlocked: true,
    },
    {
      module: 'User Management',
      lastModifiedBy: 'jane.smith@example.com',
      time: 'hace 1 hora',
      isBlocked: false,
    },
  ]

  describe('Rendering', () => {
    it('should render card with correct title', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Actividad Reciente')).toBeInTheDocument()
    })

    it('should render card with correct description', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Últimos cambios en el sistema')).toBeInTheDocument()
    })

    it('should render all activities', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(3)
    })

    it('should render Card component', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const card = container.querySelector('[class*="border"]')
      expect(card).toBeInTheDocument()
    })

    it('should render CardHeader', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Actividad Reciente')).toBeInTheDocument()
      expect(screen.getByText('Últimos cambios en el sistema')).toBeInTheDocument()
    })

    it('should render CardContent with space-y-4 class', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const contentDiv = container.querySelector('.space-y-4')
      expect(contentDiv).toBeInTheDocument()
    })
  })

  describe('Activity display', () => {
    it('should display module names correctly', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.getByText('Payment Gateway')).toBeInTheDocument()
      expect(screen.getByText('User Management')).toBeInTheDocument()
    })

    it('should display time for each activity', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('hace 5 minutos')).toBeInTheDocument()
      expect(screen.getByText('hace 15 minutos')).toBeInTheDocument()
      expect(screen.getByText('hace 1 hora')).toBeInTheDocument()
    })

    it('should show "activo" for non-blocked modules', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      const activoElements = screen.getAllByText(/esta activo/)
      expect(activoElements).toHaveLength(2)
    })

    it('should show "bloqueado" for blocked modules', () => {
      render(<RecentActivityCard activities={mockActivities} />)

      const bloqueadoElements = screen.getAllByText(/esta bloqueado/)
      expect(bloqueadoElements).toHaveLength(1)
    })

    it('should render module names in semibold font', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const moduleNames = container.querySelectorAll('.font-semibold')
      expect(moduleNames).toHaveLength(4)
    })

    it('should render time with text-xs class', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const timeElements = container.querySelectorAll('.text-xs')
      expect(timeElements).toHaveLength(3)
    })
  })

  describe('Empty state', () => {
    it('should render empty card when no activities provided', () => {
      render(<RecentActivityCard activities={[]} />)

      expect(screen.getByText('Actividad Reciente')).toBeInTheDocument()
      expect(screen.getByText('Últimos cambios en el sistema')).toBeInTheDocument()
    })

    it('should not render activity items when array is empty', () => {
      const { container } = render(<RecentActivityCard activities={[]} />)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(0)
    })

    it('should have empty space-y-4 container', () => {
      const { container } = render(<RecentActivityCard activities={[]} />)

      const contentDiv = container.querySelector('.space-y-4')
      expect(contentDiv).toBeInTheDocument()
      expect(contentDiv?.children).toHaveLength(0)
    })
  })

  describe('Single activity', () => {
    it('should render single activity correctly', () => {
      const singleActivity: RecentActivity[] = [mockActivities[0]]

      render(<RecentActivityCard activities={singleActivity} />)

      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.getByText('hace 5 minutos')).toBeInTheDocument()
      expect(screen.getByText(/esta activo/)).toBeInTheDocument()
    })

    it('should render only one activity item', () => {
      const singleActivity: RecentActivity[] = [mockActivities[0]]
      const { container } = render(<RecentActivityCard activities={singleActivity} />)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(1)
    })
  })

  describe('Multiple activities with same module', () => {
    it('should handle activities with same module name but different states', () => {
      const duplicateModuleActivities: RecentActivity[] = [
        {
          module: 'Authentication',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 5 minutos',
          isBlocked: false,
        },
        {
          module: 'Authentication',
          lastModifiedBy: 'john@example.com',
          time: 'hace 10 minutos',
          isBlocked: true,
        },
      ]

      const { container } = render(<RecentActivityCard activities={duplicateModuleActivities} />)

      const moduleNames = screen.getAllByText('Authentication')
      expect(moduleNames).toHaveLength(2)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(2)
    })
  })

  describe('Key generation', () => {
    it('should use module name + index as key', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      // Keys are not directly visible in the DOM, but we can verify the structure
      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(3)
    })

    it('should handle duplicate module names with different indices', () => {
      const duplicateActivities: RecentActivity[] = [
        mockActivities[0],
        mockActivities[0],
        mockActivities[0],
      ]

      const { container } = render(<RecentActivityCard activities={duplicateActivities} />)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(3)
    })
  })

  describe('Text formatting', () => {
    it('should have muted text color for main text', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const mutedTexts = container.querySelectorAll('.text-muted-foreground')
      expect(mutedTexts.length).toBeGreaterThan(0)
    })

    it('should have foreground color for module names', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const foregroundTexts = container.querySelectorAll('.text-foreground')
      expect(foregroundTexts).toHaveLength(3)
    })

    it('should use small text size', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const smallTexts = container.querySelectorAll('.text-sm')
      expect(smallTexts).toHaveLength(4)
    })

    it('should use extra small text size for time', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const xsTexts = container.querySelectorAll('.text-xs')
      expect(xsTexts).toHaveLength(3)
    })
  })

  describe('Layout structure', () => {
    it('should have flex layout with items-center and justify-between', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const flexItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(flexItems).toHaveLength(3)
    })

    it('should have space-y-4 between activities', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const spaceContainer = container.querySelector('.space-y-4')
      expect(spaceContainer).toBeInTheDocument()
    })

    it('should render activities in correct order', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const activityItems = Array.from(
        container.querySelectorAll('.flex.items-center.justify-between')
      )

      expect(activityItems[0]).toHaveTextContent('Authentication')
      expect(activityItems[1]).toHaveTextContent('Payment Gateway')
      expect(activityItems[2]).toHaveTextContent('User Management')
    })
  })

  describe('isBlocked status', () => {
    it('should correctly display blocked status', () => {
      const blockedActivity: RecentActivity[] = [
        {
          module: 'Test Module',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: true,
        },
      ]

      render(<RecentActivityCard activities={blockedActivity} />)

      expect(screen.getByText(/esta bloqueado/)).toBeInTheDocument()
      expect(screen.queryByText(/esta activo/)).not.toBeInTheDocument()
    })

    it('should correctly display active status', () => {
      const activeActivity: RecentActivity[] = [
        {
          module: 'Test Module',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={activeActivity} />)

      expect(screen.getByText(/esta activo/)).toBeInTheDocument()
      expect(screen.queryByText(/esta bloqueado/)).not.toBeInTheDocument()
    })

    it('should handle all blocked activities', () => {
      const allBlockedActivities: RecentActivity[] = mockActivities.map(activity => ({
        ...activity,
        isBlocked: true,
      }))

      render(<RecentActivityCard activities={allBlockedActivities} />)

      const bloqueadoElements = screen.getAllByText(/esta bloqueado/)
      expect(bloqueadoElements).toHaveLength(3)
      expect(screen.queryByText(/esta activo/)).not.toBeInTheDocument()
    })

    it('should handle all active activities', () => {
      const allActiveActivities: RecentActivity[] = mockActivities.map(activity => ({
        ...activity,
        isBlocked: false,
      }))

      render(<RecentActivityCard activities={allActiveActivities} />)

      const activoElements = screen.getAllByText(/esta activo/)
      expect(activoElements).toHaveLength(3)
      expect(screen.queryByText(/esta bloqueado/)).not.toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle very long module names', () => {
      const longNameActivity: RecentActivity[] = [
        {
          module: 'Very Long Module Name That Might Break The Layout Because It Is Too Long',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={longNameActivity} />)

      expect(
        screen.getByText('Very Long Module Name That Might Break The Layout Because It Is Too Long')
      ).toBeInTheDocument()
    })

    it('should handle special characters in module name', () => {
      const specialCharsActivity: RecentActivity[] = [
        {
          module: 'Module-Name_123 (Test) #1',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={specialCharsActivity} />)

      expect(screen.getByText('Module-Name_123 (Test) #1')).toBeInTheDocument()
    })

    it('should handle unicode characters in module name', () => {
      const unicodeActivity: RecentActivity[] = [
        {
          module: 'Módulo de Autenticación 🔒',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={unicodeActivity} />)

      expect(screen.getByText('Módulo de Autenticación 🔒')).toBeInTheDocument()
    })

    it('should handle very long time strings', () => {
      const longTimeActivity: RecentActivity[] = [
        {
          module: 'Test Module',
          lastModifiedBy: 'admin@example.com',
          time: 'hace exactamente 2 días, 5 horas, 30 minutos y 15 segundos',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={longTimeActivity} />)

      expect(
        screen.getByText('hace exactamente 2 días, 5 horas, 30 minutos y 15 segundos')
      ).toBeInTheDocument()
    })

    it('should handle empty string module name', () => {
      const emptyModuleActivity: RecentActivity[] = [
        {
          module: '',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 1 minuto',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={emptyModuleActivity} />)

      expect(screen.getByText(/Módulo/)).toBeInTheDocument()
      expect(screen.getByText(/esta activo/)).toBeInTheDocument()
    })

    it('should handle empty string time', () => {
      const emptyTimeActivity: RecentActivity[] = [
        {
          module: 'Test Module',
          lastModifiedBy: 'admin@example.com',
          time: '',
          isBlocked: false,
        },
      ]

      const { container } = render(<RecentActivityCard activities={emptyTimeActivity} />)

      const timeElements = container.querySelectorAll('.text-xs')
      expect(timeElements).toHaveLength(1)
      expect(timeElements[0]).toHaveTextContent('')
    })

    it('should handle large number of activities', () => {
      const manyActivities: RecentActivity[] = Array.from({ length: 50 }, (_, i) => ({
        module: `Module ${i + 1}`,
        lastModifiedBy: `user${i}@example.com`,
        time: `hace ${i + 1} minutos`,
        isBlocked: i % 2 === 0,
      }))

      const { container } = render(<RecentActivityCard activities={manyActivities} />)

      const activityItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(activityItems).toHaveLength(50)
    })
  })

  describe('Props validation', () => {
    it('should accept activities prop', () => {
      expect(() => {
        render(<RecentActivityCard activities={mockActivities} />)
      }).not.toThrow()
    })

    it('should be readonly props', () => {
      // TypeScript will enforce this at compile time
      render(<RecentActivityCard activities={mockActivities} />)
      expect(screen.getByText('Actividad Reciente')).toBeInTheDocument()
    })

    it('should handle activities with all required fields', () => {
      const completeActivity: RecentActivity[] = [
        {
          module: 'Complete Module',
          lastModifiedBy: 'admin@example.com',
          time: 'hace 5 minutos',
          isBlocked: false,
        },
      ]

      render(<RecentActivityCard activities={completeActivity} />)

      expect(screen.getByText('Complete Module')).toBeInTheDocument()
      expect(screen.getByText('hace 5 minutos')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      expect(container.querySelector('p')).toBeInTheDocument()
      expect(container.querySelector('span')).toBeInTheDocument()
    })

    it('should maintain text hierarchy', () => {
      const { container } = render(<RecentActivityCard activities={mockActivities} />)

      const paragraphs = container.querySelectorAll('p')
      const spans = container.querySelectorAll('span')

      expect(paragraphs.length).toBeGreaterThan(0)
      expect(spans.length).toBeGreaterThan(0)
    })
  })

  describe('Component rerender', () => {
    it('should update when activities prop changes', () => {
      const { rerender } = render(<RecentActivityCard activities={[mockActivities[0]]} />)

      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.queryByText('Payment Gateway')).not.toBeInTheDocument()

      rerender(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.getByText('Payment Gateway')).toBeInTheDocument()
      expect(screen.getByText('User Management')).toBeInTheDocument()
    })

    it('should clear activities when prop becomes empty', () => {
      const { rerender } = render(<RecentActivityCard activities={mockActivities} />)

      expect(screen.getByText('Authentication')).toBeInTheDocument()

      rerender(<RecentActivityCard activities={[]} />)

      expect(screen.queryByText('Authentication')).not.toBeInTheDocument()
    })
  })
})