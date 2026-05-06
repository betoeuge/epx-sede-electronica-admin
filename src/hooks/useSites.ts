import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesService, siteGroupsService } from '@/lib/sites.service';
import type { CreateSiteRequest, UpdateSiteRequest, CreateSiteGroupRequest } from '@/types/sites.types';

const SITES_KEY = ['sites'] as const;

export function useSites() {
  return useQuery({
    queryKey: SITES_KEY,
    queryFn: sitesService.getAll,
  });
}

export function useCreateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSiteRequest) => sitesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useUpdateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteRequest }) =>
      sitesService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useDeleteSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sitesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useArchiveSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sitesService.archive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useActivateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sitesService.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useSetDraftSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sitesService.setDraft(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useCreateSiteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSiteGroupRequest) => siteGroupsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}

export function useDeleteSiteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => siteGroupsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_KEY }),
  });
}
