import MarsRoverPage from "@/app/(public)/lab/mars-rover/page";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/components/nasa/mars-rover/RoverFilters", () => ({
  RoverFilters: () => <div data-testid="rover-filters">Rover Filters</div>,
}));

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

const mockUseMaintenance = vi.mocked(useMaintenance);

describe("Test MarsRoverPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should show the maintenance module if isInMaintenance is true", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: true, isAplicationInMaintenance: false, maintenanceData: undefined, isFetched: false,
      isInitialLoading: true,
      isError: false,
      error: null 
    });
    render(<MarsRoverPage />);
    expect(screen.getByTestId("maintenance-module")).toBeInTheDocument();
    expect(screen.queryByTestId("rover-filters")).not.toBeInTheDocument();
  });

  it("Should show the RoverFilters if isInMaintenance is false", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isFetched: false,
      isInitialLoading: true,
      isError: false,
      error: null 
    });
    render(<MarsRoverPage />);
    expect(screen.getByTestId("rover-filters")).toBeInTheDocument();
    expect(screen.queryByTestId("maintenance-module")).not.toBeInTheDocument();
  });

  it("Should render the main correctly when not in maintenance", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isFetched: false,
      isInitialLoading: true,
      isError: false,
      error: null 
    });
    render(<MarsRoverPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});