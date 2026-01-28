import { ModulesManager } from "@/components/sections/admin/modules/ModulesManager";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useBlockedModules } from "@/components/sections/admin/hooks/useBlockedModules";
import { useModuleFilters } from "@/components/sections/admin/modules/hooks/useModuleFilters";
import { useModuleStats } from "@/components/sections/admin/modules/hooks/useModuleStats";
import { useRecentActivities } from '@/components/sections/admin/hooks/useRecentActivities';

// Mock data
const mockModules = [
  {
    _id: "1",
    moduleName: "users",
    name: "Users Module",
    category: "core",
    isBlocked: false,
    isActive: true,
    lastModifiedAt: "2024-01-01T00:00:00Z",
    lastModifiedBy: {
      _id: "admin1",
      name: "Admin User",
      email: "admin@example.com",
    },
    __v: 0,
  },
  {
    _id: "2",
    moduleName: "reports",
    name: "Reports Module",
    category: "features",
    isBlocked: true,
    isActive: true,
    lastModifiedAt: "2024-01-02T00:00:00Z",
    lastModifiedBy: {
      _id: "admin2",
      name: "Admin User 2",
      email: "admin2@example.com",
    },
    __v: 0,
  },
  {
    _id: "3",
    moduleName: "analytics",
    name: "Analytics Module",
    category: "features",
    isBlocked: false,
    isActive: true,
    lastModifiedAt: "2024-01-03T00:00:00Z",
    lastModifiedBy: {
      _id: "admin1",
      name: "Admin User",
      email: "admin@example.com",
    },
    __v: 0,
  },
];

const mockRecentActivities = [
  { module: "Users Module", action: "enabled", time: "5 min ago" },
  { module: "Reports Module", action: "blocked", time: "10 min ago" },
  { module: "Analytics Module", action: "enabled", time: "15 min ago" },
];

const mockModuleStats = {
  activeModules: 2,
  blockedModules: 1,
  totalModules: 3,
  byCategory: {
    core: 1,
    features: 2,
  },
  textExamples: ["Users", "Reports", "Analytics"],
};

const mockHandleToggleModule = vi.fn();

vi.mock("@/components/sections/admin/hooks/useBlockedModules");
vi.mock("@/components/sections/admin/modules/hooks/useModuleFilters");

vi.mock("@/components/sections/admin/hooks/useRecentActivities", () => ({
  useRecentActivities: vi.fn(() => mockRecentActivities),
}));

vi.mock("@/components/sections/admin/modules/hooks/useModuleStats", () => ({
  useModuleStats: vi.fn(() => mockModuleStats),
}));

// Mock components
vi.mock(
  "@/components/sections/admin/modules/components/ModuleStatsGrid",
  () => ({
    ModuleStatsGrid: ({
      totalModules,
      activeModules,
      blockedModules,
      categoriesCount,
    }: any) => (
      <div data-testid="module-stats-grid">
        <span data-testid="total-modules">{totalModules}</span>
        <span data-testid="active-modules">{activeModules}</span>
        <span data-testid="blocked-modules">{blockedModules}</span>
        <span data-testid="categories-count">{categoriesCount}</span>
      </div>
    ),
  }),
);

vi.mock("@/components/sections/admin/modules/components/ModuleFilters", () => ({
  ModuleFilters: ({
    searchTerm,
    categoryFilter,
    textExamples,
    categories,
    onSearchChange,
    onCategoryChange,
  }: any) => (
    <div data-testid="module-filters">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search modules"
      />
      <select
        data-testid="category-select"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div data-testid="text-examples">{textExamples.join(", ")}</div>
    </div>
  ),
}));

vi.mock("@/components/sections/admin/modules/components/ModuleCard", () => ({
  ModuleCard: ({ module, lastModified, isPending, onToggle }: any) => (
    <div
      data-testid={`module-card-${module._id}`}
      data-module-name={module.moduleName}
    >
      <h3>{module.name}</h3>
      <span data-testid={`module-status-${module._id}`}>
        {module.isBlocked ? "Blocked" : "Active"}
      </span>
      {lastModified && (
        <span data-testid={`last-modified-${module._id}`}>{lastModified}</span>
      )}
      <button
        data-testid={`toggle-button-${module._id}`}
        onClick={() => onToggle(module.moduleName, !module.isBlocked)}
        disabled={isPending}
      >
        Toggle
      </button>
    </div>
  ),
}));

describe("ModulesManager Component", () => {
  beforeEach(() => {
    vi.mocked(useBlockedModules).mockReturnValue({
      modules: mockModules,
      handleToggleModule: mockHandleToggleModule,
      isPending: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("should render all main sections", () => {
      render(<ModulesManager />);

      expect(screen.getByTestId("module-stats-grid")).toBeInTheDocument();
      expect(screen.getByTestId("module-filters")).toBeInTheDocument();
    });

    it("should have correct layout structure", () => {
      const { container } = render(<ModulesManager />);

      const mainContainer = container.querySelector(".space-y-6");
      expect(mainContainer).toBeInTheDocument();

      const gridContainer = container.querySelector(
        ".grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-3",
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("should render with initial filter states", () => {
      render(<ModulesManager />);

      const searchInput = screen.getByTestId(
        "search-input",
      ) as HTMLInputElement;
      const categorySelect = screen.getByTestId(
        "category-select",
      ) as HTMLSelectElement;

      expect(searchInput.value).toBe("");
      expect(categorySelect.value).toBe("all");
    });
  });

  describe("ModuleStatsGrid Integration", () => {
    it("should pass correct stats to ModuleStatsGrid", () => {
      render(<ModulesManager />);

      expect(screen.getByTestId("total-modules")).toHaveTextContent("3");
      expect(screen.getByTestId("active-modules")).toHaveTextContent("2");
      expect(screen.getByTestId("blocked-modules")).toHaveTextContent("1");
      expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
    });

    it("should update stats when modules change", () => {
      const updatedModules = [
        ...mockModules,
        {
          _id: "4",
          moduleName: "settings",
          name: "Settings Module",
          category: "system",
          isBlocked: false,
          isActive: true,
          lastModifiedAt: "2024-01-04T00:00:00Z",
          lastModifiedBy: mockModules[0].lastModifiedBy,
          __v: 0,
        },
      ];

      vi.mocked(useBlockedModules).mockReturnValue({
        modules: updatedModules,
        handleToggleModule: mockHandleToggleModule,
        isPending: false,
      });

      vi.mocked(useModuleStats).mockReturnValue({
        ...mockModuleStats,
        totalModules: 4,
        activeModules: 3,
      });

      const { rerender } = render(<ModulesManager />);
      rerender(<ModulesManager />);

      expect(screen.getByTestId("total-modules")).toHaveTextContent("4");
      expect(screen.getByTestId("active-modules")).toHaveTextContent("3");
    });
  });

  describe("Search Functionality", () => {
    it("should update search term when typing", async () => {
      const user = userEvent.setup();

      render(<ModulesManager />);

      const searchInput = screen.getByTestId("search-input");
      await user.type(searchInput, "users");

      expect(searchInput).toHaveValue("users");
      expect(useModuleFilters).toHaveBeenLastCalledWith(
        mockModules,
        "users",
        "all",
      );
    });

    it("should clear search term", async () => {
      const user = userEvent.setup();
      render(<ModulesManager />);

      const searchInput = screen.getByTestId("search-input");
      await user.type(searchInput, "test");
      await user.clear(searchInput);

      expect(searchInput).toHaveValue("");
    });

    it("should filter modules based on search term", async () => {
      const user = userEvent.setup();

      vi.mocked(useModuleFilters).mockImplementation((modules, search) => {
        if (search === "users") {
          return modules?.filter((m: any) => m.moduleName === "users");
        }
        return modules;
      });

      const { rerender } = render(<ModulesManager />);

      const searchInput = screen.getByTestId("search-input");
      await user.type(searchInput, "users");

      rerender(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByTestId("module-card-1")).toBeInTheDocument();
        expect(screen.queryByTestId("module-card-2")).not.toBeInTheDocument();
        expect(screen.queryByTestId("module-card-3")).not.toBeInTheDocument();
      });
    });
  });

    describe('Category Filtering', () => {
      it('should change category filter', async () => {
        const user = userEvent.setup();

        render(<ModulesManager />);

        const categorySelect = screen.getByTestId('category-select');
        await user.selectOptions(categorySelect, 'core');

        expect(categorySelect).toHaveValue('core');
        expect(useModuleFilters).toHaveBeenLastCalledWith(
          mockModules,
          '',
          'core'
        );
      });

      it('should filter modules by category', async () => {
        const user = userEvent.setup();

        vi.mocked(useModuleFilters).mockImplementation((modules, search, category) => {
          if (category === 'core') {
            return modules?.filter((m: any) => m.category === 'core');
          }
          return modules;
        });

        const { rerender } = render(<ModulesManager />);

        const categorySelect = screen.getByTestId('category-select');
        await user.selectOptions(categorySelect, 'core');

        rerender(<ModulesManager />);

        await waitFor(() => {
          expect(screen.getByTestId('module-card-1')).toBeInTheDocument();
          expect(screen.queryByTestId('module-card-2')).not.toBeInTheDocument();
          expect(screen.queryByTestId('module-card-3')).not.toBeInTheDocument();
        });
      });

      it('should show all modules when "all" is selected', async () => {
        const user = userEvent.setup();
        render(<ModulesManager />);

        const categorySelect = screen.getByTestId('category-select');
        await user.selectOptions(categorySelect, 'core');
        await user.selectOptions(categorySelect, 'all');

        expect(categorySelect).toHaveValue('all');

        mockModules.forEach((module) => {
          expect(screen.getByTestId(`module-card-${module._id}`)).toBeInTheDocument();
        });
      });
    });

    describe('Combined Filters', () => {
      it('should apply both search and category filters', async () => {
        const user = userEvent.setup();

        vi.mocked(useModuleFilters).mockImplementation((modules, search, category) => {
          let filtered = modules;
          if (search) {
            filtered = filtered?.filter((m: any) =>
              m.moduleName.toLowerCase().includes(search.toLowerCase())
            );
          }
          if (category !== 'all') {
            filtered = filtered?.filter((m: any) => m.category === category);
          }
          return filtered;
        });

        const { rerender } = render(<ModulesManager />);

        const searchInput = screen.getByTestId('search-input');
        const categorySelect = screen.getByTestId('category-select');

        await user.type(searchInput, 'reports');
        await user.selectOptions(categorySelect, 'features');

        rerender(<ModulesManager />);

        await waitFor(() => {
          expect(screen.getByTestId('module-card-2')).toBeInTheDocument();
          expect(screen.queryByTestId('module-card-1')).not.toBeInTheDocument();
          expect(screen.queryByTestId('module-card-3')).not.toBeInTheDocument();
        });
      });
    });

    describe('Module Toggle', () => {
      it('should call handleToggleModule when toggle button is clicked', async () => {
        const user = userEvent.setup();
        render(<ModulesManager />);

        const toggleButton = screen.getByTestId('toggle-button-1');
        await user.click(toggleButton);

        expect(mockHandleToggleModule).toHaveBeenCalledWith('users', true);
      });

      it('should toggle multiple modules', async () => {
        const user = userEvent.setup();
        render(<ModulesManager />);

        await user.click(screen.getByTestId('toggle-button-1'));
        await user.click(screen.getByTestId('toggle-button-2'));

        expect(mockHandleToggleModule).toHaveBeenCalledTimes(2);
        expect(mockHandleToggleModule).toHaveBeenCalledWith('users', true);
        expect(mockHandleToggleModule).toHaveBeenCalledWith('reports', false);
      });

      it('should disable toggle buttons when isPending is true', () => {

        vi.mocked(useBlockedModules).mockReturnValue({
          modules: mockModules,
          handleToggleModule: mockHandleToggleModule,
          isPending: true
        });

        render(<ModulesManager />);

        mockModules.forEach((module) => {
          const button = screen.getByTestId(`toggle-button-${module._id}`);
          expect(button).toBeDisabled();
        });
      });
    });

    describe('Recent Activities Integration', () => {
      it('should display last modified time for modules with recent activity', () => {
        render(<ModulesManager />);

        expect(screen.getByTestId('last-modified-1')).toHaveTextContent('5 min ago');
        expect(screen.getByTestId('last-modified-2')).toHaveTextContent('10 min ago');
        expect(screen.getByTestId('last-modified-3')).toHaveTextContent('15 min ago');
      });

      it('should not display last modified for modules without recent activity', () => {

        vi.mocked(useRecentActivities).mockReturnValue([
            { isBlocked: false, lastModifiedBy: 'Admin User', module: 'Users Module', time: '5 min ago' }
        ]);

        render(<ModulesManager />);

        expect(screen.getByTestId('last-modified-1')).toBeInTheDocument();
        expect(screen.queryByTestId('last-modified-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('last-modified-3')).not.toBeInTheDocument();
      });

      it('should call useRecentActivities with limit of 3', () => {

        render(<ModulesManager />);

        expect(useRecentActivities).toHaveBeenCalledWith(3);
      });
    });

    describe('Empty States', () => {
      it('should handle empty modules array', () => {

        vi.mocked(useBlockedModules).mockReturnValue({
          modules: [],
          handleToggleModule: mockHandleToggleModule,
          isPending: false
        });

      //   vi.mocked(useModuleFilters).mockReturnValue([]);

        render(<ModulesManager />);

        expect(screen.queryByTestId(/module-card-/)).not.toBeInTheDocument();
      });

      it('should show no results when filters match nothing', async () => {
        const user = userEvent.setup();

      //   vi.mocked(useModuleFilters).mockReturnValue([]);

        const { rerender } = render(<ModulesManager />);

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'nonexistent');

        rerender(<ModulesManager />);

        await waitFor(() => {
          expect(screen.queryByTestId(/module-card-/)).not.toBeInTheDocument();
        });
      });
    });

    describe('Module Card Props', () => {
      it('should pass correct props to each ModuleCard', () => {
        render(<ModulesManager />);

        mockModules.forEach((module) => {
          const card = screen.getByTestId(`module-card-${module._id}`);
          expect(card).toHaveAttribute('data-module-name', module.moduleName);

          const status = screen.getByTestId(`module-status-${module._id}`);
          expect(status).toHaveTextContent(module.isBlocked ? 'Blocked' : 'Active');
        });
      });

      it('should pass isPending to all module cards', () => {

        vi.mocked(useBlockedModules).mockReturnValue({
          modules: mockModules,
          handleToggleModule: mockHandleToggleModule,
          isPending: true
        });

        render(<ModulesManager />);

        mockModules.forEach((module) => {
          const button = screen.getByTestId(`toggle-button-${module._id}`);
          expect(button).toBeDisabled();
        });
      });
    });

    describe('Hook Integration', () => {
      it('should call all required hooks', () => {

        render(<ModulesManager />);

        expect(useBlockedModules).toHaveBeenCalled();
        expect(useRecentActivities).toHaveBeenCalledWith(3);
        expect(useModuleStats).toHaveBeenCalledWith(mockModules);
        expect(useModuleFilters).toHaveBeenCalledWith(mockModules, '', 'all');
      });

      it('should pass updated filters to useModuleFilters', async () => {
        const user = userEvent.setup();

        render(<ModulesManager />);

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'test');

        await waitFor(() => {
          expect(useModuleFilters).toHaveBeenLastCalledWith(
            mockModules,
            'test',
            'all'
          );
        });
      });
    });

    describe('Responsive Layout', () => {
      it('should have responsive grid classes', () => {
        const { container } = render(<ModulesManager />);

        const grid = container.querySelector('.md\\:grid-cols-2.lg\\:grid-cols-3');
        expect(grid).toBeInTheDocument();
      });

      it('should maintain layout structure', () => {
        const { container } = render(<ModulesManager />);

        const sections = container.querySelectorAll('.space-y-6 > *');
        expect(sections.length).toBe(3); // Stats, Filters, Grid
      });
    });

    describe('Edge Cases', () => {
      it('should handle undefined modules gracefully', () => {

        vi.mocked(useBlockedModules).mockReturnValue({
          modules: undefined,
          handleToggleModule: mockHandleToggleModule,
          isPending: false
        });

        expect(() => render(<ModulesManager />)).not.toThrow();
      });

      it('should handle rapid filter changes', async () => {
        const user = userEvent.setup();
        render(<ModulesManager />);

        const searchInput = screen.getByTestId('search-input');
        const categorySelect = screen.getByTestId('category-select');

        await user.type(searchInput, 'a');
        await user.selectOptions(categorySelect, 'core');
        await user.type(searchInput, 'b');
        await user.selectOptions(categorySelect, 'features');

        expect(searchInput).toHaveValue('ab');
        expect(categorySelect).toHaveValue('features');
      });

      it('should handle module with missing name in recent activities', () => {

        vi.mocked(useRecentActivities).mockReturnValue([
          {
            isBlocked: false,
            lastModifiedBy: 'Admin User',
            module: "",
            time: '5 min ago'
          }
        ]);

        expect(() => render(<ModulesManager />)).not.toThrow();
      });
    });

    describe('Performance', () => {
      it('should render efficiently with large module list', () => {

        const largeModuleList = Array.from({ length: 50 }, (_, i) => ({
          ...mockModules[0],
          _id: `${i}`,
          moduleName: `module${i}`,
          name: `Module ${i}`
        }));

        vi.mocked(useBlockedModules).mockReturnValue({
          modules: largeModuleList,
          handleToggleModule: mockHandleToggleModule,
          isPending: false
        });

        const { container } = render(<ModulesManager />);

      });
    });
});
