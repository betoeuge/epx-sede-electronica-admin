import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/lib/notifications.service';

const KEY = ['notifications'] as const;

export function useNotifications() {
  return useQuery({
    queryKey: KEY,
    queryFn: notificationsService.getAll,
    staleTime: 30_000,
    retry: false,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
