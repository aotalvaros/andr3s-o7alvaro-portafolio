import { CityResultItem } from '../../../../components/weather/components/CityResultItem';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CitySearchResult } from '@/types/weather.interface';
import userEvent from '@testing-library/user-event';


describe('CityResultItem', () => {
  const mockOnSelect = vi.fn();

  const createMockResult = (overrides?: Partial<CitySearchResult>): CitySearchResult => ({
    name: 'Bogotá',
    country: 'Colombia',
    state: 'Cundinamarca',
    lat: 4.6097,
    lon: -74.0817,
    ...overrides,
  });

  const defaultProps = {
    result: createMockResult(),
    index: 0,
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render the component', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByTestId('motion-button')).toBeInTheDocument();
    });

    it('should render city name', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByText(/Bogotá/)).toBeInTheDocument();
    });

    it('should render country', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByText('Colombia')).toBeInTheDocument();
    });

    it('should render state when provided', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByText(/Cundinamarca/)).toBeInTheDocument();
    });

    it('should render MapPin icon', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('should display city and state together', () => {
      render(<CityResultItem {...defaultProps} />);

      expect(screen.getByText('Bogotá, Cundinamarca')).toBeInTheDocument();
    });
  });

  describe('Rendering without state', () => {
    it('should render city without state', () => {
      const resultWithoutState = createMockResult({ state: undefined });
      
      render(
        <CityResultItem
          result={resultWithoutState}
          index={0}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Bogotá')).toBeInTheDocument();
      expect(screen.queryByText(/,/)).not.toBeInTheDocument();
    });

    it('should not render comma when state is missing', () => {
      const resultWithoutState = createMockResult({ state: undefined });
      
      render(
        <CityResultItem
          result={resultWithoutState}
          index={0}
          onSelect={mockOnSelect}
        />
      );

      const cityText = screen.getByText('Bogotá');
      expect(cityText.textContent).toBe('Bogotá');
    });

    it('should handle empty string state', () => {
      const resultWithEmptyState = createMockResult({ state: '' });
      
      render(
        <CityResultItem
          result={resultWithEmptyState}
          index={0}
          onSelect={mockOnSelect}
        />
      );

      // Empty string is falsy, so it shouldn't render
      expect(screen.getByText('Bogotá')).toBeInTheDocument();
    });
  });

  describe('Click interaction', () => {
    it('should call onSelect when clicked', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      fireEvent.mouseDown(button);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.result);
    });

    it('should prevent default on mouseDown', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      const event = new MouseEvent('mousedown', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(button, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle multiple clicks', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      
      fireEvent.mouseDown(button);
      fireEvent.mouseDown(button);
      fireEvent.mouseDown(button);

      expect(mockOnSelect).toHaveBeenCalledTimes(3);
    });

    it('should pass correct result on click', () => {
      const customResult = createMockResult({
        name: 'Medellín',
        country: 'Colombia',
        state: 'Antioquia',
      });

      render(
        <CityResultItem
          result={customResult}
          index={0}
          onSelect={mockOnSelect}
        />
      );

      const button = screen.getByTestId('motion-button');
      fireEvent.mouseDown(button);

      expect(mockOnSelect).toHaveBeenCalledWith(customResult);
    });
  });

  describe('Styling classes', () => {
    it('should apply correct classes to button', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      expect(button).toHaveClass(
        'w-full',
        'flex',
        'items-center',
        'gap-3',
        'px-4',
        'py-3',
        'hover:bg-primary/10',
        'transition-colors',
        'group'
      );
    });

    it('should apply correct classes to icon wrapper', () => {
      const { container } = render(<CityResultItem {...defaultProps} />);

      const iconWrapper = container.querySelector('.h-10.w-10');
      expect(iconWrapper).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'rounded-lg',
        'bg-primary/10',
        'text-primary',
        'group-hover:bg-primary',
        'group-hover:text-primary-foreground',
        'transition-all'
      );
    });

    it('should apply correct classes to MapPin icon', () => {
      render(<CityResultItem {...defaultProps} />);

      const icon = screen.getByTestId('map-pin-icon');
      expect(icon).toHaveClass('h-5', 'w-5');
    });

    it('should apply text-left to content wrapper', () => {
      const { container } = render(<CityResultItem {...defaultProps} />);

      const contentWrapper = container.querySelector('.flex-1.text-left');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('should apply correct classes to city name', () => {
      const { container } = render(<CityResultItem {...defaultProps} />);

      const cityName = container.querySelector('.font-medium.text-sm');
      expect(cityName).toBeInTheDocument();
    });

    it('should apply correct classes to country', () => {
      const { container } = render(<CityResultItem {...defaultProps} />);

      const country = container.querySelector('.text-xs.text-muted-foreground');
      expect(country).toBeInTheDocument();
    });
  });

  describe('Different city data', () => {
    it('should render city from different country', () => {
      const result = createMockResult({
        name: 'Paris',
        country: 'France',
        state: 'Île-de-France',
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      expect(screen.getByText('Paris, Île-de-France')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });

    it('should handle special characters in city name', () => {
      const result = createMockResult({
        name: 'São Paulo',
        country: 'Brazil',
        state: 'São Paulo',
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      expect(screen.getByText('São Paulo, São Paulo')).toBeInTheDocument();
    });

    it('should handle long city and state names', () => {
      const result = createMockResult({
        name: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
        country: 'United Kingdom',
        state: 'Wales',
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      expect(
        screen.getByText(/Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch/)
      ).toBeInTheDocument();
    });
  });

  describe('Coordinates handling', () => {
    it('should accept result with coordinates', () => {
      const result = createMockResult({
        lat: 40.7128,
        lon: -74.0060,
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      expect(screen.getByTestId('motion-button')).toBeInTheDocument();
    });

    it('should pass coordinates in result when clicked', () => {
      const result = createMockResult({
        name: 'New York',
        lat: 40.7128,
        lon: -74.0060,
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      fireEvent.mouseDown(screen.getByTestId('motion-button'));

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: 40.7128,
          lon: -74.0060,
        })
      );
    });
  });

  describe('Integration', () => {
    it('should render complete component structure', () => {
      const { container } = render(<CityResultItem {...defaultProps} />);

      // Button
      expect(screen.getByTestId('motion-button')).toBeInTheDocument();

      // Icon wrapper
      expect(container.querySelector('.h-10.w-10')).toBeInTheDocument();

      // Icon
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();

      // Content
      expect(screen.getByText('Bogotá, Cundinamarca')).toBeInTheDocument();
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render as button element', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have visible text content', async() => {
        render(<CityResultItem {...defaultProps} />);
        const user = userEvent.setup();

        const button = screen.getByTestId('motion-button');
        await user.tab();
        expect(button).toHaveFocus();
        expect(screen.getByText('Bogotá, Cundinamarca')).toBeVisible();
        expect(screen.getByText('Colombia')).toBeVisible();
    });

    it('should be keyboard accessible as a button', () => {
      render(<CityResultItem {...defaultProps} />);

      const button = screen.getByTestId('motion-button');
      expect(button.tagName).toBe('BUTTON');
      // Buttons are inherently keyboard accessible
    });
  });

  describe('Edge cases', () => {
    it('should handle result with no state gracefully', () => {
      const result: CitySearchResult = {
        name: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lon: 139.6503,
      };

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      expect(screen.getByText('Tokyo')).toBeInTheDocument();
      expect(screen.getByText('Japan')).toBeInTheDocument();
    });

    it('should handle negative coordinates', () => {
      const result = createMockResult({
        lat: -33.8688,
        lon: 151.2093,
      });

      render(<CityResultItem result={result} index={0} onSelect={mockOnSelect} />);

      fireEvent.mouseDown(screen.getByTestId('motion-button'));

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: -33.8688,
          lon: 151.2093,
        })
      );
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<CityResultItem {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<CityResultItem {...defaultProps} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <CityResultItem
            {...defaultProps}
            result={createMockResult({ name: `City ${i}` })}
          />
        );
      }

      expect(screen.getByTestId('motion-button')).toBeInTheDocument();
    });
  });
});