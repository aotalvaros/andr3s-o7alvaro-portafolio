import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserProfile } from '@/components/sections/admin/profile/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { updateUserPassword, updateUserProfile } from '@/services/user/user.service';
import { toast } from 'sonner';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/user/user.service', () => ({
  updateUserProfile: vi.fn(),
  updateUserPassword: vi.fn(),
}));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('UserProfile', () => {
  const mockUser = {
    _id: 'user-1',
    name: 'Andrés Otalvaro',
    email: 'andres@example.com',
    avatar: 'https://example.com/avatar.png',
    phone: '3101234567',
    role: 'superAdmin',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
    mustChangePassword: false,
    passwordChangedAt: null,
  };

  const renderComponent = (user = mockUser, isLoading = false) => {
    vi.mocked(useAuth).mockReturnValue({
      user,
      isLoading,
      isAuthenticated: !!user,
      isInitialized: true,
      clearAuth: vi.fn(),
    });

    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={client}>
        <UserProfile />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the loading state while auth data is loading', () => {
    renderComponent(mockUser, true);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show an error message when no user is loaded', () => {
    renderComponent(null as never);

    expect(screen.getByText('No se pudo cargar el perfil.')).toBeInTheDocument();
  });

  it('should show the password change warning when the flag is active', () => {
    renderComponent({ ...mockUser, mustChangePassword: true });

    expect(screen.getByText('Debes cambiar tu contraseña antes de continuar.')).toBeInTheDocument();
  });

  it('should allow editing and saving profile updates for a super admin', async () => {
    vi.mocked(updateUserProfile).mockResolvedValue(undefined);
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Andrés Actualizado' },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), {
      target: { value: '3005555555' },
    });
    fireEvent.change(screen.getByLabelText(/URL de avatar/i), {
      target: { value: 'https://example.com/nuevo-avatar.png' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Andrés Actualizado',
          phone: '3005555555',
          avatar: 'https://example.com/nuevo-avatar.png',
        }),
        expect.any(Object)
      );
    });
  });

  it('should cancel profile editing without persisting values', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Editar perfil/i }));
    fireEvent.change(screen.getByLabelText(/Teléfono/i), {
      target: { value: '999999999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    expect(screen.getByDisplayValue('3101234567')).toBeInTheDocument();
  });

  it('should show an error when the password confirmation does not match', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Contraseña actual/i), {
      target: { value: 'old-password' },
    });
    fireEvent.change(screen.getByLabelText(/^Nueva contraseña$/i), {
      target: { value: 'new-password' },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: 'different-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Actualizar contraseña/i }));

    expect(toast.error).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(updateUserPassword).not.toHaveBeenCalled();
  });

  it('should update the password when the confirmation matches', async () => {
    vi.mocked(updateUserPassword).mockResolvedValue(undefined);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Contraseña actual/i), {
      target: { value: 'old-password' },
    });
    fireEvent.change(screen.getByLabelText(/^Nueva contraseña$/i), {
      target: { value: 'new-password' },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: 'new-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Actualizar contraseña/i }));

    await waitFor(() => {
      expect(updateUserPassword).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPassword: 'old-password',
          newPassword: 'new-password',
        }),
        expect.any(Object)
      );
    });
  });
});
