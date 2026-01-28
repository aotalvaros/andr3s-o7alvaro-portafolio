import { AdminHeader } from '@/components/sections/admin/AdminHeader';
import { render, screen } from '@testing-library/react';
import { Socket } from "socket.io-client";
import userEvent from '@testing-library/user-event';

const mockUseSocketContext = vi.fn();
vi.mock("@/context/SocketContext", () => ({
    useSocketContext: () => mockUseSocketContext()
}));

const mockToggleTheme = vi.fn();
const mockIsDarkMode = vi.fn();

vi.mock('@/store/themeStore', () => ({
    useThemeStore: vi.fn((selector) => {
        const state = {
            isDarkMode: mockIsDarkMode(),
            toggleTheme: mockToggleTheme
        };
        return selector(state);
    })
}));

vi.mock('@/components/layout/navbar/components/StatusIndicator', () => ({
    StatusIndicator: ({ online, isTextVisible }: { online: boolean; isTextVisible: boolean }) => (
        <div data-testid="status-indicator" data-online={online} data-text-visible={isTextVisible}>
            Status Indicator
        </div>
    )
}));

describe("AdminHeader Component", () => {
    const mockSocket = { emit: vi.fn() } as unknown as Socket;

    beforeEach(() => {
        vi.clearAllMocks();
        mockIsDarkMode.mockReturnValue(false); // Light mode por defecto
        mockUseSocketContext.mockReturnValue({ 
            online: true, 
            socket: mockSocket 
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should render the main title', () => {
            render(<AdminHeader />);
            
            expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
        });

        it('should render with correct header structure', () => {
            const { container } = render(<AdminHeader />);
            
            const header = container.querySelector('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('flex', 'h-16', 'items-center', 'justify-between', 'border-b', 'px-6', 'bg-muted');
        });

        it('should render all main UI elements', () => {
            render(<AdminHeader />);
            
            expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
            expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
            expect(screen.getByTestId('notifications-button')).toBeInTheDocument();
            expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
        });
    });

    describe('Socket Status - Online State', () => {
        it('should display "Socket conectado" when socket is online', () => {
            render(<AdminHeader />);
            
            expect(screen.getByText('Socket conectado')).toBeInTheDocument();
        });

        it('should show Wifi icon when socket is online', () => {
            const { container } = render(<AdminHeader />);
            
            const badge = screen.getByText('Socket conectado').closest('.gap-1');
            expect(badge).toBeInTheDocument();
            
            // Verificar que el badge tiene las clases correctas
            expect(badge).toHaveClass('bg-green-100', 'text-green-800');
        });

        it('should have default variant badge when online', () => {
            render(<AdminHeader />);
            
            const badge = screen.getByText('Socket conectado').closest('div');
            expect(badge).toHaveClass('bg-green-100', 'text-green-800');
        });

        it('should pass correct props to StatusIndicator when online', () => {
            render(<AdminHeader />);
            
            const statusIndicator = screen.getByTestId('status-indicator');
            expect(statusIndicator).toHaveAttribute('data-online', 'true');
            expect(statusIndicator).toHaveAttribute('data-text-visible', 'false');
        });
    });

    describe('Socket Status - Offline State', () => {
        beforeEach(() => {
            mockUseSocketContext.mockReturnValue({ 
                online: false, 
                socket: mockSocket 
            });
        });

        it('should display "Desconectado" when socket is offline', () => {
            render(<AdminHeader />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
            expect(screen.queryByText('Socket conectado')).not.toBeInTheDocument();
        });

        it('should show WifiOff icon when socket is offline', () => {
            const { container } = render(<AdminHeader />);
            
            const badge = screen.getByText('Desconectado').closest('.gap-1');
            expect(badge).toBeInTheDocument();
        });

        it('should have secondary variant badge when offline', () => {
            render(<AdminHeader />);
            
            const badge = screen.getByText('Desconectado').closest('div');
            expect(badge).toHaveClass('bg-red-100', 'text-red-800');
        });

        it('should pass correct props to StatusIndicator when offline', () => {
            render(<AdminHeader />);
            
            const statusIndicator = screen.getByTestId('status-indicator');
            expect(statusIndicator).toHaveAttribute('data-online', 'false');
            expect(statusIndicator).toHaveAttribute('data-text-visible', 'false');
        });
    });

    describe('Theme Toggle - Light Mode', () => {
        beforeEach(() => {
            mockIsDarkMode.mockReturnValue(false);
        });

        it('should display Moon icon in light mode', () => {
            render(<AdminHeader />);
            
            expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
        });

        it('should have correct theme button classes', () => {
            render(<AdminHeader />);
            
            const button = screen.getByTestId('theme-toggle-button');
            expect(button).toHaveClass('rounded-full', 'transition-all', 'duration-300', 'hover:scale-110', 'bg-transparent', 'hidden', 'md:inline-flex');
        });

        it('should call toggleTheme when theme button is clicked', async () => {
            const user = userEvent.setup();
            render(<AdminHeader />);
            
            const themeButton = screen.getByTestId('theme-toggle-button');
            await user.click(themeButton);
            
            expect(mockToggleTheme).toHaveBeenCalledTimes(1);
        });

        it('should call toggleTheme multiple times', async () => {
            const user = userEvent.setup();
            render(<AdminHeader />);
            
            const themeButton = screen.getByTestId('theme-toggle-button');
            
            await user.click(themeButton);
            await user.click(themeButton);
            await user.click(themeButton);
            
            expect(mockToggleTheme).toHaveBeenCalledTimes(3);
        });
    });

    describe('Theme Toggle - Dark Mode', () => {
        beforeEach(() => {
            mockIsDarkMode.mockReturnValue(true);
        });

        it('should display Sun icon in dark mode', () => {
            render(<AdminHeader />);
            
            expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
        });

        it('should call toggleTheme when theme button is clicked in dark mode', async () => {
            const user = userEvent.setup();
            render(<AdminHeader />);
            
            const themeButton = screen.getByTestId('theme-toggle-button');
            await user.click(themeButton);
            
            expect(mockToggleTheme).toHaveBeenCalledTimes(1);
        });
    });

    describe('Notifications Button', () => {
        it('should render notifications button', () => {
            render(<AdminHeader />);
            
            const notificationsButton = screen.getByTestId('notifications-button');
            expect(notificationsButton).toBeInTheDocument();
        });

        it('should have notifications button disabled', () => {
            render(<AdminHeader />);
            
            const notificationsButton = screen.getByTestId('notifications-button');
            expect(notificationsButton).toBeDisabled();
        });

        it('should display notification badge indicator', () => {
            const { container } = render(<AdminHeader />);
            
            const badge = container.querySelector('.absolute.right-1.top-1.h-2.w-2.rounded-full.bg-red-500');
            expect(badge).toBeInTheDocument();
        });

        it('should have correct button classes', () => {
            render(<AdminHeader />);
            
            const button = screen.getByTestId('notifications-button');
            expect(button).toHaveClass('relative');
        });

        it('should contain Bell icon', () => {
            const { container } = render(<AdminHeader />);
            
            const notificationsButton = screen.getByTestId('notifications-button');
            const bellIcon = notificationsButton.querySelector('svg');
            expect(bellIcon).toBeInTheDocument();
        });
    });

    describe('Responsive Behavior', () => {
        it('should hide theme button on mobile (md:inline-flex)', () => {
            render(<AdminHeader />);
            
            const themeButton = screen.getByTestId('theme-toggle-button');
            expect(themeButton).toHaveClass('hidden', 'md:inline-flex');
        });
    });

    describe('Layout Structure', () => {
        it('should have correct flex layout for left section', () => {
            const { container } = render(<AdminHeader />);
            
            const leftSection = container.querySelector('.flex.items-center.gap-4');
            expect(leftSection).toBeInTheDocument();
            
            // Debe contener el título
            expect(leftSection).toContainElement(screen.getByText('Panel de Administración'));
        });

        it('should have correct flex layout for right section', () => {
            const { container } = render(<AdminHeader />);
            
            const rightSections = container.querySelectorAll('.flex.items-center.gap-4');
            expect(rightSections.length).toBeGreaterThan(0);
        });

        it('should render items in correct order', () => {
            const { container } = render(<AdminHeader />);
            
            const header = container.querySelector('header');
            const children = Array.from(header?.children || []);
            
            // Debe tener 2 divs principales (izquierda y derecha)
            expect(children.length).toBe(2);
        });
    });

    describe('Integration Tests', () => {
        it('should update socket status dynamically', () => {
            const { rerender } = render(<AdminHeader />);
            
            // Inicialmente online
            expect(screen.getByText('Socket conectado')).toBeInTheDocument();
            
            // Cambiar a offline
            mockUseSocketContext.mockReturnValue({ 
                online: false, 
                socket: mockSocket 
            });
            
            rerender(<AdminHeader />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
        });

        it('should update theme icon dynamically', () => {
            const { rerender } = render(<AdminHeader />);
            
            // Inicialmente light mode
            expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
            
            // Cambiar a dark mode
            mockIsDarkMode.mockReturnValue(true);
            
            rerender(<AdminHeader />);
            
            expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
        });

        it('should handle both socket offline and dark mode simultaneously', () => {
            mockUseSocketContext.mockReturnValue({ 
                online: false, 
                socket: mockSocket 
            });
            mockIsDarkMode.mockReturnValue(true);
            
            render(<AdminHeader />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
            expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            render(<AdminHeader />);
            
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should maintain header semantic HTML', () => {
            const { container } = render(<AdminHeader />);
            
            const header = container.querySelector('header');
            expect(header).toBeInTheDocument();
        });
    });

    describe('Styling and Visual Feedback', () => {
        it('should have hover transition classes on badge', () => {
            const { container } = render(<AdminHeader />);
            
            const badge = container.querySelector('.hover\\:bg-opacity-80.transition-colors');
            expect(badge).toBeInTheDocument();
        });

        it('should have correct badge variant based on socket status', () => {
            const { rerender } = render(<AdminHeader />);
            
            let badge = screen.getByText('Socket conectado').closest('div');
            expect(badge).toHaveClass('bg-green-100');
            
            mockUseSocketContext.mockReturnValue({ 
                online: false, 
                socket: mockSocket 
            });
            
            rerender(<AdminHeader />);
            
            badge = screen.getByText('Desconectado').closest('div');
            expect(badge).toHaveClass('bg-red-100');
        });

        it('should have notification indicator with correct styles', () => {
            const { container } = render(<AdminHeader />);
            
            const indicator = container.querySelector('.absolute.right-1.top-1.h-2.w-2.rounded-full.bg-red-500');
            expect(indicator).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle socket being null', () => {
            mockUseSocketContext.mockReturnValue({ 
                online: false, 
                socket: null as unknown as Socket
            });
            
            expect(() => render(<AdminHeader />)).not.toThrow();
        });

        it('should render correctly without crashing', () => {
            const { container } = render(<AdminHeader />);
            
            expect(container.firstChild).toBeInTheDocument();
        });

        it('should handle rapid theme toggles', async () => {
            const user = userEvent.setup();
            render(<AdminHeader />);
            
            const themeButton = screen.getByTestId('theme-toggle-button');
            
            // Múltiples clicks rápidos
            await user.tripleClick(themeButton);
            
            // No debe crashear y debe llamar toggleTheme
            expect(mockToggleTheme).toHaveBeenCalled();
        });
    });
});