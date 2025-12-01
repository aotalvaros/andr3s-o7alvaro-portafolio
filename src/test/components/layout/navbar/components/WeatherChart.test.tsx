import { WeatherChart } from '../../../../../components/layout/navbar/components/WeatherChart';
 import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';


vi.mock('@/services/weather/utils/weatherFormatters', () => ({
  formatDate: vi.fn((timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  })
}));


vi.mock('recharts', () => ({
  Line: vi.fn(({ children, ...props }) => (
    <div data-testid="line-chart-line" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  LineChart: vi.fn(({ children, data, ...props }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  XAxis: vi.fn((props) => (
    <div data-testid="x-axis" data-props={JSON.stringify(props)} />
  )),
  YAxis: vi.fn((props) => (
    <div data-testid="y-axis" data-props={JSON.stringify(props)} />
  )),
  Tooltip: vi.fn((props) => (
    <div data-testid="tooltip" data-props={JSON.stringify(props)} />
  )),
  ResponsiveContainer: vi.fn(({ children, ...props }) => (
    <div data-testid="responsive-container" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  CartesianGrid: vi.fn((props) => (
    <div data-testid="cartesian-grid" data-props={JSON.stringify(props)} />
  ))
}));

describe('WeatherChart', () => {
  const mockForecastData: ForecastItem[] = [
    {
      dt: 1640995200, // 2022-01-01 00:00:00 UTC
      temp: { max: 25.7, min: 15.3 },
      humidity: 65,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
    },
    {
      dt: 1641081600, // 2022-01-02 00:00:00 UTC
      temp: { max: 28.9, min: 18.1 },
      humidity: 58,
      weather: [{ main: 'Sunny', description: 'sunny day', icon: '01d' }]
    },
    {
      dt: 1641168000, // 2022-01-03 00:00:00 UTC
      temp: { max: 22.4, min: 12.8 },
      humidity: 72,
      weather: [{ main: 'Cloudy', description: 'few clouds', icon: '02d' }]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with title', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      expect(screen.getByText('Gráfica de temperatura')).toBeInTheDocument();
    });

    it('should render all chart components', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getAllByTestId('line-chart-line')).toHaveLength(2);
    });

    it('should apply correct CSS classes to container', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const container = screen.getByText('Gráfica de temperatura').parentElement;
      expect(container).toHaveClass(
        'rounded-2xl',
        'border',
        'border-border',
        'bg-gradient-to-br',
        'from-background/80',
        'via-background/60',
        'to-background/80',
        'backdrop-blur-xl',
        'p-6',
        'shadow-2xl'
      );
    });
  });

  describe('Data Processing', () => {
    it('should process forecast data correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartDataAttr = lineChart.getAttribute('data-chart-data');
      const chartData = JSON.parse(chartDataAttr!);
      
      expect(chartData).toHaveLength(3);
      expect(chartData[0]).toEqual({
        date: expect.any(String),
        max: 26, // Math.round(25.7)
        min: 15, // Math.round(15.3)
        humidity: 65
      });
      expect(chartData[1]).toEqual({
        date: expect.any(String),
        max: 29, // Math.round(28.9)
        min: 18, // Math.round(18.1)
        humidity: 58
      });
      expect(chartData[2]).toEqual({
        date: expect.any(String),
        max: 22, // Math.round(22.4)
        min: 13, // Math.round(12.8)
        humidity: 72
      });
    });

    it('should round temperatures correctly', () => {
      const testData: ForecastItem[] = [
        {
          dt: 1640995200,
          temp: { max: 25.4, min: 15.6 },
          humidity: 60,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        }
      ];

      render(<WeatherChart forecast={testData} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartDataAttr = lineChart.getAttribute('data-chart-data');
      const chartData = JSON.parse(chartDataAttr!);
      
      expect(chartData[0].max).toBe(25);
      expect(chartData[0].min).toBe(16);
    });
  });

  describe('Chart Configuration', () => {
    it('should configure ResponsiveContainer correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const container = screen.getByTestId('responsive-container');
      const props = JSON.parse(container.getAttribute('data-props')!);
      
      expect(props.width).toBe('100%');
      expect(props.height).toBe(300);
    });

    it('should configure XAxis correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const xAxis = screen.getByTestId('x-axis');
      const props = JSON.parse(xAxis.getAttribute('data-props')!);
      
      expect(props.dataKey).toBe('date');
      expect(props.stroke).toBe('hsl(var(--muted-foreground))');
      expect(props.fontSize).toBe(12);
      expect(props.tickLine).toBe(false);
    });

    it('should configure YAxis correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const yAxis = screen.getByTestId('y-axis');
      const props = JSON.parse(yAxis.getAttribute('data-props')!);
      
      expect(props.stroke).toBe('hsl(var(--muted-foreground))');
      expect(props.fontSize).toBe(12);
      expect(props.tickLine).toBe(false);
    });

    it('should configure Tooltip correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const tooltip = screen.getByTestId('tooltip');
      const props = JSON.parse(tooltip.getAttribute('data-props')!);
      
      expect(props.contentStyle).toEqual({
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        fontSize: '12px'
      });
    });

    it('should configure CartesianGrid correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const grid = screen.getByTestId('cartesian-grid');
      const props = JSON.parse(grid.getAttribute('data-props')!);
      
      expect(props.strokeDasharray).toBe('3 3');
      expect(props.stroke).toBe('hsl(var(--border))');
      expect(props.opacity).toBe(0.3);
    });

    it('should configure temperature lines correctly', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const lines = screen.getAllByTestId('line-chart-line');
      expect(lines).toHaveLength(2);
      
      // Max temperature line
      const maxLineProps = JSON.parse(lines[0].getAttribute('data-props')!);
      expect(maxLineProps.type).toBe('monotone');
      expect(maxLineProps.dataKey).toBe('max');
      expect(maxLineProps.stroke).toBe('hsl(var(--primary))');
      expect(maxLineProps.strokeWidth).toBe(3);
      expect(maxLineProps.name).toBe('Máx');
      
      // Min temperature line
      const minLineProps = JSON.parse(lines[1].getAttribute('data-props')!);
      expect(minLineProps.type).toBe('monotone');
      expect(minLineProps.dataKey).toBe('min');
      expect(minLineProps.stroke).toBe('hsl(var(--secondary))');
      expect(minLineProps.strokeWidth).toBe(3);
      expect(minLineProps.name).toBe('Mín');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty forecast array', () => {
      render(<WeatherChart forecast={[]} />);
      
      expect(screen.getByText('Gráfica de temperatura')).toBeInTheDocument();
      
      const lineChart = screen.getByTestId('line-chart');
      const chartDataAttr = lineChart.getAttribute('data-chart-data');
      const chartData = JSON.parse(chartDataAttr!);
      
      expect(chartData).toEqual([]);
    });

    it('should handle single forecast item', () => {
      const singleItem: ForecastItem[] = [mockForecastData[0]];
      
      render(<WeatherChart forecast={singleItem} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartDataAttr = lineChart.getAttribute('data-chart-data');
      const chartData = JSON.parse(chartDataAttr!);
      
      expect(chartData).toHaveLength(1);
      expect(chartData[0]).toEqual({
        date: expect.any(String),
        max: 26,
        min: 15,
        humidity: 65
      });
    });

    it('should handle extreme temperature values', () => {
      const extremeData: ForecastItem[] = [
        {
          dt: 1640995200,
          temp: { max: -10.7, min: -25.3 },
          humidity: 90,
          weather: [{ main: 'Snow', description: 'heavy snow', icon: '13d' }]
        },
        {
          dt: 1641081600,
          temp: { max: 45.9, min: 35.1 },
          humidity: 20,
          weather: [{ main: 'Clear', description: 'hot day', icon: '01d' }]
        }
      ];

      render(<WeatherChart forecast={extremeData} />);
      
      const lineChart = screen.getByTestId('line-chart');
      const chartDataAttr = lineChart.getAttribute('data-chart-data');
      const chartData = JSON.parse(chartDataAttr!);
      
      expect(chartData[0].max).toBe(-11);
      expect(chartData[0].min).toBe(-25);
      expect(chartData[1].max).toBe(46);
      expect(chartData[1].min).toBe(35);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<WeatherChart forecast={mockForecastData} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Gráfica de temperatura');
    });

    it('should be contained within a properly structured div', () => {
      const { container } = render(<WeatherChart forecast={mockForecastData} />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.tagName).toBe('DIV');
      expect(mainDiv).toHaveClass('rounded-2xl');
    });
  });
});