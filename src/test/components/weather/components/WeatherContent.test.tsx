/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeatherContent } from '../../../../components/weather/components/WeatherContent';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import { useWeatherContent } from '../../../../components/weather/hooks/useWeatherContent';
import { OneCallWeatherData, AirQuality } from '@/types/weather.interface';

vi.mock("../../../../components/weather/hooks/useWeatherContent")

vi.mock('../../../../components/ui/CustomSearch', () => ({
   CustomSearch: vi.fn(({ onSearch, placeholder, disabled, isSearching, propsAnimate }) => (
    <div data-testid="custom-search">
      <input
        data-testid="search-input"
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onSearch(e.target.value)}
      />
      {isSearching && <span data-testid="searching-indicator">Searching...</span>}
      {propsAnimate?.results?.map((result: any, index: number) => (
        <div key={index} data-testid={`search-result-${index}`}>
          {propsAnimate.children(result, index)}
        </div>
      ))}
      {propsAnimate?.childrenButton}
    </div>
  ))
}));

vi.mock('../../../../components/weather/components/CityResultItem', () => ({
  CityResultItem: vi.fn(({ result, index, onSelect }) => (
    <button
      data-testid={`city-result-${index}`}
      onClick={() => onSelect(result)}
    >
      {result.name}
    </button>
  ))
}));

vi.mock("../../../../components/weather/components/APILimitWarning", () => ({
    APILimitWarning: () => <div data-testid="api-limit-warning">API Limit Warning</div>
}))

vi.mock("../../../../components/weather/components/CurrentWeatherCard", () => ({
    CurrentWeatherCard: ({weather}: {weather: any}) => <div data-testid="current-weather-card">
      {weather.name} - {weather.temp_min}°/{weather.temp_max}°
    </div>
}))

vi.mock("../../../../components/weather/components/HourlyForecastComponent", () => ({
    HourlyForecastComponent: () =>  <div data-testid="hourly-forecast">Hourly Forecast</div>
}))

vi.mock("../../../../components/layout/navbar/components/WeatherChart", () => ({
    WeatherChart: () => <div data-testid="weather-chart">Weather Chart</div>
}));

vi.mock("../../../../components/weather/components/SunTimeline", () => ({
    SunTimeline: () => <div data-testid="sun-timeline">Sun Timeline</div>
}));


vi.mock("../../../../components/weather/components/AirQualityCard", () => ({
    AirQualityCard: ({airQuality}: {airQuality: any}) => <div data-testid="air-quality-card">AQI: {airQuality.aqi}</div>
}));


vi.mock("../../../../components/weather/components/ForecastCard", () => ({
    ForecastCard: () =>  <div data-testid="forecast-card">Forecast Card</div>
}));

describe("WeatherContent Component", () => {

   const mockWeatherData: OneCallWeatherData = {
    current: {
      dt: 1234567890,
      sunrise: 1234560000,
      sunset: 1234600000,
      temp: 25,
      feels_like: 26,
      humidity: 60,
      wind_speed: 5,
    },
     daily: [
      {
        temp: { min: 20, max: 30 },
        weather: [{ description: 'clear sky', icon: '01d' }]
      }
    ],
    hourly: [
        {
            dt: 1234567890,
            temp: 25,
            feels_like: 26,
            pressure: 1013,
        } 
    ]
  } as OneCallWeatherData;

  const mockAirQuality: AirQuality = {
    aqi: 50,
    components: {
        co: 200,
        no: 10,
        no2: 15,
        o3: 30,
        so2: 5,
    }
  } as AirQuality;

  const defaultMockReturn = {
    weatherData: null,
    airQuality: null,
    error: null,
    backgroundGradient: 'from-blue-400 to-blue-600',
    cityName: 'Medellín',
    isLoadingLocation: false,
    isRateLimited: false,
    results: [],
    isSearching: false,
    isLoading: false,
    isNighttime: false,
    setError: vi.fn(),
    handleUseCurrentLocation: vi.fn(),
    handleCitySelect: vi.fn(),
    handleSearchChange: vi.fn(),
  };

    beforeEach(() => {
        vi.mocked(useWeatherContent).mockReturnValue(defaultMockReturn);
    })

     afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic rendering', () => {
    it('should render the weather dashboard title', () => {
      render(<WeatherContent />);
      
      expect(screen.getByText('Tablero meteorológico')).toBeInTheDocument();
    });

    it('should display the current city name', () => {
      render(<WeatherContent />);
      
      expect(screen.getByText(/Clima en tiempo real.*Medellín/)).toBeInTheDocument();
    });

    it('should render the CustomSearch component', () => {
      render(<WeatherContent />);
      
      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should show sun icon during daytime', () => {
      render(<WeatherContent />);
      
      const sunIcon = document.querySelector('.text-yellow-400');
      expect(sunIcon).toBeInTheDocument();
    });

    it('should show moon icon during nighttime', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isNighttime: true,
      });

      render(<WeatherContent />);
      
      const moonIcon = document.querySelector('.text-muted-foreground');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  describe('Loading states', () => {
    it('should display loading indicator when isLoading is true', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });

      render(<WeatherContent />);
      
      expect(screen.getByText('Cargando datos del clima...')).toBeInTheDocument();
    });

    it('should show location loading spinner', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isLoadingLocation: true,
      });

      render(<WeatherContent />);
      
      const button = screen.getByTestId('use-current-location-button');
      expect(button).toBeDisabled();
    });

    it('should display searching indicator when isSearching is true', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isSearching: true,
      });

      render(<WeatherContent />);
      
      expect(screen.getByTestId('searching-indicator')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should display error message when error exists', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        error: 'Error al cargar los datos',
      });

      render(<WeatherContent />);
      
      expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
    });

    it('should allow closing the error message', () => {
      const mockSetError = vi.fn();
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        error: 'Error al cargar los datos',
        setError: mockSetError,
      });

      render(<WeatherContent />);
      
      const closeButton = screen.getByTestId('close-error-button');
      fireEvent.click(closeButton);
      
      expect(mockSetError).toHaveBeenCalledWith(null);
    });
  });

  describe('API rate limiting', () => {
    it('should display warning when API limit is reached', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isRateLimited: true,
      });

      render(<WeatherContent />);
      
      expect(screen.getByTestId('api-limit-warning')).toBeInTheDocument();
    });

    it('should disable search when rate limited', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isRateLimited: true,
      });

      render(<WeatherContent />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeDisabled();
    });

    it('should disable location button when rate limited', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isRateLimited: true,
      });

      render(<WeatherContent />);
      
      const locationButton = screen.getByTestId('use-current-location-button');
      expect(locationButton).toBeDisabled();
    });

    it('should not display weather data when rate limited', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isRateLimited: true,
        weatherData: mockWeatherData,
      });

      render(<WeatherContent />);
      
      expect(screen.queryByTestId('current-weather-card')).not.toBeInTheDocument();
    });
  });

  describe('City search', () => {
    it('should call handleSearchChange when typing in the input', () => {
      const mockHandleSearchChange = vi.fn();
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        handleSearchChange: mockHandleSearchChange,
      });

      render(<WeatherContent />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Bogotá' } });
      
      expect(mockHandleSearchChange).toHaveBeenCalledWith('Bogotá');
    });

    it('should display search results', () => {
      const mockResults = [
        { name: 'Bogotá', country: 'CO', lat: 4.6, lon: -74.08 },
        { name: 'Cali', country: 'CO', lat: 3.4, lon: -76.5 }
      ];

      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        results: mockResults,
      });

      render(<WeatherContent />);
      
      expect(screen.getByTestId('city-result-0')).toBeInTheDocument();
      expect(screen.getByTestId('city-result-1')).toBeInTheDocument();
    });

    it('should call handleCitySelect when selecting a city', () => {
      const mockHandleCitySelect = vi.fn();
      const mockResults = [
        { name: 'Bogotá', country: 'CO', lat: 4.6, lon: -74.08 }
      ];

      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        results: mockResults,
        handleCitySelect: mockHandleCitySelect,
      });

      render(<WeatherContent />);
      
      const cityButton = screen.getByTestId('city-result-0');
      fireEvent.click(cityButton);
      
      expect(mockHandleCitySelect).toHaveBeenCalledWith(mockResults[0]);
    });
  });

  describe('Current location', () => {
    it('should call handleUseCurrentLocation when clicking the button', () => {
      const mockHandleUseCurrentLocation = vi.fn();
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        handleUseCurrentLocation: mockHandleUseCurrentLocation,
      });

      render(<WeatherContent />);
      
      const locationButton = screen.getByTestId('use-current-location-button');
      fireEvent.click(locationButton);
      
      expect(mockHandleUseCurrentLocation).toHaveBeenCalled();
    });

    it('should display the location button text', () => {
      render(<WeatherContent />);
      
      expect(screen.getByText('Mi ubicación')).toBeInTheDocument();
    });
  });

  describe('Weather data rendering', () => {
    it('should render all components when weather data is available', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        weatherData: mockWeatherData,
        airQuality: mockAirQuality,
      });

      render(<WeatherContent />);
      
      expect(screen.getByTestId('current-weather-card')).toBeInTheDocument();
      expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument();
      expect(screen.getByTestId('weather-chart')).toBeInTheDocument();
      expect(screen.getByTestId('sun-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('air-quality-card')).toBeInTheDocument();
      expect(screen.getByTestId('forecast-card')).toBeInTheDocument();
    });

    it('should pass correct data to CurrentWeatherCard', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        weatherData: mockWeatherData,
      });

      render(<WeatherContent />);
      
      const card = screen.getByTestId('current-weather-card');
      expect(card).toHaveTextContent('Medellín');
      expect(card).toHaveTextContent('20°/30°');
    });

    it('should not render AirQualityCard when air quality data is unavailable', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        weatherData: mockWeatherData,
        airQuality: null,
      });

      render(<WeatherContent />);
      
      expect(screen.queryByTestId('air-quality-card')).not.toBeInTheDocument();
    });

    it('should not render weather components when data is unavailable', () => {
      render(<WeatherContent />);
      
      expect(screen.queryByTestId('current-weather-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hourly-forecast')).not.toBeInTheDocument();
      expect(screen.queryByTestId('weather-chart')).not.toBeInTheDocument();
    });
  });

  describe('CSS styles and classes', () => {
    it('should apply correct background gradient', () => {
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        backgroundGradient: 'from-purple-400 to-pink-600',
      });

      const { container } = render(<WeatherContent />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('from-purple-400');
      expect(mainDiv.className).toContain('to-pink-600');
    });

    it('should have correct responsive classes', () => {
      const { container } = render(<WeatherContent />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('h-full');
      expect(mainDiv.className).toContain('bg-gradient-to-br');
    });
  });

  describe('Complete integration', () => {
    it('should handle complete search and selection flow', async () => {
      const mockHandleSearchChange = vi.fn();
      const mockHandleCitySelect = vi.fn();
      const mockResults = [
        { name: 'Bogotá', country: 'CO', lat: 4.6, lon: -74.08 }
      ];

      const { rerender } = render(<WeatherContent />);

      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        handleSearchChange: mockHandleSearchChange,
        isSearching: true,
      });
      rerender(<WeatherContent />);

      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        handleSearchChange: mockHandleSearchChange,
        handleCitySelect: mockHandleCitySelect,
        results: mockResults,
        isSearching: false,
      });
      rerender(<WeatherContent />);

      const cityButton = screen.getByTestId('city-result-0');
      expect(cityButton).toBeInTheDocument();

      fireEvent.click(cityButton);
      
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      rerender(<WeatherContent />);

      expect(screen.getByText('Cargando datos del clima...')).toBeInTheDocument();

      // Simulate loaded data
      vi.mocked(useWeatherContent).mockReturnValue({
        ...defaultMockReturn,
        weatherData: mockWeatherData,
        airQuality: mockAirQuality,
        cityName: 'Bogotá',
      });
      rerender(<WeatherContent />);

      expect(screen.getByTestId('current-weather-card')).toBeInTheDocument();
    });
  });
})