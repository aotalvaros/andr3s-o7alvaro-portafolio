/* eslint-disable @typescript-eslint/no-explicit-any */
import { AirQualityCard } from '../../../../components/weather/components/AirQualityCard';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AirQuality } from '@/types/weather.interface';
import { getAQILevel } from '@/services/weather/utils/weatherHelpers';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

// Mock weather helpers
vi.mock('@/services/weather/utils/weatherHelpers', () => ({
  getAQILevel: vi.fn(),
}));

describe('AirQualityCard', () => {
  const mockGetAQILevel = vi.mocked(getAQILevel);

  const createMockAirQuality = (aqi: number): AirQuality => ({
    aqi,
    components: {
        co: 320.5,
        no: 15.2,
        no2: 18.2,
        o3: 45.7,
        so2: 8.4,
        pm2_5: 12.5,
        pm10: 25.3,
        nh3: 5.1,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render the card component', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render the title', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.getByText('Calidad del Aire')).toBeInTheDocument();
    });

    it('should render the Wind icon', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.getByTestId('wind-icon')).toBeInTheDocument();
    });

    it('should apply correct classes to card', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-6', 'bg-gradient-to-br', 'from-background', 'to-muted/30', 'border-2');
    });
  });

  describe('AQI information display', () => {
    it('should call getAQILevel with correct aqi value', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(2)} />);

      expect(mockGetAQILevel).toHaveBeenCalledWith(2);
      expect(mockGetAQILevel).toHaveBeenCalledTimes(1);
    });

    it('should display AQI label from getAQILevel', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Moderate',
        description: 'Air quality is acceptable',
        color: 'text-yellow-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(2)} />);

      expect(screen.getByText('Moderate')).toBeInTheDocument();
    });

    it('should display AQI description from getAQILevel', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.getByText('Air quality is satisfactory')).toBeInTheDocument();
    });

    it('should apply color class to AQI label', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Unhealthy',
        description: 'Air quality is unhealthy',
        color: 'text-red-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(4)} />);

      const label = screen.getByText('Unhealthy');
      expect(label).toHaveClass('text-3xl', 'font-bold', 'text-red-500');
    });

    it('should display AQI value in format "ICA: X/5"', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(3)} />);

      expect(screen.getByText('ICA: 3/5')).toBeInTheDocument();
    });

    it('should handle different AQI levels', () => {
      const aqiLevels = [1, 2, 3, 4, 5];

      aqiLevels.forEach((aqi) => {
        mockGetAQILevel.mockReturnValue({
          label: `Level ${aqi}`,
          description: `Description ${aqi}`,
          color: 'text-blue-500',
        });

        const { unmount } = render(<AirQualityCard airQuality={createMockAirQuality(aqi)} />);

        expect(screen.getByText(`ICA: ${aqi}/5`)).toBeInTheDocument();
        expect(mockGetAQILevel).toHaveBeenCalledWith(aqi);

        unmount();
      });
    });
  });

  describe('Warning alert display', () => {
    it('should show alert when AQI is 3', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Moderate',
        description: 'Air quality is moderate',
        color: 'text-yellow-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(3)} />);

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(
        screen.getByText('Grupos sensibles deberían limitar actividades prolongadas al aire libre')
      ).toBeInTheDocument();
    });

    it('should show alert when AQI is 4', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Unhealthy',
        description: 'Air quality is unhealthy',
        color: 'text-red-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(4)} />);

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });

    it('should show alert when AQI is 5', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Very Unhealthy',
        description: 'Air quality is very unhealthy',
        color: 'text-red-700',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(5)} />);

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });

    it('should not show alert when AQI is 1', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is good',
        color: 'text-green-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.queryByTestId('alert-triangle-icon')).not.toBeInTheDocument();
    });

    it('should not show alert when AQI is 2', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Fair',
        description: 'Air quality is fair',
        color: 'text-yellow-300',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(2)} />);

      expect(screen.queryByTestId('alert-triangle-icon')).not.toBeInTheDocument();
    });

    it('should apply correct styling to alert', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Moderate',
        description: 'Air quality is moderate',
        color: 'text-yellow-500',
      });

      const { container } = render(<AirQualityCard airQuality={createMockAirQuality(3)} />);

      const alertDiv = container.querySelector('.bg-orange-500\\/10');
      expect(alertDiv).toBeInTheDocument();
      expect(alertDiv).toHaveClass('border', 'border-orange-500/20');
    });
  });

  describe('Pollutants grid display', () => {
    const airQuality = createMockAirQuality(2);

    beforeEach(() => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is good',
        color: 'text-green-500',
      });
    });

    it('should render all 6 pollutants', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('PM2.5')).toBeInTheDocument();
      expect(screen.getByText('PM10')).toBeInTheDocument();
      expect(screen.getByText('O₃')).toBeInTheDocument();
      expect(screen.getByText('NO₂')).toBeInTheDocument();
      expect(screen.getByText('SO₂')).toBeInTheDocument();
      expect(screen.getByText('CO')).toBeInTheDocument();
    });

    it('should display pollutant descriptions', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('Partículas finas')).toBeInTheDocument();
      expect(screen.getByText('Partículas gruesas')).toBeInTheDocument();
      expect(screen.getByText('Ozono')).toBeInTheDocument();
      expect(screen.getByText('Dióxido de nitrógeno')).toBeInTheDocument();
      expect(screen.getByText('Dióxido de azufre')).toBeInTheDocument();
      expect(screen.getByText('Monóxido de carbono')).toBeInTheDocument();
    });

    it('should display PM2.5 value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('12.5 μg/m³')).toBeInTheDocument();
    });

    it('should display PM10 value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('25.3 μg/m³')).toBeInTheDocument();
    });

    it('should display O3 value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('45.7 μg/m³')).toBeInTheDocument();
    });

    it('should display NO2 value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('18.2 μg/m³')).toBeInTheDocument();
    });

    it('should display SO2 value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('8.4 μg/m³')).toBeInTheDocument();
    });

    it('should display CO value with correct format', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      expect(screen.getByText('320.5 μg/m³')).toBeInTheDocument();
    });

    it('should format pollutant values to 1 decimal place', () => {
      const testAirQuality: AirQuality = {
        aqi: 1,
        components: {
            pm2_5: 12.567,
            pm10: 25.321,
            o3: 45.789,
            no2: 18.234,
            so2: 8.456,
            co: 320.567,
            nh3: 5.123,
            no: 15.234,
        }
      };

      render(<AirQualityCard airQuality={testAirQuality} />);

      expect(screen.getByText('12.6 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('25.3 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('45.8 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('18.2 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('8.5 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('320.6 μg/m³')).toBeInTheDocument();
    });

    it('should display correct units for all pollutants', () => {
      render(<AirQualityCard airQuality={airQuality} />);

      const units = screen.getAllByText(/μg\/m³/);
      expect(units).toHaveLength(6);
    });

    it('should apply grid layout classes', () => {
      const { container } = render(<AirQualityCard airQuality={airQuality} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'gap-3');
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      mockGetAQILevel.mockReturnValue({
        label: 'Test',
        description: 'Test description',
        color: 'text-blue-500',
      });
    });

    it('should handle zero values for pollutants', () => {
      const zeroAirQuality: AirQuality = {
        aqi: 1,
        components: {
            pm2_5: 0,
            pm10: 0,
            o3: 0,
            no2: 0,
            so2: 0,
            co: 0,  
            nh3: 0,
            no: 0,
        },
      };

      render(<AirQualityCard airQuality={zeroAirQuality} />);

      const zeroValues = screen.getAllByText('0.0 μg/m³');
      expect(zeroValues).toHaveLength(6);
    });

    it('should handle very large pollutant values', () => {
      const largeAirQuality: AirQuality = {
        aqi: 5,
        components: {
            pm2_5: 999.9,
            pm10: 888.8,
            o3: 777.7,
            no2: 666.6,
            so2: 555.5,
            co: 9999.9,
            nh3: 444.4,
            no: 333.3,
        },
      };

      render(<AirQualityCard airQuality={largeAirQuality} />);

      expect(screen.getByText('999.9 μg/m³')).toBeInTheDocument();
      expect(screen.getByText('9999.9 μg/m³')).toBeInTheDocument();
    });

    it('should handle decimal values correctly', () => {
        const decimalAirQuality: AirQuality = {
            aqi: 2,
            components: {
                pm2_5: 0.123,
                pm10: 0.045,
                o3: 2.678,
                no2: 2.567,
                so2: 3.456,
                co: 0.098,
                nh3: 1.234,
                no: 0.567,
            },
        };

        render(<AirQualityCard airQuality={decimalAirQuality} />);

        expect(screen.getByTestId('pollutant-value-PM2.5').textContent).toBe('0.1 μg/m³');
        expect(screen.getByTestId('pollutant-value-PM10').textContent).toBe('0.0 μg/m³');
        expect(screen.getByTestId('pollutant-value-O₃').textContent).toBe('2.7 μg/m³');
        expect(screen.getByTestId('pollutant-value-NO₂').textContent).toBe('2.6 μg/m³');
        expect(screen.getByTestId('pollutant-value-SO₂').textContent).toBe('3.5 μg/m³');
    });

    it('should handle AQI at boundary value of 3', () => {
      const { rerender } = render(<AirQualityCard airQuality={createMockAirQuality(2)} />);

      expect(screen.queryByTestId('alert-triangle-icon')).not.toBeInTheDocument();

      rerender(<AirQualityCard airQuality={createMockAirQuality(3)} />);

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render complete component with all sections', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Unhealthy',
        description: 'Air quality is unhealthy for everyone',
        color: 'text-red-500',
      });

      render(<AirQualityCard airQuality={createMockAirQuality(4)} />);

      // Header section
      expect(screen.getByText('Calidad del Aire')).toBeInTheDocument();
      expect(screen.getByTestId('wind-icon')).toBeInTheDocument();

      // AQI info
      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
      expect(screen.getByText('Air quality is unhealthy for everyone')).toBeInTheDocument();
      expect(screen.getByText('ICA: 4/5')).toBeInTheDocument();

      // Alert
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();

      // Pollutants
      expect(screen.getByText('PM2.5')).toBeInTheDocument();
      expect(screen.getByText('CO')).toBeInTheDocument();
    });

    it('should maintain proper layout structure', () => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is good',
        color: 'text-green-500',
      });

      const { container } = render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockGetAQILevel.mockReturnValue({
        label: 'Good',
        description: 'Air quality is good',
        color: 'text-green-500',
      });
    });

    it('should have readable text content', () => {
      render(<AirQualityCard airQuality={createMockAirQuality(1)} />);

      expect(screen.getByText('Calidad del Aire')).toBeVisible();
    });

    it('should display pollutant information clearly', () => {
      render(<AirQualityCard airQuality={createMockAirQuality(2)} />);

      const pollutantNames = ['PM2.5', 'PM10', 'O₃', 'NO₂', 'SO₂', 'CO'];
      
      pollutantNames.forEach((name) => {
        expect(screen.getByText(name)).toBeVisible();
      });
    });
  });
});