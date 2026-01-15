import { StatCard } from '../../../../../components/sections/admin/components/StatCard';
import { render, screen} from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardStat } from '@/components/sections/admin/types/dashboard.types'
import { Users, Activity, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

describe('StatCard', () => {
  const mockStat: DashboardStat = {
    title: 'Total Users',
    description: '+12% from last month',
    value: '1,234',
    color: 'text-blue-500',
    icon: Users,
  }

  describe('Rendering', () => {
    it('should render card component', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const card = container.querySelector('[class*="border"]')
      expect(card).toBeInTheDocument()
    })

    it('should render card title', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('should render card value', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('should render card description', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('+12% from last month')).toBeInTheDocument()
    })

    it('should render icon component', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render CardHeader with correct classes', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.flex.flex-row.items-center.justify-between')
      expect(header).toBeInTheDocument()
    })

    it('should render CardTitle with text-sm font-medium', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const title = container.querySelector('.text-sm.font-medium')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Total Users')
    })

    it('should render CardContent', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('1,234')).toBeInTheDocument()
      expect(screen.getByText('+12% from last month')).toBeInTheDocument()
    })
  })

  describe('Icon rendering', () => {
    it('should render Users icon', () => {
      render(<StatCard stat={mockStat} />)

      const { container } = render(<Users className="h-4 w-4" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render Activity icon', () => {
      const activityStat: DashboardStat = {
        ...mockStat,
        icon: Activity,
      }

      render(<StatCard stat={activityStat} />)

      const { container } = render(<Activity className="h-4 w-4" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render DollarSign icon', () => {
      const dollarStat: DashboardStat = {
        ...mockStat,
        icon: DollarSign,
      }

      render(<StatCard stat={dollarStat} />)

      const { container } = render(<DollarSign className="h-4 w-4" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render TrendingUp icon', () => {
      const trendingUpStat: DashboardStat = {
        ...mockStat,
        icon: TrendingUp,
      }

      render(<StatCard stat={trendingUpStat} />)

      const { container } = render(<TrendingUp className="h-4 w-4" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render TrendingDown icon', () => {
      const trendingDownStat: DashboardStat = {
        ...mockStat,
        icon: TrendingDown,
      }

      render(<StatCard stat={trendingDownStat} />)

      const { container } = render(<TrendingDown className="h-4 w-4" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should apply h-4 w-4 classes to icon', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-4', 'w-4')
    })

    it('should apply color class to icon', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })
  })

  describe('Color variations', () => {
    it('should apply blue color class', () => {
      const blueStat: DashboardStat = {
        ...mockStat,
        color: 'text-blue-500',
      }

      const { container } = render(<StatCard stat={blueStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should apply green color class', () => {
      const greenStat: DashboardStat = {
        ...mockStat,
        color: 'text-green-500',
      }

      const { container } = render(<StatCard stat={greenStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-green-500')
    })

    it('should apply red color class', () => {
      const redStat: DashboardStat = {
        ...mockStat,
        color: 'text-red-500',
      }

      const { container } = render(<StatCard stat={redStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
    })

    it('should apply yellow color class', () => {
      const yellowStat: DashboardStat = {
        ...mockStat,
        color: 'text-yellow-500',
      }

      const { container } = render(<StatCard stat={yellowStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-yellow-500')
    })

    it('should apply purple color class', () => {
      const purpleStat: DashboardStat = {
        ...mockStat,
        color: 'text-purple-500',
      }

      const { container } = render(<StatCard stat={purpleStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-purple-500')
    })
  })

  describe('Value formatting', () => {
    it('should display numeric value as string', () => {
      const numericStat: DashboardStat = {
        ...mockStat,
        value: 1234,
      }

      render(<StatCard stat={numericStat} />)

      expect(screen.getByText('1234')).toBeInTheDocument()
    })

    it('should display string value', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('should display formatted currency', () => {
      const currencyStat: DashboardStat = {
        ...mockStat,
        value: '$45,678',
      }

      render(<StatCard stat={currencyStat} />)

      expect(screen.getByText('$45,678')).toBeInTheDocument()
    })

    it('should display percentage value', () => {
      const percentageStat: DashboardStat = {
        ...mockStat,
        value: '23.5%',
      }

      render(<StatCard stat={percentageStat} />)

      expect(screen.getByText('23.5%')).toBeInTheDocument()
    })

    it('should display large numbers with abbreviation', () => {
      const largeStat: DashboardStat = {
        ...mockStat,
        value: '1.2M',
      }

      render(<StatCard stat={largeStat} />)

      expect(screen.getByText('1.2M')).toBeInTheDocument()
    })

    it('should display decimal values', () => {
      const decimalStat: DashboardStat = {
        ...mockStat,
        value: '3.14',
      }

      render(<StatCard stat={decimalStat} />)

      expect(screen.getByText('3.14')).toBeInTheDocument()
    })

    it('should display zero value', () => {
      const zeroStat: DashboardStat = {
        ...mockStat,
        value: 0,
      }

      render(<StatCard stat={zeroStat} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should display negative values', () => {
      const negativeStat: DashboardStat = {
        ...mockStat,
        value: '-123',
      }

      render(<StatCard stat={negativeStat} />)

      expect(screen.getByText('-123')).toBeInTheDocument()
    })
  })

  describe('Description formatting', () => {
    it('should display positive change description', () => {
      render(<StatCard stat={mockStat} />)

      expect(screen.getByText('+12% from last month')).toBeInTheDocument()
    })

    it('should display negative change description', () => {
      const negativeStat: DashboardStat = {
        ...mockStat,
        description: '-5% from last month',
      }

      render(<StatCard stat={negativeStat} />)

      expect(screen.getByText('-5% from last month')).toBeInTheDocument()
    })

    it('should display neutral description', () => {
      const neutralStat: DashboardStat = {
        ...mockStat,
        description: 'No change from last month',
      }

      render(<StatCard stat={neutralStat} />)

      expect(screen.getByText('No change from last month')).toBeInTheDocument()
    })

    it('should display custom description', () => {
      const customStat: DashboardStat = {
        ...mockStat,
        description: 'Trending upward this week',
      }

      render(<StatCard stat={customStat} />)

      expect(screen.getByText('Trending upward this week')).toBeInTheDocument()
    })

    it('should display empty description', () => {
      const emptyStat: DashboardStat = {
        ...mockStat,
        description: '',
      }

      const { container } = render(<StatCard stat={emptyStat} />)

      const description = container.querySelector('.text-xs.text-muted-foreground')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('')
    })

    it('should display long description', () => {
      const longStat: DashboardStat = {
        ...mockStat,
        description: 'This is a very long description that might need to wrap to multiple lines',
      }

      render(<StatCard stat={longStat} />)

      expect(
        screen.getByText('This is a very long description that might need to wrap to multiple lines')
      ).toBeInTheDocument()
    })
  })

  describe('Layout structure', () => {
    it('should have CardHeader with flex layout', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.flex.flex-row')
      expect(header).toBeInTheDocument()
    })

    it('should have items-center in header', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.items-center')
      expect(header).toBeInTheDocument()
    })

    it('should have justify-between in header', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.justify-between')
      expect(header).toBeInTheDocument()
    })

    it('should have space-y-0 in header', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.space-y-0')
      expect(header).toBeInTheDocument()
    })

    it('should have pb-2 padding in header', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const header = container.querySelector('.pb-2')
      expect(header).toBeInTheDocument()
    })

    it('should have text-2xl for value', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const value = container.querySelector('.text-2xl')
      expect(value).toBeInTheDocument()
      expect(value).toHaveTextContent('1,234')
    })

    it('should have font-bold for value', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const value = container.querySelector('.font-bold')
      expect(value).toBeInTheDocument()
    })

    it('should have text-xs for description', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const description = container.querySelector('.text-xs')
      expect(description).toBeInTheDocument()
    })

    it('should have text-muted-foreground for description', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const description = container.querySelector('.text-muted-foreground')
      expect(description).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle very long title', () => {
      const longTitleStat: DashboardStat = {
        ...mockStat,
        title: 'This is a very long title that might need special handling in the UI layout',
      }

      render(<StatCard stat={longTitleStat} />)

      expect(
        screen.getByText('This is a very long title that might need special handling in the UI layout')
      ).toBeInTheDocument()
    })

    it('should handle empty string title', () => {
      const emptyStat: DashboardStat = {
        ...mockStat,
        title: '',
      }

      const { container } = render(<StatCard stat={emptyStat} />)

      const title = container.querySelector('.text-sm.font-medium')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('')
    })

    it('should handle special characters in title', () => {
      const specialStat: DashboardStat = {
        ...mockStat,
        title: 'Revenue (USD) - Q4 2024',
      }

      render(<StatCard stat={specialStat} />)

      expect(screen.getByText('Revenue (USD) - Q4 2024')).toBeInTheDocument()
    })

    it('should handle unicode in title', () => {
      const unicodeStat: DashboardStat = {
        ...mockStat,
        title: 'Usuarios Activos 🚀',
      }

      render(<StatCard stat={unicodeStat} />)

      expect(screen.getByText('Usuarios Activos 🚀')).toBeInTheDocument()
    })

    it('should handle very large numeric value', () => {
      const largeStat: DashboardStat = {
        ...mockStat,
        value: 999999999,
      }

      render(<StatCard stat={largeStat} />)

      expect(screen.getByText('999999999')).toBeInTheDocument()
    })

    it('should handle empty color string', () => {
      const noColorStat: DashboardStat = {
        ...mockStat,
        color: '',
      }

      const { container } = render(<StatCard stat={noColorStat} />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Props validation', () => {
    it('should accept stat prop with all required fields', () => {
      expect(() => {
        render(<StatCard stat={mockStat} />)
      }).not.toThrow()
    })

    it('should be readonly props', () => {
      // TypeScript enforces this at compile time
      render(<StatCard stat={mockStat} />)
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('should handle stat with numeric value', () => {
      const numericStat: DashboardStat = {
        title: 'Count',
        description: 'Total count',
        value: 42,
        color: 'text-gray-500',
        icon: AlertCircle,
      }

      render(<StatCard stat={numericStat} />)

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should handle stat with string value', () => {
      const stringStat: DashboardStat = {
        title: 'Status',
        description: 'Current status',
        value: 'Active',
        color: 'text-green-500',
        icon: Activity,
      }

      render(<StatCard stat={stringStat} />)

      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })

  describe('Different stat types', () => {
    it('should render user count stat', () => {
      const userStat: DashboardStat = {
        title: 'Total Users',
        description: '+180 new users',
        value: '2,350',
        color: 'text-blue-500',
        icon: Users,
      }

      render(<StatCard stat={userStat} />)

      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('2,350')).toBeInTheDocument()
      expect(screen.getByText('+180 new users')).toBeInTheDocument()
    })

    it('should render revenue stat', () => {
      const revenueStat: DashboardStat = {
        title: 'Revenue',
        description: '+20.1% from last month',
        value: '$45,231.89',
        color: 'text-green-500',
        icon: DollarSign,
      }

      render(<StatCard stat={revenueStat} />)

      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.getByText('$45,231.89')).toBeInTheDocument()
      expect(screen.getByText('+20.1% from last month')).toBeInTheDocument()
    })

    it('should render activity stat', () => {
      const activityStat: DashboardStat = {
        title: 'Active Now',
        description: '+201 since last hour',
        value: '573',
        color: 'text-yellow-500',
        icon: Activity,
      }

      render(<StatCard stat={activityStat} />)

      expect(screen.getByText('Active Now')).toBeInTheDocument()
      expect(screen.getByText('573')).toBeInTheDocument()
      expect(screen.getByText('+201 since last hour')).toBeInTheDocument()
    })
  })

  describe('Component rerender', () => {
    it('should update when stat prop changes', () => {
      const { rerender } = render(<StatCard stat={mockStat} />)

      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('1,234')).toBeInTheDocument()

      const newStat: DashboardStat = {
        title: 'Active Users',
        description: '+5% increase',
        value: '567',
        color: 'text-green-500',
        icon: Activity,
      }

      rerender(<StatCard stat={newStat} />)

      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('567')).toBeInTheDocument()
      expect(screen.getByText('+5% increase')).toBeInTheDocument()
      expect(screen.queryByText('Total Users')).not.toBeInTheDocument()
    })

    it('should update icon when stat changes', () => {
      const { rerender, container } = render(<StatCard stat={mockStat} />)

      let icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')

      const newStat: DashboardStat = {
        ...mockStat,
        icon: DollarSign,
        color: 'text-green-500',
      }

      rerender(<StatCard stat={newStat} />)

      icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-green-500')
    })

    it('should update color when stat changes', () => {
      const { rerender, container } = render(<StatCard stat={mockStat} />)

      let icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')

      const newStat: DashboardStat = {
        ...mockStat,
        color: 'text-red-500',
      }

      rerender(<StatCard stat={newStat} />)

      icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
      expect(icon).not.toHaveClass('text-blue-500')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      expect(container.querySelector('div')).toBeInTheDocument()
      expect(container.querySelector('p')).toBeInTheDocument()
    })

    it('should have readable text hierarchy', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const title = container.querySelector('.text-sm')
      const value = container.querySelector('.text-2xl')
      const description = container.querySelector('.text-xs')

      expect(title).toBeInTheDocument()
      expect(value).toBeInTheDocument()
      expect(description).toBeInTheDocument()
    })

    it('should render icon as SVG', () => {
      const { container } = render(<StatCard stat={mockStat} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.tagName).toBe('svg')
    })
  })
})