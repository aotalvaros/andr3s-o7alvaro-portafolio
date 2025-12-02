/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForecastCard } from "../../../../components/weather/components/ForecastCard";
import { ForecastItem } from "@/types/weather.interface";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

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

describe("ForecastCard Component", () => {
  let mockForecast: ForecastItem[];

    beforeEach(() => {
        mockForecast = [
        {
            dt: 1640995200,
            temp: { max: 25.7, min: 15.3 },
            humidity: 65,
            weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        },
        {
            dt: 1641081600, 
            temp: { max: 28.9, min: 18.1 },
            humidity: 58,
            weather: [{ main: "Sunny", description: "sunny day", icon: "01d" }],
        },
        {
            dt: 1641168000,
            temp: { max: 22.4, min: 12.8 },
            humidity: 72,
            weather: [{ main: "Cloudy", description: "few clouds", icon: "02d" }],
        },
        ] as ForecastItem[];
    });

    it("should render the ForecastCard component with forecast data", () => {
        render(<ForecastCard forecast={mockForecast} />);

        expect(
        screen.getByText("Pronóstico de 7 días")
        ).toBeInTheDocument();
    })

    it("should render correct number of forecast items", () => {
        render(<ForecastCard forecast={mockForecast} />);
        const forecastItems = screen.getAllByText(/°/);

        expect(forecastItems.length).toBe(mockForecast.length * 2);
    });

    it("should display correct max and min temperatures", () => {
        render(<ForecastCard forecast={mockForecast} />);
        mockForecast.forEach((item) => {
        expect(
            screen.getByText(`${Math.round(item.temp.max)}°`)
        ).toBeInTheDocument();
        expect(
            screen.getByText(`${Math.round(item.temp.min)}°`)
        ).toBeInTheDocument();
        });
    });


});
