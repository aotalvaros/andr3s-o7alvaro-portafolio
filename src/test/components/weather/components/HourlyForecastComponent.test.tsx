/* eslint-disable @typescript-eslint/no-explicit-any */
import { HourlyForecastComponent } from '../../../../components/weather/components/HourlyForecastComponent';
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HourlyForecast } from '@/types/weather.interface';


vi.mock("@/components/layout/FallbackImage", () => ({
  FallbackImage: ({ src, alt, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="fallback-image"
      src={src}
      alt={alt}
      className={className}
    />
  ),
}));

describe("HourlyForecastComponent", () => {

    let mockHourlyData: HourlyForecast[];

    beforeEach(() => {
        mockHourlyData = Array.from({ length: 10 }, (_, index) => ({
            dt: 1620000000 + index * 3600,
            temp: 20 + index,
            weather: [{ icon: "01d", description: "clear sky" }],
            pop: index % 2 === 0 ? 0.1 * (index % 10) : 0,
        })) as HourlyForecast[];
    });

    it("should render correctly with provided hourly data", () => {
        render(<HourlyForecastComponent hourly={mockHourlyData} />);
        expect(screen.getByText("Pronóstico por Hora")).toBeInTheDocument();
        expect(screen.getByText("Próximas 24 horas")).toBeInTheDocument();
        expect(screen.getAllByTestId("fallback-image").length).toBe(10);
    });

    it("should display correct temperature and precipitation probability", () => {
        render(<HourlyForecastComponent hourly={mockHourlyData} />);
        expect(screen.getByText("20°")).toBeInTheDocument();
        expect(screen.getByText("20%")).toBeInTheDocument();
    });

    it("should handle empty hourly data", () => {
        render(<HourlyForecastComponent hourly={[]} />);
        expect(screen.getByText("Pronóstico por Hora")).toBeInTheDocument();
        expect(screen.getByText("Próximas 24 horas")).toBeInTheDocument();
        expect(screen.queryAllByTestId("fallback-image").length).toBe(0);
    });

});