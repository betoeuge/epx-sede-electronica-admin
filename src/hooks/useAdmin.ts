import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/lib/admin.service';

const USERS_KEY = ['admin-users'] as const;
const CONFIG_KEY = ['admin-config'] as const;

export function useAdminUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: adminService.getUsers, staleTime: 30_000, retry: false });
}

export function useInviteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.inviteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminService.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminService.updateStatus(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useSystemConfig() {
  return useQuery({ queryKey: CONFIG_KEY, queryFn: adminService.getConfig, staleTime: 60_000, retry: false });
}

export function useSetConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      adminService.setConfig(key, value, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEY }),
  });
}
