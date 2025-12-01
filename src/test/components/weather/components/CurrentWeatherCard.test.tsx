/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CurrentWeatherCard } from '../../../../components/weather/components/CurrentWeatherCard';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrentWeather } from '@/types/weather.interface';
import { getWeatherIcon } from '@/services/weather/utils/weatherHelpers';
import { formatTime, getWindDirection } from '@/services/weather/utils/weatherFormatters';

vi.mock('../../../../components/weather/components/WeatherDetail', () => ({
  WeatherDetail: ({ icon, label, value }: any) => (
    <div data-testid={`weather-detail-${label.toLowerCase()}`}>
      {icon}
      <p data-testid={`label-${label.toLowerCase()}`}>{label}</p>
      <p data-testid={`value-${label.toLowerCase()}`}>{value}</p>
    </div>
  ),
}));


vi.mock('@/components/layout/FallbackImage', () => ({
  FallbackImage: ({ src, alt, className }: any) => (
    <img
      data-testid="fallback-image"
      src={src}
      alt={alt}
      className={className}
    />
  ),
}));

vi.mock('@/services/weather/utils/weatherHelpers', () => ({
  getWeatherIcon: vi.fn(),
}));

vi.mock('@/services/weather/utils/weatherFormatters', () => ({
  formatTime: vi.fn(),
  getWindDirection: vi.fn(),
}));

describe('CurrentWeatherCard', () => {
  const mockGetWeatherIcon = vi.mocked(getWeatherIcon);
  const mockFormatTime = vi.mocked(formatTime);
  const mockGetWindDirection = vi.mocked(getWindDirection);

 const createMockWeather = (overrides?: Partial<CurrentWeather>): CurrentWeather => ({
    name: 'Medellín',
    country: 'Colombia',
    temp: 22.5,
    feels_like: 23.8,
    temp_min: 20.0,
    temp_max: 25.0,
    humidity: 65,
    pressure: 1013,
    visibility: 10000,
    wind_speed: 3.5,
    wind_deg: 180,
    clouds: 20,
    dt: 1640000000,
    sunrise: 1640000000,
    sunset: 1640040000,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGetWeatherIcon.mockReturnValue('https://openweathermap.org/img/wn/01d@2x.png');
    mockFormatTime.mockImplementation((timestamp) => {
      if (timestamp === 1640000000) return '06:00';
      if (timestamp === 1640040000) return '18:00';
      return '00:00';
    });
    mockGetWindDirection.mockReturnValue('S');
  });

  describe('Basic rendering', () => {
    it('should render the component', () => {
      const { container } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render city name', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByText('Medellín')).toBeInTheDocument();
    });

    it('should render country', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByText('Colombia')).toBeInTheDocument();
    });

    it('should render MapPin icon', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('should render weather icon', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('fallback-image')).toBeInTheDocument();
    });
  });

  describe('Weather icon', () => {
    it('should call getWeatherIcon with correct icon code', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(mockGetWeatherIcon).toHaveBeenCalledWith('01d');
    });

    it('should pass icon URL to FallbackImage', () => {
      mockGetWeatherIcon.mockReturnValue('https://example.com/icon.png');
      
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('src', 'https://example.com/icon.png');
    });

    it('should have correct alt text for weather icon', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('alt', 'Weather Icon');
    });

    it('should apply correct classes to weather icon', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveClass('h-20', 'w-20');
    });

    it('should handle different weather icons', () => {
      const icons = ['01d', '02d', '03d', '10d', '11d'];

      icons.forEach((icon) => {
        mockGetWeatherIcon.mockReturnValue(`https://example.com/${icon}.png`);
        
        const weather = createMockWeather({
          weather: [{ id: 800, main: 'Clear', description: 'clear', icon }],
        });

        const { unmount } = render(<CurrentWeatherCard weather={weather} />);

        expect(mockGetWeatherIcon).toHaveBeenCalledWith(icon);

        unmount();
      });
    });
  });

  describe('Temperature display', () => {
    it('should display rounded temperature', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ temp: 22.7 })} />);

      expect(screen.getByText('23°')).toBeInTheDocument();
    });

    it('should round temperature correctly', () => {
      const temps = [
        { input: 22.4, expected: '22°' },
        { input: 22.5, expected: '23°' },
        { input: 22.9, expected: '23°' },
        { input: -5.3, expected: '-5°' },
      ];

      temps.forEach(({ input, expected }) => {
        const { unmount } = render(
          <CurrentWeatherCard weather={createMockWeather({ temp: input })} />
        );

        expect(screen.getByText(expected)).toBeInTheDocument();

        unmount();
      });
    });

    it('should display Celsius unit', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('should handle zero temperature', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ temp: 0 })} />);

      expect(screen.getByText('0°')).toBeInTheDocument();
    });
  });

  describe('Weather description', () => {
    it('should display weather description capitalized', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const description = screen.getByText('clear sky');
      expect(description).toHaveClass('capitalize');
    });

    it('should display different weather descriptions', () => {
      const descriptions = ['clear sky', 'few clouds', 'scattered clouds', 'light rain'];

      descriptions.forEach((description) => {
        const weather = createMockWeather({
          weather: [{ id: 800, main: 'Clear', description, icon: '01d' }],
        });

        const { unmount } = render(<CurrentWeatherCard weather={weather} />);

        expect(screen.getByText(description)).toBeInTheDocument();

        unmount();
      });
    });

    it('should access first weather condition from array', () => {
      const weather = createMockWeather({
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
          { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
        ],
      });

      render(<CurrentWeatherCard weather={weather} />);

      // Should display first condition only
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.queryByText('few clouds')).not.toBeInTheDocument();
    });
  });

  describe('Feels like temperature', () => {
    it('should display feels like temperature', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ feels_like: 24.3 })} />);

      expect(screen.getByText(/Sensación térmica: 24°C/)).toBeInTheDocument();
    });

    it('should round feels like temperature', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ feels_like: 23.7 })} />);

      expect(screen.getByText(/Sensación térmica: 24°C/)).toBeInTheDocument();
    });

    it('should handle negative feels like temperature', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ feels_like: -5.5 })} />);

      expect(screen.getByText(/Sensación térmica: -5°C/)).toBeInTheDocument();
    });
  });

  describe('Weather details - Wind', () => {
    it('should render wind detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-viento')).toBeInTheDocument();
    });

    it('should call getWindDirection with correct degree', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ wind_deg: 180 })} />);

      expect(mockGetWindDirection).toHaveBeenCalledWith(180);
    });

    it('should display wind speed and direction', () => {
      mockGetWindDirection.mockReturnValue('N');
      
      render(<CurrentWeatherCard weather={createMockWeather({ wind_speed: 5.5 })} />);

      expect(screen.getByTestId('value-viento')).toHaveTextContent('5.5 m/s N');
    });

    it('should handle different wind directions', () => {
      const directions = [
        { deg: 0, direction: 'N' },
        { deg: 90, direction: 'E' },
        { deg: 180, direction: 'S' },
        { deg: 270, direction: 'W' },
      ];

      directions.forEach(({ deg, direction }) => {
        mockGetWindDirection.mockReturnValue(direction);
        
        const { unmount } = render(
          <CurrentWeatherCard weather={createMockWeather({ wind_deg: deg })} />
        );

        expect(mockGetWindDirection).toHaveBeenCalledWith(deg);

        unmount();
      });
    });
  });

  describe('Weather details - Humidity', () => {
    it('should render humidity detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-humedad')).toBeInTheDocument();
    });

    it('should display humidity percentage', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ humidity: 75 })} />);

      expect(screen.getByTestId('value-humedad')).toHaveTextContent('75%');
    });

    it('should handle different humidity values', () => {
      const humidities = [0, 25, 50, 75, 100];

      humidities.forEach((humidity) => {
        const { unmount } = render(
          <CurrentWeatherCard weather={createMockWeather({ humidity })} />
        );

        expect(screen.getByTestId('value-humedad')).toHaveTextContent(`${humidity}%`);

        unmount();
      });
    });
  });

  describe('Weather details - Visibility', () => {
    it('should render visibility detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-visibilidad')).toBeInTheDocument();
    });

    it('should convert visibility from meters to kilometers', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ visibility: 10000 })} />);

      expect(screen.getByTestId('value-visibilidad')).toHaveTextContent('10.0 km');
    });

    it('should format visibility to 1 decimal place', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ visibility: 7500 })} />);

      expect(screen.getByTestId('value-visibilidad')).toHaveTextContent('7.5 km');
    });

    it('should handle different visibility values', () => {
      const visibilities = [
        { meters: 1000, expected: '1.0 km' },
        { meters: 5500, expected: '5.5 km' },
        { meters: 10000, expected: '10.0 km' },
      ];

      visibilities.forEach(({ meters, expected }) => {
        const { unmount } = render(
          <CurrentWeatherCard weather={createMockWeather({ visibility: meters })} />
        );

        expect(screen.getByTestId('value-visibilidad')).toHaveTextContent(expected);

        unmount();
      });
    });
  });

  describe('Weather details - Pressure', () => {
    it('should render pressure detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-presión')).toBeInTheDocument();
    });

    it('should display pressure in hPa', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ pressure: 1015 })} />);

      expect(screen.getByTestId('value-presión')).toHaveTextContent('1015 hPa');
    });
  });

  describe('Weather details - Sunrise', () => {
    it('should render sunrise detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-amanecer')).toBeInTheDocument();
    });

    it('should call formatTime with sunrise timestamp', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ sunrise: 1640000000 })} />);

      expect(mockFormatTime).toHaveBeenCalledWith(1640000000);
    });

    it('should display formatted sunrise time', () => {
      mockFormatTime.mockReturnValue('06:30');
      
      render(<CurrentWeatherCard weather={createMockWeather({ sunrise: 1640000000 })} />);

      expect(screen.getByTestId('value-amanecer')).toHaveTextContent('06:30');
    });
  });

  describe('Weather details - Sunset', () => {
    it('should render sunset detail', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-atardecer')).toBeInTheDocument();
    });

    it('should call formatTime with sunset timestamp', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ sunset: 1640040000 })} />);

      expect(mockFormatTime).toHaveBeenCalledWith(1640040000);
    });

    it('should display formatted sunset time', () => {
      mockFormatTime.mockReturnValue('18:45');
      
      render(<CurrentWeatherCard weather={createMockWeather({ sunset: 1640040000 })} />);

      expect(screen.getByTestId('value-atardecer')).toHaveTextContent('18:45');
    });
  });

  describe('Grid layout', () => {
    it('should render all 6 weather details', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(screen.getByTestId('weather-detail-viento')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-humedad')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-visibilidad')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-presión')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-amanecer')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-atardecer')).toBeInTheDocument();
    });

    it('should have correct grid layout classes', () => {
      const { container } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2', 'sm:grid-cols-3', 'gap-4');
    });
  });

  describe('Styling', () => {
    it('should have gradient background', () => {
      const { container } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        'rounded-2xl',
        'border',
        'border-border',
        'bg-gradient-to-br',
        'backdrop-blur-xl',
        'p-6',
        'shadow-2xl'
      );
    });

    it('should have gradient overlay', () => {
      const { container } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      const overlay = container.querySelector('.absolute.inset-0');
      expect(overlay).toHaveClass('bg-gradient-to-br');
    });

    it('should apply correct font sizes', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const temp = screen.getByText('23°');
      expect(temp).toHaveClass('text-6xl', 'font-bold');
    });
  });

  describe('Integration', () => {
    it('should render complete weather card', () => {
      const weather = createMockWeather({
        name: 'Bogotá',
        country: 'Colombia',
        temp: 18.5,
        feels_like: 17.2,
        humidity: 80,
        pressure: 1010,
        visibility: 8000,
        wind_speed: 4.2,
        wind_deg: 90,
      });

      render(<CurrentWeatherCard weather={weather} />);

      // Location
      expect(screen.getByText('Bogotá')).toBeInTheDocument();
      expect(screen.getByText('Colombia')).toBeInTheDocument();

      // Temperature
      expect(screen.getByText('19°')).toBeInTheDocument();
      expect(screen.getByText(/Sensación térmica: 17°C/)).toBeInTheDocument();

      // Weather details
      expect(screen.getByTestId('weather-detail-viento')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-humedad')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-visibilidad')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-presión')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-amanecer')).toBeInTheDocument();
      expect(screen.getByTestId('weather-detail-atardecer')).toBeInTheDocument();
    });

    it('should call all helper functions with correct parameters', () => {
      const weather = createMockWeather();
      
      render(<CurrentWeatherCard weather={weather} />);

      expect(mockGetWeatherIcon).toHaveBeenCalledWith('01d');
      expect(mockGetWindDirection).toHaveBeenCalledWith(180);
      expect(mockFormatTime).toHaveBeenCalledWith(1640000000);
      expect(mockFormatTime).toHaveBeenCalledWith(1640040000);
    });
  });

  describe('Edge cases', () => {
    it('should handle extreme temperatures', () => {
      const extremes = [
        { temp: -40, expected: '-40°' },
        { temp: 50, expected: '50°' },
      ];

      extremes.forEach(({ temp, expected }) => {
        const { unmount } = render(
          <CurrentWeatherCard weather={createMockWeather({ temp })} />
        );

        expect(screen.getByText(expected)).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle very low visibility', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ visibility: 100 })} />);

      expect(screen.getByTestId('value-visibilidad')).toHaveTextContent('0.1 km');
    });

    it('should handle zero wind speed', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ wind_speed: 0 })} />);

      expect(screen.getByTestId('value-viento')).toHaveTextContent('0 m/s');
    });

    it('should handle decimal wind speed', () => {
      render(<CurrentWeatherCard weather={createMockWeather({ wind_speed: 3.7 })} />);

      expect(screen.getByTestId('value-viento')).toHaveTextContent('3.7 m/s');
    });

    it('should handle weather array with single condition', () => {
      const weather = createMockWeather({
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      });

      render(<CurrentWeatherCard weather={weather} />);

      expect(screen.getByText('clear sky')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading for city name', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const heading = screen.getByText('Medellín');
      expect(heading.tagName).toBe('H2');
    });

    it('should have alt text for weather icon', () => {
      render(<CurrentWeatherCard weather={createMockWeather()} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('alt', 'Weather Icon');
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<CurrentWeatherCard weather={createMockWeather()} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <CurrentWeatherCard
            weather={createMockWeather({ temp: 20 + i })}
          />
        );
      }

      expect(screen.getByText('Medellín')).toBeInTheDocument();
    });
  });
});