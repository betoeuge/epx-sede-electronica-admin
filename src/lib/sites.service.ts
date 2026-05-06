import { http } from './http';
import type {
  SitesListResponse,
  SiteResponse,
  SiteGroupResponse,
  CreateSiteRequest,
  UpdateSiteRequest,
  CreateSiteGroupRequest,
} from '@/types/sites.types';

export const sitesService = {
  getAll: () =>
    http.get<SitesListResponse>('/api/v1/sites').then((r) => r.data),

  create: (data: CreateSiteRequest) =>
    http.post<SiteResponse>('/api/v1/sites', data).then((r) => r.data),

  update: (id: string, data: UpdateSiteRequest) =>
    http.put<SiteResponse>(`/api/v1/sites/${id}`, data).then((r) => r.data),

  delete: (id: string) => http.delete(`/api/v1/sites/${id}`),

  archive: (id: string) =>
    http.post<SiteResponse>(`/api/v1/sites/${id}/archive`, {}).then((r) => r.data),

  activate: (id: string) =>
    http.post<SiteResponse>(`/api/v1/sites/${id}/activate`, {}).then((r) => r.data),

  setDraft: (id: string) =>
    http.post<SiteResponse>(`/api/v1/sites/${id}/draft`, {}).then((r) => r.data),
};

export async function updateSiteSettings(siteId: string, settingsJson: string): Promise<void> {
  await http.put(`/api/v1/sites/${siteId}/settings`, { settingsJson });
}

export const siteGroupsService = {
  create: (data: CreateSiteGroupRequest) =>
    http.post<SiteGroupResponse>('/api/v1/site-groups', data).then((r) => r.data),

  update: (id: string, data: { name: string; sortOrder: number }) =>
    http.put<SiteGroupResponse>(`/api/v1/site-groups/${id}`, data).then((r) => r.data),

  delete: (id: string) => http.delete(`/api/v1/site-groups/${id}`),
};
