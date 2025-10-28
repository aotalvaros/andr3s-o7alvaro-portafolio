import LaboratorioPage from "@/app/(public)/lab/asteroids/page";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/components/nasa/AsteroidList", () => ({
  AsteroidList: () => <div data-testid="asteroid-list">Asteroid List</div>,
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

describe("Test LaboratorioPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should show the maintenance module if isInMaintenance is true", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: true, isAplicationInMaintenance: false, maintenanceData: undefined, isLoading: false });
    render(<LaboratorioPage />);
    expect(screen.getByTestId("maintenance-module")).toBeInTheDocument();
    expect(screen.queryByTestId("asteroid-list")).not.toBeInTheDocument();
  });

  it("Should show the asteroid list if isInMaintenance is false", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isLoading: false });
    render(<LaboratorioPage />);
    expect(screen.getByTestId("asteroid-list")).toBeInTheDocument();
    expect(screen.queryByTestId("maintenance-module")).not.toBeInTheDocument();
  });

  it("Should render the loading component while the dynamic maintenance module is loading", async () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isLoading: true });
    render(<LaboratorioPage />);
    expect(screen.queryByText("Cargando...")).not.toBeInTheDocument();
  });

  it("Should render the main correctly when not in maintenance", () => {
    mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isLoading: false });
    render(<LaboratorioPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
