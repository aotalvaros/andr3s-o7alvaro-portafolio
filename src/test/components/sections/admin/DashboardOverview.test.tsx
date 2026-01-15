/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardOverview } from "../../../../components/sections/admin/DashboardOverview";
import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useSocketContext } from "@/context/SocketContext";
import { Socket } from "socket.io-client";
import { useDashboardStats } from "../../../../components/sections/admin/hooks/useDashboardStats";
import { useRecentActivities } from "../../../../components/sections/admin/hooks/useRecentActivities";
import {
  DashboardStat,
  RecentActivity,
} from "../../../../components/sections/admin/types/dashboard.types";
import { LucideIcon } from "lucide-react";

vi.mock("@/context/SocketContext");
vi.mock('@/components/sections/admin/hooks/useDashboardStats')
vi.mock('@/components/sections/admin/hooks/useRecentActivities')

vi.mock(
  "../../../../components/sections/admin/components/DashboardHeader",
  () => {
    return {
      DashboardHeader: vi.fn(() => (
        <div data-testid="DashboardHeader">DashboardHeader</div>
      )),
    };
  }
);

vi.mock("../../../../components/sections/admin/components/StatCard", () => {
  return {
    StatCard: vi.fn(({ stat }: { stat: any }) => (
      <div data-testid="StatCard">{stat.title}</div>
    )),
  };
});

vi.mock(
  "../../../../components/sections/admin/components/RecentActivityCard",
  () => {
    return {
      RecentActivityCard: vi.fn(({ activities }: { activities: any[] }) => (
        <div data-testid="RecentActivityCard">
          {activities.map((activity, index) => (
            <div key={index}>{activity.description}</div>
          ))}
        </div>
      )),
    };
  }
);

vi.mock(
  "../../../../components/sections/admin/components/SystemStatusCard",
  () => {
    return {
      SystemStatusCard: vi.fn(
        ({ isSocketOnline }: { isSocketOnline: boolean }) => (
          <div data-testid="SystemStatusCard">
            {isSocketOnline ? "Online" : "Offline"}
          </div>
        )
      ),
    };
  }
);

describe("DashboardOverview", () => {
  const mockStats: DashboardStat[] = [
    {
      title: "Total Users",
      value: "1,234",
      color: "blue",
      description: "Number of registered users",
      icon: {} as LucideIcon,
    },
    {
      title: "Active Sessions",
      value: "567",
      color: "green",
      description: "Users currently online",
      icon: {} as LucideIcon,
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      color: "gold",
      description: "Revenue this month",
      icon: {} as LucideIcon,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      color: "purple",
      description: "From visitors to customers",
      icon: {} as LucideIcon,
    },
  ];

  const mockActivities: RecentActivity[] = [
    {
      isBlocked: false,
      lastModifiedBy: "John Doe",
      module: "User Management",
      time: "2024-01-15",
    },
    {
      isBlocked: true,
      lastModifiedBy: "Jane Smith",
      module: "Order Processing",
      time: "2024-01-14",
    },
    {
      isBlocked: false,
      lastModifiedBy: "Admin User",
      module: "System Backup",
      time: "2024-01-13",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSocketContext).mockReturnValue({
      online: true,
      socket: { emit: vi.fn() } as unknown as Socket,
    });

    vi.mocked(useDashboardStats).mockReturnValue(mockStats);
    vi.mocked(useRecentActivities).mockReturnValue(mockActivities);
  });

  describe("Rendering", () => {
    it("should render dashboard overview with all sections", () => {
      render(<DashboardOverview />);

      expect(screen.getByTestId("DashboardHeader")).toBeInTheDocument();
      expect(screen.getByTestId("RecentActivityCard")).toBeInTheDocument();
      expect(screen.getByTestId("SystemStatusCard")).toBeInTheDocument();
    });

    it("should render DashboardHeader component", () => {
      render(<DashboardOverview />);

      const header = screen.getByTestId("DashboardHeader");
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("DashboardHeader");
    });

    it("should render all stat cards", () => {
      render(<DashboardOverview />);

      const statCards = screen.getAllByTestId("StatCard");
      expect(statCards).toHaveLength(4);
    });

    it("should render stat cards with correct titles", () => {
      render(<DashboardOverview />);

      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("Active Sessions")).toBeInTheDocument();
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    });

    it("should render RecentActivityCard component", () => {
      render(<DashboardOverview />);

      const activityCard = screen.getByTestId("RecentActivityCard");
      expect(activityCard).toBeInTheDocument();
    });

    it("should render SystemStatusCard component", () => {
      render(<DashboardOverview />);

      const statusCard = screen.getByTestId("SystemStatusCard");
      expect(statusCard).toBeInTheDocument();
    });
  });

  describe("Stats data integration", () => {
    it("should call useDashboardStats hook", () => {
      render(<DashboardOverview />);

      expect(useDashboardStats).toHaveBeenCalledTimes(1);
    });

    it("should render each stat from useDashboardStats", () => {
      render(<DashboardOverview />);

      mockStats.forEach((stat) => {
        expect(screen.getByText(stat.title)).toBeInTheDocument();
      });
    });

    it("should handle empty stats array", () => {
      vi.mocked(useDashboardStats).mockReturnValue([]);

      render(<DashboardOverview />);

      const statCards = screen.queryAllByTestId("StatCard");
      expect(statCards).toHaveLength(0);
    });

    it("should handle single stat", () => {
      vi.mocked(useDashboardStats).mockReturnValue([mockStats[0]]);

      render(<DashboardOverview />);

      const statCards = screen.getAllByTestId("StatCard");
      expect(statCards).toHaveLength(1);
      expect(screen.getByText("Total Users")).toBeInTheDocument();
    });

    it("should render stats in correct order", () => {
      render(<DashboardOverview />);

      const statCards = screen.getAllByTestId("StatCard");

      expect(statCards[0]).toHaveTextContent("Total Users");
      expect(statCards[1]).toHaveTextContent("Active Sessions");
      expect(statCards[2]).toHaveTextContent("Total Revenue");
      expect(statCards[3]).toHaveTextContent("Conversion Rate");
    });
  });

  describe("Recent activities integration", () => {
    it("should call useRecentActivities hook with limit of 3", () => {
      render(<DashboardOverview />);

      expect(useRecentActivities).toHaveBeenCalledWith(3);
      expect(useRecentActivities).toHaveBeenCalledTimes(1);
    });

    it("should handle empty activities array", () => {
      vi.mocked(useRecentActivities).mockReturnValue([]);

      render(<DashboardOverview />);

      const activities = screen.queryAllByTestId(/^activity-/);
      expect(activities).toHaveLength(0);
    });
  });

  describe("Socket status integration", () => {
    it("should call useSocketContext hook", () => {
      render(<DashboardOverview />);

      expect(useSocketContext).toHaveBeenCalledTimes(1);
    });

    it("should show online status when socket is connected", () => {
      vi.mocked(useSocketContext).mockReturnValue({
        online: true,
        socket: { emit: vi.fn() } as unknown as Socket,
      });

      render(<DashboardOverview />);

      const statusCard = screen.getByTestId("SystemStatusCard");
      expect(statusCard).toHaveTextContent("Online");
    });

    it("should show offline status when socket is disconnected", () => {
      vi.mocked(useSocketContext).mockReturnValue({
        online: false,
        socket: { emit: vi.fn() } as unknown as Socket,
      });

      render(<DashboardOverview />);

      const statusCard = screen.getByTestId("SystemStatusCard");
      expect(statusCard).toHaveTextContent("Offline");
    });

    it("should pass correct socket status to SystemStatusCard", () => {
      const mockSocket = { emit: vi.fn() } as unknown as Socket;

      vi.mocked(useSocketContext).mockReturnValue({
        online: true,
        socket: mockSocket,
      });

      render(<DashboardOverview />);

      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should update when socket status changes", () => {
      const { rerender } = render(<DashboardOverview />);

      expect(screen.getByText("Online")).toBeInTheDocument();

      vi.mocked(useSocketContext).mockReturnValue({
        online: false,
        socket: { emit: vi.fn() } as unknown as Socket,
      });

      rerender(<DashboardOverview />);

      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });

  describe("Layout structure", () => {
    it("should have main container with space-y-6 class", () => {
      const { container } = render(<DashboardOverview />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("space-y-6");
    });

    it("should have stats section with grid layout", () => {
      const { container } = render(<DashboardOverview />);

      const statsSection = container.querySelector("section");
      expect(statsSection).toHaveClass("grid", "gap-4");
    });

    it("should have bottom section with grid layout", () => {
      const { container } = render(<DashboardOverview />);

      const sections = container.querySelectorAll("section");
      const bottomSection = sections[1];

      expect(bottomSection).toHaveClass("grid", "gap-4", "md:grid-cols-2");
    });

    it("should render sections in correct order", () => {
      const { container } = render(<DashboardOverview />);

      const children = Array.from(container.firstChild?.childNodes || []);

      // First child should have DashboardHeader
      expect(children[0]).toContainElement(
        screen.getByTestId("DashboardHeader")
      );

      // Second should be stats section
      expect(children[1]).toContainElement(
        screen.getAllByTestId("StatCard")[0]
      );

      // Third should be activities/status section
      expect(children[2]).toContainElement(
        screen.getByTestId("RecentActivityCard")
      );
    });
  });

  describe("Component composition", () => {
    it("should render all child components together", () => {
      render(<DashboardOverview />);

      expect(screen.getByTestId("DashboardHeader")).toBeInTheDocument();
      expect(screen.getAllByTestId("StatCard")).toHaveLength(4);
      expect(screen.getByTestId("RecentActivityCard")).toBeInTheDocument();
      expect(screen.getByTestId("SystemStatusCard")).toBeInTheDocument();
    });

    it("should maintain structure with different data sizes", () => {
      vi.mocked(useDashboardStats).mockReturnValue([
        mockStats[0],
        mockStats[1],
      ]);
      vi.mocked(useRecentActivities).mockReturnValue([mockActivities[0]]);

      render(<DashboardOverview />);

      expect(screen.getByTestId("DashboardHeader")).toBeInTheDocument();
      expect(screen.getAllByTestId("StatCard")).toHaveLength(2);
      expect(screen.getByTestId("SystemStatusCard")).toBeInTheDocument();
    });

    it("should handle all data sources being empty", () => {
      vi.mocked(useDashboardStats).mockReturnValue([]);
      vi.mocked(useRecentActivities).mockReturnValue([]);

      render(<DashboardOverview />);

      expect(screen.getByTestId("DashboardHeader")).toBeInTheDocument();
      expect(screen.queryAllByTestId("StatCard")).toHaveLength(0);
      expect(screen.queryAllByTestId(/^activity-/)).toHaveLength(0);
      expect(screen.getByTestId("SystemStatusCard")).toBeInTheDocument();
    });
  });

  describe("Key prop for stat cards", () => {

    it("should handle stats with duplicate titles", () => {
      const duplicateStats = [
        { ...mockStats[0], title: "Same Title" },
        { ...mockStats[1], title: "Same Title" },
      ];

      vi.mocked(useDashboardStats).mockReturnValue(duplicateStats);

      render(<DashboardOverview />);

      const statCards = screen.getAllByTestId("StatCard");
      expect(statCards).toHaveLength(2);
    });
  });

  describe("Responsive behavior", () => {
    it("should have responsive grid classes for stats", () => {
      const { container } = render(<DashboardOverview />);

      const statsSection = container.querySelector("section");
      expect(statsSection).toHaveClass("md:grid-cols-2", "lg:grid-cols-4");
    });

    it("should have responsive grid classes for bottom section", () => {
      const { container } = render(<DashboardOverview />);

      const sections = container.querySelectorAll("section");
      const bottomSection = sections[1];

      expect(bottomSection).toHaveClass("md:grid-cols-2");
    });
  });

  describe("Edge cases", () => {
    it("should handle very large number of stats", () => {
      const manyStats: DashboardStat[] = Array.from({ length: 20 }, (_, i) => ({
        title: `Stat ${i + 1}`,
        value: `${i * 100}`,
        color: "blue",
        description: `Description for stat ${i + 1}`,
        icon: {} as LucideIcon,
      }));

      vi.mocked(useDashboardStats).mockReturnValue(manyStats);

      render(<DashboardOverview />);

      const statCards = screen.getAllByTestId("StatCard");
      expect(statCards).toHaveLength(20);
    });

    it("should handle stats with special characters in title", () => {
      const specialStats: DashboardStat[] = [
        {
          title: "Revenue ($)",
          value: "$100,000",
          color: "gold",
          description: "Total revenue",
          icon: {} as LucideIcon,
        },
        {
          title: "Users (Active/Total)",
          value: "500/1000",
          color: "green",
          description: "Active vs Total Users",
          icon: {} as LucideIcon,
        },
      ];

      vi.mocked(useDashboardStats).mockReturnValue(specialStats);

      render(<DashboardOverview />);

      expect(screen.getByText("Revenue ($)")).toBeInTheDocument();
      expect(screen.getByText("Users (Active/Total)")).toBeInTheDocument();
    });

    it("should handle socket context with null socket", () => {
      vi.mocked(useSocketContext).mockReturnValue({
        online: false,
        socket: null as any,
      });

      render(<DashboardOverview />);

      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });

  describe("Rerender behavior", () => {
    it("should update when stats data changes", () => {
      const { rerender } = render(<DashboardOverview />);

      expect(screen.getByText("Total Users")).toBeInTheDocument();

      const newStats: DashboardStat[] = [
        {
            title: "New Stat",
            value: "999",
            color: "red",
            description: "A new statistic",
            icon: {} as LucideIcon,
        }
      ];

      vi.mocked(useDashboardStats).mockReturnValue(newStats);

      rerender(<DashboardOverview />);

      expect(screen.getByText("New Stat")).toBeInTheDocument();
      expect(screen.queryByText("Total Users")).not.toBeInTheDocument();
    });

    it("should update when socket status changes", () => {
      const { rerender } = render(<DashboardOverview />);

      expect(screen.getByText("Online")).toBeInTheDocument();

      vi.mocked(useSocketContext).mockReturnValue({
        online: false,
        socket: { emit: vi.fn() } as unknown as Socket,
      });

      rerender(<DashboardOverview />);

      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });
});
