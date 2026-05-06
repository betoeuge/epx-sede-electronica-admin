import { http } from './http';

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  resourceType?: string;
  resourceId?: string;
}

export interface NotificationsResponse {
  items: AdminNotification[];
  total: number;
  unread: number;
}

export const notificationsService = {
  getAll: () =>
    http.get<NotificationsResponse>('/api/v1/notifications').then((r) => r.data),

  markAsRead: (id: string) =>
    http.post(`/api/v1/notifications/${id}/read`, {}).then((r) => r.data),

  markAllAsRead: () =>
    http.post('/api/v1/notifications/read-all', {}).then((r) => r.data),

  delete: (id: string) =>
    http.delete(`/api/v1/notifications/${id}`),
};
