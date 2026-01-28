import { ModuleStatsGrid } from '../../../../../components/sections/admin/modules/components/ModuleStatsGrid';
import { render, screen  } from "@testing-library/react";
import { describe, it, expect } from "vitest";


describe("ModuleStatsGrid", () => {
  const defaultProps = {
    totalModules: 10,
    activeModules: 7,
    blockedModules: 3,
    categoriesCount: 5,
  };

  it("should render all four stat cards", () => {
    render(<ModuleStatsGrid {...defaultProps} />);
    
    expect(screen.getByText("Total Módulos")).toBeInTheDocument();
    expect(screen.getByText("Activos")).toBeInTheDocument();
    expect(screen.getByText("Bloqueados")).toBeInTheDocument();
    expect(screen.getByText("Categorías")).toBeInTheDocument();
  });

  it("should display correct total modules count", () => {
    render(<ModuleStatsGrid {...defaultProps} />);
    
    const totalModulesCard = screen.getByTestId("total-modules");
    expect(totalModulesCard).toHaveTextContent("10");
  });

  it("should display correct active modules count with green color", () => {
    render(<ModuleStatsGrid {...defaultProps} />);
    
    const activeModulesCard = screen.getByTestId("active-modules");
    expect(activeModulesCard).toHaveTextContent("7");
  });

  it("should display correct blocked modules count with red color", () => {
    render(<ModuleStatsGrid {...defaultProps} />);
    
    const blockedModulesCard = screen.getByTestId("blocked-modules");
    expect(blockedModulesCard).toHaveTextContent("3");
  });

  it("should display correct categories count", () => {
    render(<ModuleStatsGrid {...defaultProps} />);
    
    const categoriesCard = screen.getByTestId("categories-count");
    expect(categoriesCard).toHaveTextContent("5");
  });

  it("should render with zero values", () => {
    render(
      <ModuleStatsGrid
        totalModules={0}
        activeModules={0}
        blockedModules={0}
        categoriesCount={0}
      />
    );
    
    expect(screen.getByTestId("total-modules")).toHaveTextContent("0");
    expect(screen.getByTestId("active-modules")).toHaveTextContent("0");
    expect(screen.getByTestId("blocked-modules")).toHaveTextContent("0");
    expect(screen.getByTestId("categories-count")).toHaveTextContent("0");
  });

  it("should render with large numbers", () => {
    render(
      <ModuleStatsGrid
        totalModules={9999}
        activeModules={8888}
        blockedModules={1111}
        categoriesCount={777}
      />
    );
    
    expect(screen.getByTestId("total-modules")).toHaveTextContent("9999");
    expect(screen.getByTestId("active-modules")).toHaveTextContent("8888");
    expect(screen.getByTestId("blocked-modules")).toHaveTextContent("1111");
    expect(screen.getByTestId("categories-count")).toHaveTextContent("777");
  });

  it("should have proper grid layout structure", () => {
    const { container } = render(<ModuleStatsGrid {...defaultProps} />);
    
    const section = container.querySelector("section");
    expect(section).toHaveClass("grid", "gap-4", "md:grid-cols-4");
  });

  it("should render all cards with muted background", () => {
    const { container } = render(<ModuleStatsGrid {...defaultProps} />);
    
    const cards = container.querySelectorAll(".bg-muted\\/60");
    expect(cards).toHaveLength(4);
  });
});