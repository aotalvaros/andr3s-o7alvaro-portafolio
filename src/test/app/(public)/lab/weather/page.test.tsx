/* eslint-disable @typescript-eslint/no-explicit-any */
import WeatherPage from '../../../../../app/(public)/lab/weather/page';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/maintenance/hooks/useMaintenance");
vi.mock("@/components/maintenance/ModuleInMaintenance", () => ({
    __esModule: true,
    default: ({ moduleName }: { moduleName: string }) => (
        <div data-testid="maintenance-module">
        Módulo en mantenimiento: {moduleName}
        </div>
    ),
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const Comp = () => <div data-testid="maintenance-module">Módulo en mantenimiento</div>;
    return Comp;
  },
}));

vi.mock('../../../../../components/weather/components/WeatherContent', () => ({
    WeatherContent: () => <div data-testid="weather-content">Weather Content</div>,
}));

const mockUseMaintenance = vi.mocked(useMaintenance);

describe("WeatherPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render maintenance module when in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: true } as any);
        render(<WeatherPage />);
        expect(screen.getByTestId("maintenance-module")).toBeInTheDocument();
        expect(screen.queryByTestId("weather-content")).not.toBeInTheDocument();
    })

    it("should render WeatherContent when not in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: false } as any);
        render(<WeatherPage />);
        expect(screen.getByTestId("weather-content")).toBeInTheDocument();
        expect(screen.queryByTestId("maintenance-module")).not.toBeInTheDocument();
    });

})