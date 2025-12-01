/* eslint-disable @typescript-eslint/no-explicit-any */
import { APILimitWarning } from '../../../../components/weather/components/APILimitWarning';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';


vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

describe('APILimitWarning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render the component', () => {
      render(<APILimitWarning />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render the main title', () => {
      render(<APILimitWarning />);

      expect(screen.getByText('Límite de API Alcanzado')).toBeInTheDocument();
    });

    it('should render the warning message', () => {
      render(<APILimitWarning />);

      expect(
        screen.getByText(/Este módulo utiliza la API gratuita de OpenWeatherMap/)
      ).toBeInTheDocument();
    });

    it('should render the complete warning description', () => {
      render(<APILimitWarning />);

      const description = screen.getByText(
        /Este módulo utiliza la API gratuita de OpenWeatherMap, que tiene un límite de 1,000 llamadas por día/
      );
      expect(description).toBeInTheDocument();
    });

    it('should render the tip section', () => {
      render(<APILimitWarning />);

      expect(screen.getByText(/💡 Tip:/)).toBeInTheDocument();
      expect(
        screen.getByText(/El límite se restablece cada 24 horas/)
      ).toBeInTheDocument();
    });

    it('should render the AlertCircle icon', () => {
      render(<APILimitWarning />);

      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    });

    it('should render the ExternalLink icon', () => {
      render(<APILimitWarning />);

      expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
    });
  });

  describe('Card styling', () => {
    it('should apply correct gradient and border classes to card', () => {
      render(<APILimitWarning />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'p-6',
        'bg-gradient-to-br',
        'from-yellow-50',
        'to-orange-50',
        'dark:from-yellow-950/20',
        'dark:to-orange-950/20',
        'border-2',
        'border-yellow-300',
        'dark:border-yellow-900'
      );
    });

    it('should have margin bottom on wrapper div', () => {
      const { container } = render(<APILimitWarning />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('mb-6');
    });
  });

  describe('Icon styling', () => {
    it('should apply correct classes to AlertCircle icon', () => {
      render(<APILimitWarning />);

      const icon = screen.getByTestId('alert-circle-icon');
      expect(icon).toHaveClass(
        'h-6',
        'w-6',
        'text-yellow-600',
        'dark:text-yellow-400'
      );
    });

    it('should have icon wrapper with correct styling', () => {
      const { container } = render(<APILimitWarning />);

      const iconWrapper = container.querySelector('.p-3.rounded-full');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('bg-yellow-500/20', 'flex-shrink-0');
    });

    it('should apply correct classes to ExternalLink icon', () => {
      render(<APILimitWarning />);

      const icon = screen.getByTestId('external-link-icon');
      expect(icon).toHaveClass('h-4', 'w-4');
    });
  });

  describe('Title styling', () => {
    it('should apply correct classes to title', () => {
      render(<APILimitWarning />);

      const title = screen.getByText('Límite de API Alcanzado');
      expect(title).toHaveClass(
        'text-lg',
        'font-bold',
        'text-yellow-700',
        'dark:text-yellow-300',
        'mb-2'
      );
    });
  });

  describe('Description styling', () => {
    it('should apply correct classes to description', () => {
      render(<APILimitWarning />);

      const description = screen.getByText(
        /Este módulo utiliza la API gratuita de OpenWeatherMap/
      );
      expect(description).toHaveClass(
        'text-sm',
        'text-yellow-600',
        'dark:text-yellow-400',
        'mb-3'
      );
    });
  });

  describe('Tip section', () => {
    it('should render tip with strong tag', () => {
      render(<APILimitWarning />);

      const tipLabel = screen.getByText('💡 Tip:');
      expect(tipLabel.tagName).toBe('STRONG');
    });

    it('should apply correct classes to tip container', () => {
      const { container } = render(<APILimitWarning />);

      const tipContainer = container.querySelector('.text-xs.p-3.rounded-lg');
      expect(tipContainer).toHaveClass(
        'text-yellow-700',
        'dark:text-yellow-300',
        'bg-yellow-500/10'
      );
    });

    it('should display complete tip message', () => {
      render(<APILimitWarning />);

      expect(
        screen.getByText(
          /El límite se restablece cada 24 horas. Vuelve más tarde para continuar explorando el clima./
        )
      ).toBeInTheDocument();
    });
  });

  describe('External link', () => {
    it('should render link with correct href', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      expect(link).toHaveAttribute('href', 'https://openweathermap.org/price');
    });

    it('should open link in new tab', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should have rel="noopener noreferrer" for security', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display correct link text', () => {
      render(<APILimitWarning />);

      expect(
        screen.getByText('Ver planes de OpenWeatherMap')
      ).toBeInTheDocument();
    });

    it('should apply correct classes to link', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      expect(link).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'px-4',
        'py-2',
        'rounded-lg',
        'bg-yellow-600',
        'hover:bg-yellow-700',
        'text-white',
        'text-sm',
        'font-medium',
        'transition-colors'
      );
    });

    it('should contain ExternalLink icon inside link', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      const icon = screen.getByTestId('external-link-icon');
      
      expect(link).toContainElement(icon);
    });
  });

  describe('Layout structure', () => {
    it('should have flex container with correct gap', () => {
      const { container } = render(<APILimitWarning />);

      const flexContainer = container.querySelector('.flex.items-start.gap-4');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have flex-1 class on content div', () => {
      const { container } = render(<APILimitWarning />);

      const contentDiv = container.querySelector('.flex-1');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should have responsive flex layout for bottom section', () => {
      const { container } = render(<APILimitWarning />);

      const bottomSection = container.querySelector(
        '.flex.flex-col.sm\\:flex-row.gap-3'
      );
      expect(bottomSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading for title', () => {
      render(<APILimitWarning />);

      const heading = screen.getByText('Límite de API Alcanzado');
      expect(heading.tagName).toBe('H3');
    });

    it('should have descriptive link text', () => {
      render(<APILimitWarning />);

      const link = screen.getByText('Ver planes de OpenWeatherMap');
      expect(link).toBeVisible();
    });

    it('should have accessible link structure', () => {
      render(<APILimitWarning />);

      const link = screen.getByTestId('openweathermap-plans-link');
      expect(link.tagName).toBe('A');
    });

    it('should have visible and readable text content', () => {
      render(<APILimitWarning />);

      expect(screen.getByText('Límite de API Alcanzado')).toBeVisible();
      expect(
        screen.getByText(/Este módulo utiliza la API gratuita/)
      ).toBeVisible();
      expect(screen.getByText(/💡 Tip:/)).toBeVisible();
    });
  });

  describe('Content completeness', () => {
    it('should mention 1,000 calls per day limit', () => {
      render(<APILimitWarning />);

      expect(
        screen.getByText(/1,000 llamadas por día/)
      ).toBeInTheDocument();
    });

    it('should mention 24 hours reset time', () => {
      render(<APILimitWarning />);

      expect(screen.getByText(/24 horas/)).toBeInTheDocument();
    });


    it('should indicate limit has been reached', () => {
      render(<APILimitWarning />);

      expect(
        screen.getByText(/El límite ha sido alcanzado temporalmente/)
      ).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render complete component structure', () => {
      const { container } = render(<APILimitWarning />);

      // Wrapper
      expect(container.firstChild).toHaveClass('mb-6');

      // Card
      expect(screen.getByTestId('card')).toBeInTheDocument();

      // Icon
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();

      // Title
      expect(screen.getByText('Límite de API Alcanzado')).toBeInTheDocument();

      // Description
      expect(
        screen.getByText(/Este módulo utiliza la API gratuita/)
      ).toBeInTheDocument();

      // Tip
      expect(screen.getByText(/💡 Tip:/)).toBeInTheDocument();

      // Link
      expect(
        screen.getByTestId('openweathermap-plans-link')
      ).toBeInTheDocument();
    });

    it('should have all elements visible', () => {
      render(<APILimitWarning />);

      expect(screen.getByTestId('alert-circle-icon')).toBeVisible();
      expect(screen.getByText('Límite de API Alcanzado')).toBeVisible();
      expect(
        screen.getByText('Ver planes de OpenWeatherMap')
      ).toBeVisible();
    });

    it('should maintain proper hierarchy', () => {
      const { container } = render(<APILimitWarning />);

      const wrapper = container.firstChild;
      const card = screen.getByTestId('card');
      const title = screen.getByText('Límite de API Alcanzado');

      expect(wrapper).toContainElement(card);
      expect(card).toContainElement(title);
    });
  });

  describe('Dark mode support', () => {
    it('should have dark mode classes on card', () => {
      render(<APILimitWarning />);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('dark:from-yellow-950/20');
      expect(card.className).toContain('dark:to-orange-950/20');
      expect(card.className).toContain('dark:border-yellow-900');
    });

    it('should have dark mode classes on title', () => {
      render(<APILimitWarning />);

      const title = screen.getByText('Límite de API Alcanzado');
      expect(title.className).toContain('dark:text-yellow-300');
    });

    it('should have dark mode classes on description', () => {
      render(<APILimitWarning />);

      const description = screen.getByText(
        /Este módulo utiliza la API gratuita/
      );
      expect(description.className).toContain('dark:text-yellow-400');
    });

    it('should have dark mode classes on tip', () => {
      const { container } = render(<APILimitWarning />);

      const tipContainer = container.querySelector('.text-xs.p-3.rounded-lg');
      expect(tipContainer?.className).toContain('dark:text-yellow-300');
    });
  });

  describe('Edge cases', () => {
    it('should render without errors', () => {
      expect(() => render(<APILimitWarning />)).not.toThrow();
    });

    it('should handle multiple renders', () => {
      const { rerender } = render(<APILimitWarning />);
      
      rerender(<APILimitWarning />);
      rerender(<APILimitWarning />);

      expect(screen.getByText('Límite de API Alcanzado')).toBeInTheDocument();
    });

    it('should maintain structure after unmount and remount', () => {
      const { unmount } = render(<APILimitWarning />);
      
      unmount();
      
      render(<APILimitWarning />);

      expect(screen.getByText('Límite de API Alcanzado')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<APILimitWarning />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<APILimitWarning />);

      expect(() => unmount()).not.toThrow();
    });
  });
});