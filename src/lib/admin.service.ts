import { http } from './http';

export interface AdminUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Editor' | 'Viewer' | 'SuperAdmin';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface SystemConfigEntry { key: string; value: string; description?: string; }

export const adminService = {
  getUsers: () =>
    http.get<AdminUser[]>('/api/v1/admin/users').then((r) => r.data),

  inviteUser: (data: { email: string; firstName: string; lastName: string; role: string }) =>
    http.post<AdminUser>('/api/v1/admin/users', data).then((r) => r.data),

  updateRole: (id: string, role: string) =>
    http.put(`/api/v1/admin/users/${id}/role`, { role }).then((r) => r.data),

  updateStatus: (id: string, isActive: boolean) =>
    http.put(`/api/v1/admin/users/${id}/status`, { isActive }).then((r) => r.data),

  getConfig: () =>
    http.get<SystemConfigEntry[]>('/api/v1/admin/config').then((r) => r.data),

  setConfig: (key: string, value: string, description?: string) =>
    http.put('/api/v1/admin/config', { key, value, description }).then((r) => r.data),
};
