import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService, CreateCollectionRequest, CreateItemRequest, UpdateItemRequest } from '@/lib/content.service';

export function useCollections(siteId: string | null) {
  return useQuery({
    queryKey: ['collections', siteId],
    queryFn: () => contentService.getCollections(siteId!),
    enabled: !!siteId,
    staleTime: 30_000,
  });
}

export function useCreateCollection(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollectionRequest) => contentService.createCollection(siteId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections', siteId] }),
  });
}

export function useDeleteCollection(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentService.deleteCollection(siteId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections', siteId] }),
  });
}

export function useContentItems(siteId: string | null, collectionId: string | null) {
  return useQuery({
    queryKey: ['content-items', siteId, collectionId],
    // Returns paginated { total, page, pageSize, items[] } — unwrap items for callers
    queryFn: async () => {
      const page = await contentService.getItems(siteId!, collectionId!);
      return page.items;
    },
    enabled: !!siteId && !!collectionId,
    staleTime: 15_000,
  });
}

export function useContentItem(siteId: string | null, collectionId: string | null, itemId: string | null) {
  return useQuery({
    queryKey: ['content-item', siteId, collectionId, itemId],
    queryFn: () => contentService.getItem(siteId!, collectionId!, itemId!),
    enabled: !!siteId && !!collectionId && !!itemId,
    staleTime: 10_000,
  });
}

export function useCreateItem(siteId: string, collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemRequest) => contentService.createItem(siteId, collectionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content-items', siteId, collectionId] });
      qc.invalidateQueries({ queryKey: ['collections', siteId] });
    },
  });
}

export function useUpdateItem(siteId: string, collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateItemRequest }) =>
      contentService.updateItem(siteId, collectionId, itemId, data),
    onSuccess: (_data, { itemId }) => {
      qc.invalidateQueries({ queryKey: ['content-items', siteId, collectionId] });
      qc.invalidateQueries({ queryKey: ['content-item', siteId, collectionId, itemId] });
    },
  });
}

export function useDeleteItem(siteId: string, collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => contentService.deleteItem(siteId, collectionId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content-items', siteId, collectionId] });
      qc.invalidateQueries({ queryKey: ['collections', siteId] });
    },
  });
}

export function useRenameCollection(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      contentService.renameCollection(siteId, id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections', siteId] }),
  });
}

export function useReorderItems(siteId: string, collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: string[]) =>
      contentService.reorderItems(siteId, collectionId, itemIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-items', siteId, collectionId] }),
  });
}
