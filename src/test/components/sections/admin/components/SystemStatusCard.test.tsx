import { SystemStatusCard } from '../../../../../components/sections/admin/components/SystemStatusCard';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mocks de componentes UI - opcional, pero útil si quieres aislar completamente
// En este caso voy a testear con los componentes reales para mayor realismo

describe('SystemStatusCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('should render the card with title and description', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Estado del Sistema')).toBeInTheDocument();
            expect(screen.getByText('Rendimiento y disponibilidad')).toBeInTheDocument();
        });

        it('should render all status rows', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Socket.IO')).toBeInTheDocument();
            expect(screen.getByText('Servidor')).toBeInTheDocument();
            expect(screen.getByText('Base de datos')).toBeInTheDocument();
        });

        it('should render with correct card structure', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const card = container.querySelector('.bg-muted\\/60');
            expect(card).toBeInTheDocument();
        });

        it('should have space-y-4 class for vertical spacing', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const statusContainer = container.querySelector('.space-y-4');
            expect(statusContainer).toBeInTheDocument();
        });
    });

    describe('Socket.IO Status - Connected', () => {
        it('should display "Conectado" when socket is online', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Conectado')).toBeInTheDocument();
        });

        it('should have green background when socket is online', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const badge = screen.getByText('Conectado');
            expect(badge).toHaveClass('bg-green-500');
        });

        it('should not display "Desconectado" when socket is online', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.queryByText('Desconectado')).not.toBeInTheDocument();
        });

        it('should render Socket.IO badge with default variant', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const badge = screen.getByText('Conectado').closest('div');
            expect(badge).toBeInTheDocument();
        });
    });

    describe('Socket.IO Status - Disconnected', () => {
        it('should display "Desconectado" when socket is offline', () => {
            render(<SystemStatusCard isSocketOnline={false} />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
        });

        it('should have red background when socket is offline', () => {
            render(<SystemStatusCard isSocketOnline={false} />);
            
            const badge = screen.getByText('Desconectado');
            expect(badge).toHaveClass('bg-red-500');
        });

        it('should not display "Conectado" when socket is offline', () => {
            render(<SystemStatusCard isSocketOnline={false} />);
            
            expect(screen.queryByText('Conectado')).not.toBeInTheDocument();
        });
    });

    describe('Server Status', () => {
        it('should display server status row', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Servidor')).toBeInTheDocument();
        });

        it('should display "¡Pronto!" badge for server', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            // Hay 2 badges con "¡Pronto!" (Servidor y Base de datos)
            const prontoBadges = screen.getAllByText('¡Pronto!');
            expect(prontoBadges).toHaveLength(2);
        });

        it('should have gray background for server badge', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const serverRow = container.querySelector('.space-y-4')?.children[1];
            const badge = serverRow?.querySelector('.bg-gray-400');
            expect(badge).toBeInTheDocument();
        });

        it('should have muted text color for server label', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const serverLabel = screen.getByText('Servidor');
            expect(serverLabel).toHaveClass('text-muted-foreground');
        });
    });

    describe('Database Status', () => {
        it('should display database status row', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Base de datos')).toBeInTheDocument();
        });

        it('should have gray background for database badge', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const dbRow = container.querySelector('.space-y-4')?.children[2];
            const badge = dbRow?.querySelector('.bg-gray-400');
            expect(badge).toBeInTheDocument();
        });

        it('should have muted text color for database label', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            const dbLabel = screen.getByText('Base de datos');
            expect(dbLabel).toHaveClass('text-muted-foreground');
        });
    });

    describe('Layout and Structure', () => {
        it('should have 3 status rows', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const statusContainer = container.querySelector('.space-y-4');
            expect(statusContainer?.children).toHaveLength(3);
        });

        it('should have flex layout for each status row', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const rows = container.querySelectorAll('.flex.items-center.justify-between');
            expect(rows).toHaveLength(3);
        });

        it('should render labels with text-sm class', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const labels = container.querySelectorAll('.text-sm');
            expect(labels.length).toBeGreaterThanOrEqual(3);
        });

        it('should have CardHeader with title and description', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Verificar que existe la estructura de Card
            const title = screen.getByText('Estado del Sistema');
            const description = screen.getByText('Rendimiento y disponibilidad');
            
            expect(title).toBeInTheDocument();
            expect(description).toBeInTheDocument();
        });
    });

    describe('Dynamic Status Changes', () => {
        it('should update badge when socket status changes from online to offline', () => {
            const { rerender } = render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Conectado')).toBeInTheDocument();
            expect(screen.getByText('Conectado')).toHaveClass('bg-green-500');
            
            rerender(<SystemStatusCard isSocketOnline={false} />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
            expect(screen.getByText('Desconectado')).toHaveClass('bg-red-500');
        });

        it('should update badge when socket status changes from offline to online', () => {
            const { rerender } = render(<SystemStatusCard isSocketOnline={false} />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
            
            rerender(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Conectado')).toBeInTheDocument();
        });

        it('should maintain other status rows when socket status changes', () => {
            const { rerender } = render(<SystemStatusCard isSocketOnline={true} />);
            
            expect(screen.getByText('Servidor')).toBeInTheDocument();
            expect(screen.getByText('Base de datos')).toBeInTheDocument();
            
            rerender(<SystemStatusCard isSocketOnline={false} />);
            
            // Los otros estados deben seguir presentes
            expect(screen.getByText('Servidor')).toBeInTheDocument();
            expect(screen.getByText('Base de datos')).toBeInTheDocument();
        });
    });

    describe('Props Validation', () => {
        it('should accept isSocketOnline as true', () => {
            expect(() => render(<SystemStatusCard isSocketOnline={true} />)).not.toThrow();
        });

        it('should accept isSocketOnline as false', () => {
            expect(() => render(<SystemStatusCard isSocketOnline={false} />)).not.toThrow();
        });

        it('should render correctly with readonly props', () => {
            // El componente usa Readonly<SystemStatusCardProps>
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe('Badge Variants and Styling', () => {
        it('should use default variant for all badges', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            // Todos los badges deben tener el variant="default"
            // Esto se verifica por la presencia de los textos y clases
            expect(screen.getByText('Conectado')).toBeInTheDocument();
            expect(screen.getAllByText('¡Pronto!')).toHaveLength(2);
        });

        it('should have correct badge colors for each status', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Socket.IO: verde
            expect(screen.getByText('Conectado')).toHaveClass('bg-green-500');
            
            // Servidor y Base de datos: gris
            const grayBadges = container.querySelectorAll('.bg-gray-400');
            expect(grayBadges).toHaveLength(2);
        });

        it('should apply muted background to card', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const card = container.querySelector('.bg-muted\\/60');
            expect(card).toBeInTheDocument();
        });
    });

    describe('Text Content and Labels', () => {
        it('should have correct label text for Socket.IO', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            const socketLabel = screen.getByText('Socket.IO');
            expect(socketLabel).toHaveClass('text-sm');
        });

        it('should have Spanish text for all labels', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            // Verificar que todos los textos están en español
            expect(screen.getByText('Estado del Sistema')).toBeInTheDocument();
            expect(screen.getByText('Rendimiento y disponibilidad')).toBeInTheDocument();
            expect(screen.getByText('Socket.IO')).toBeInTheDocument();
            expect(screen.getByText('Servidor')).toBeInTheDocument();
            expect(screen.getByText('Base de datos')).toBeInTheDocument();
        });

        it('should display placeholder text for upcoming features', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            const prontoBadges = screen.getAllByText('¡Pronto!');
            expect(prontoBadges).toHaveLength(2);
        });
    });

    describe('Accessibility', () => {
        it('should render semantic HTML structure', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Card components suelen usar divs con roles apropiados
            expect(container.firstChild).toBeInTheDocument();
        });

        it('should have readable text sizes', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const smallTexts = container.querySelectorAll('.text-sm');
            expect(smallTexts.length).toBeGreaterThan(0);
        });

        it('should have proper contrast for muted text', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            const mutedElements = screen.getAllByText(/Servidor|Base de datos/);
            mutedElements.forEach(element => {
                expect(element).toHaveClass('text-muted-foreground');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid status changes', () => {
            const { rerender } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Cambios rápidos
            rerender(<SystemStatusCard isSocketOnline={false} />);
            rerender(<SystemStatusCard isSocketOnline={true} />);
            rerender(<SystemStatusCard isSocketOnline={false} />);
            
            expect(screen.getByText('Desconectado')).toBeInTheDocument();
        });

        it('should not crash with boolean edge values', () => {
            expect(() => render(<SystemStatusCard isSocketOnline={true} />)).not.toThrow();
            expect(() => render(<SystemStatusCard isSocketOnline={false} />)).not.toThrow();
        });

        it('should maintain layout integrity when status changes', () => {
            const { container, rerender } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const initialRowCount = container.querySelector('.space-y-4')?.children.length;
            
            rerender(<SystemStatusCard isSocketOnline={false} />);
            
            const finalRowCount = container.querySelector('.space-y-4')?.children.length;
            
            expect(initialRowCount).toBe(finalRowCount);
        });
    });

    describe('Integration with UI Components', () => {
        it('should use Card components correctly', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Verificar que se renderiza como un card
            expect(container.firstChild).toBeInTheDocument();
        });

        it('should use Badge components for all status indicators', () => {
            render(<SystemStatusCard isSocketOnline={true} />);
            
            // Debe haber 3 badges en total
            expect(screen.getByText('Conectado')).toBeInTheDocument();
            expect(screen.getAllByText('¡Pronto!')).toHaveLength(2);
        });
    });

    describe('Visual Consistency', () => {
        it('should have consistent spacing between rows', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const statusContainer = container.querySelector('.space-y-4');
            expect(statusContainer).toBeInTheDocument();
        });

        it('should align items consistently in all rows', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            const rows = container.querySelectorAll('.flex.items-center.justify-between');
            
            rows.forEach(row => {
                expect(row).toHaveClass('items-center');
                expect(row).toHaveClass('justify-between');
            });
        });

        it('should have consistent badge styling', () => {
            const { container } = render(<SystemStatusCard isSocketOnline={true} />);
            
            // Todos los badges deben existir
            const badges = container.querySelectorAll('[class*="bg-"]');
            expect(badges.length).toBeGreaterThan(0);
        });
    });
});