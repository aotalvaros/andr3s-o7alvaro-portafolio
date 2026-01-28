import { ModuleCard } from '../../../../../components/sections/admin/modules/components/ModuleCard';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe('ModuleCard Component', () => {
  const mockOnToggle = vi.fn();

  const mockModuleActive = {
    _id: '1',
    name: 'User Management',
    moduleName: 'users',
    category: 'component',
    isBlocked: false
  };

  const mockModuleBlocked = {
    _id: '2',
    name: 'Reports Module',
    moduleName: 'reports',
    category: 'feature',
    isBlocked: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render module name', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('should render module category', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('component')).toBeInTheDocument();
    });

    it('should render with correct card structure', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const card = container.querySelector('.relative.bg-muted\\/60');
      expect(card).toBeInTheDocument();
    });

    it('should capitalize category text', () => {
     render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const categoryElement = screen.getByText('component');
      expect(categoryElement).toHaveClass('capitalize');
    });
  });

  describe('Category Icons', () => {
    it('should display API icon for api category', () => {
      const apiModule = { ...mockModuleActive, category: 'api' };
      render(
        <ModuleCard
          module={apiModule}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('🔌')).toBeInTheDocument();
    });

    it('should display component icon for component category', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('🧩')).toBeInTheDocument();
    });

    it('should display feature icon for feature category', () => {
      render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('should display integration icon for integration category', () => {
      const integrationModule = { ...mockModuleActive, category: 'integration' };
      render(
        <ModuleCard
          module={integrationModule}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('🔗')).toBeInTheDocument();
    });

    it('should display default icon for unknown category', () => {
      const unknownModule = { ...mockModuleActive, category: 'unknown' };
      render(
        <ModuleCard
          module={unknownModule}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('📦')).toBeInTheDocument();
    });
  });

  describe('Blocked Status Badge', () => {
    it('should display "Bloqueado" badge when module is blocked', () => {
      render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByTestId('blocked-badge')).toBeInTheDocument();
    });

    it('should not display "Bloqueado" badge when module is active', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.queryByTestId('blocked-badge')).not.toBeInTheDocument();
    });

    it('should have correct badge styling when blocked', () => {
      render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const badge = screen.getByTestId('blocked-badge');
      expect(badge).toHaveClass('bg-red-500/10', 'text-red-500', 'border-red-500/20');
    });
  });

  describe('Lock/Unlock Icons', () => {
    it('should display Lock icon when module is blocked', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const lockIcon = container.querySelector('.text-red-500');
      expect(lockIcon).toBeInTheDocument();
    });

    it('should display Unlock icon when module is active', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const unlockIcon = container.querySelector('.text-green-500');
      expect(unlockIcon).toBeInTheDocument();
    });

    it('should have red color for Lock icon', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const lockIcon = container.querySelector('.h-4.w-4.text-red-500');
      expect(lockIcon).toBeInTheDocument();
    });

    it('should have green color for Unlock icon', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const unlockIcon = container.querySelector('.h-4.w-4.text-green-500');
      expect(unlockIcon).toBeInTheDocument();
    });
  });

  describe('Switch Component', () => {
    it('should render switch in checked state when module is active', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeChecked();
    });

    it('should render switch in unchecked state when module is blocked', () => {
      render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeChecked();
    });

    it('should have hover cursor pointer class', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = container.querySelector('.hover\\:cursor-pointer');
      expect(switchElement).toBeInTheDocument();
    });

    it('should be enabled when isPending is false', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeDisabled();
    });

    it('should be disabled when isPending is true', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={true}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });
  });

  describe('Toggle Functionality', () => {
    it('should call onToggle with correct params when blocking an active module', async () => {
      const user = userEvent.setup();
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(mockOnToggle).toHaveBeenCalledWith('users', true);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onToggle with correct params when unblocking a blocked module', async () => {
      const user = userEvent.setup();
      render(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(mockOnToggle).toHaveBeenCalledWith('reports', false);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should not call onToggle when switch is disabled', async () => {
      const user = userEvent.setup();
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={true}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(mockOnToggle).not.toHaveBeenCalled();
    });

    it('should handle multiple toggle clicks', async () => {
      const user = userEvent.setup();
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('Last Modified Display', () => {
    it('should display last modified time when provided', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          lastModified="5 min ago"
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/5 min ago/)).toBeInTheDocument();
    });

    it('should display "N/A" when lastModified is not provided', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });

    it('should display "N/A" when lastModified is undefined', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          lastModified={undefined}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });

  });

  describe('Visual States', () => {
    it('should display all elements for active module', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          lastModified="1 min ago"
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('component')).toBeInTheDocument();
      expect(screen.getByText('🧩')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked();
      expect(screen.getByText(/1 min ago/)).toBeInTheDocument();
      expect(screen.queryByTestId('blocked-badge')).not.toBeInTheDocument();
    });

    it('should display all elements for blocked module', () => {
      render(
        <ModuleCard
          module={mockModuleBlocked}
          lastModified="10 min ago"
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('Reports Module')).toBeInTheDocument();
      expect(screen.getByText('feature')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByRole('switch')).not.toBeChecked();
      expect(screen.getByText(/10 min ago/)).toBeInTheDocument();
      expect(screen.getByTestId('blocked-badge')).toBeInTheDocument();
    });

    it('should show disabled state visually when isPending', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={true}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct header layout', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const header = container.querySelector('.flex.items-start.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('should have icon and title grouped together', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const iconGroup = container.querySelector('.flex.items-center.gap-2');
      expect(iconGroup).toBeInTheDocument();
    });

    it('should have proper spacing in content area', () => {
      const { container } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const content = container.querySelector('.space-y-4');
      expect(content).toBeInTheDocument();
    });

    it('should render large title text', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const title = screen.getByText('User Management');
      expect(title).toHaveClass('text-lg');
    });
  });

  describe('Props Validation', () => {
    it('should render with all required props', () => {
      expect(() =>
        render(
          <ModuleCard
            module={mockModuleActive}
            isPending={false}
            onToggle={mockOnToggle}
          />
        )
      ).not.toThrow();
    });

    it('should render with all props including optional lastModified', () => {
      expect(() =>
        render(
          <ModuleCard
            module={mockModuleActive}
            lastModified="3 days ago"
            isPending={false}
            onToggle={mockOnToggle}
          />
        )
      ).not.toThrow();
    });

    it('should accept Readonly props correctly', () => {
      const readonlyProps = {
        module: mockModuleActive,
        lastModified: '1 hour ago',
        isPending: false,
        onToggle: mockOnToggle
      } as const;

      expect(() =>
        render(<ModuleCard {...readonlyProps} />)
      ).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty module name gracefully', () => {
      const emptyNameModule = { ...mockModuleActive, name: '' };
      render(
        <ModuleCard
          module={emptyNameModule}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('component')).toBeInTheDocument();
    });

    it('should handle very long module names', () => {
      const longNameModule = {
        ...mockModuleActive,
        name: 'Very Long Module Name That Should Be Handled Properly In The UI Layout'
      };

      render(
        <ModuleCard
          module={longNameModule}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/Very Long Module Name/)).toBeInTheDocument();
    });

    it('should handle rapid switch toggles', async () => {
      const user = userEvent.setup();
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');

      // Rapid clicks
      await user.tripleClick(switchElement);

      expect(mockOnToggle).toHaveBeenCalled();
    });

    it('should handle empty lastModified string', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          lastModified=""
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible switch role', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('should have descriptive text for status', () => {
      render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText('Bloqueado')).toBeInTheDocument();
    });
  });

  describe('Dynamic State Changes', () => {
    it('should update when module prop changes', () => {
      const { rerender } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.queryByTestId('blocked-badge')).not.toBeInTheDocument();

      rerender(
        <ModuleCard
          module={mockModuleBlocked}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByTestId('blocked-badge')).toBeInTheDocument();
    });

    it('should update when isPending prop changes', () => {
      const { rerender } = render(
        <ModuleCard
          module={mockModuleActive}
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      let switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeDisabled();

      rerender(
        <ModuleCard
          module={mockModuleActive}
          isPending={true}
          onToggle={mockOnToggle}
        />
      );

      switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('should update lastModified display dynamically', () => {
      const { rerender } = render(
        <ModuleCard
          module={mockModuleActive}
          lastModified="1 min ago"
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/1 min ago/)).toBeInTheDocument();

      rerender(
        <ModuleCard
          module={mockModuleActive}
          lastModified="2 min ago"
          isPending={false}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText(/2 min ago/)).toBeInTheDocument();
    });
  });
});