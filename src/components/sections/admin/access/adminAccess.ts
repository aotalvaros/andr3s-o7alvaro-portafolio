import type { AdminView } from '@/components/sections/admin/types/adminDashboard.type';
import type { User } from '@/core/domain/entities/User';

export const PASSWORD_REQUIRED_VIEW: AdminView = 'profile';

export const getDefaultAdminView = (user: Pick<User, 'mustChangePassword'> | null | undefined): AdminView => {
  return user?.mustChangePassword ? PASSWORD_REQUIRED_VIEW : 'overview';
};

export const canAccessAdminView = (
  user: Pick<User, 'mustChangePassword'> | null | undefined,
  view: AdminView,
): boolean => {
  if (!user?.mustChangePassword) {
    return true;
  }

  return view === PASSWORD_REQUIRED_VIEW;
};
