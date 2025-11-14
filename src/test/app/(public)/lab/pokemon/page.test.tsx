/* eslint-disable @typescript-eslint/no-explicit-any */
import PokemonPage from "@/app/(public)/lab/pokemon/page";
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
vi.mock("@/components/pokemon/components/PokemonList", () => ({
    PokemonList: () => <div data-testid="pokemon-list">Pokemon List</div>,
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const Comp = () => <div data-testid="maintenance-module">Módulo en mantenimiento</div>;
    return Comp;
  },
}));

const mockUseMaintenance = vi.mocked(useMaintenance);

describe("PokemonPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render maintenance module when in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: true } as any);
        render(<PokemonPage />);
        expect(screen.getByTestId("maintenance-module")).toBeInTheDocument();
        expect(screen.queryByTestId("pokemon-list")).not.toBeInTheDocument();
    });

    it("should render PokemonList when not in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: false } as any);
        render(<PokemonPage />);
        expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();
        expect(screen.queryByTestId("maintenance-module")).not.toBeInTheDocument();
    });


})