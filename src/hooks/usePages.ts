import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagesService } from '@/lib/pages.service';
import type { CreatePageRequest, UpdatePageRequest } from '@/lib/pages.service';

const pagesKey = (siteId: string) => ['pages', siteId] as const;

export function usePages(siteId: string | null) {
  return useQuery({
    queryKey: pagesKey(siteId ?? ''),
    queryFn: () => pagesService.getAll(siteId!),
    enabled: !!siteId,
  });
}

export function useCreatePage(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePageRequest) => pagesService.create(siteId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: pagesKey(siteId) }),
  });
}

export function useUpdatePage(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePageRequest }) =>
      pagesService.update(siteId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: pagesKey(siteId) }),
  });
}

export function useDeletePage(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pagesService.delete(siteId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pagesKey(siteId) }),
  });
}
