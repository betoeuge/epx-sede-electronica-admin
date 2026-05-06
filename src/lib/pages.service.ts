import { http } from './http';

export interface SitePageResponse {
  id: string;
  siteId: string;
  parentId?: string;
  name: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt?: string;
  sectionsJson?: string;
  layout?: string;
}

export interface CreatePageRequest {
  name: string;
  slug: string;
  parentId?: string;
  sortOrder?: number;
  isHome?: boolean;
  sectionsJson?: string | null;
  layout?: string | null;
}

export interface UpdatePageRequest {
  name: string;
  slug: string;
  parentId?: string;
  sortOrder: number;
  isVisible: boolean;
  sectionsJson?: string;
  layout?: string;
}

export const pagesService = {
  getAll: (siteId: string) =>
    http.get<SitePageResponse[]>(`/api/v1/sites/${siteId}/pages`).then((r) => r.data),

  create: (siteId: string, data: CreatePageRequest) =>
    http.post<SitePageResponse>(`/api/v1/sites/${siteId}/pages`, data).then((r) => r.data),

  update: (siteId: string, id: string, data: UpdatePageRequest) =>
    http.put<SitePageResponse>(`/api/v1/sites/${siteId}/pages/${id}`, data).then((r) => r.data),

  delete: (siteId: string, id: string) =>
    http.delete(`/api/v1/sites/${siteId}/pages/${id}`),
};
