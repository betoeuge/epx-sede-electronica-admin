import { http } from './http';

export interface ContentCollection {
  id: string;
  name: string;
  slug: string;
  siteId: string;
  itemCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Slim type returned by list endpoint (no bodyJson)
export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  tag?: string;
  description?: string;
  thumbnailUrl?: string;
  sortOrder: number;
  date?: string;
  collectionId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Full type returned by single-item detail endpoint (includes bodyJson)
export interface ContentItemDetail extends ContentItem {
  bodyJson?: string;
}

export interface ContentItemsPage {
  total: number;
  page: number;
  pageSize: number;
  items: ContentItem[];
}

export interface CreateCollectionRequest { name: string; slug: string; }
export interface CreateItemRequest { title: string; slug: string; tag?: string; description?: string; thumbnailUrl?: string; bodyJson?: string; sortOrder?: number; date?: string; }
export interface UpdateItemRequest { title: string; slug: string; tag?: string; description?: string; thumbnailUrl?: string; bodyJson?: string; date?: string; }

export const contentService = {
  getCollections: (siteId: string) =>
    http.get<ContentCollection[]>(`/api/v1/sites/${siteId}/collections`).then((r) => r.data),

  createCollection: (siteId: string, data: CreateCollectionRequest) =>
    http.post<ContentCollection>(`/api/v1/sites/${siteId}/collections`, data).then((r) => r.data),

  deleteCollection: (siteId: string, id: string) =>
    http.delete(`/api/v1/sites/${siteId}/collections/${id}`),

  getItems: (siteId: string, collectionId: string, page = 1, pageSize = 100) =>
    http.get<ContentItemsPage>(`/api/v1/sites/${siteId}/collections/${collectionId}/items`, {
      params: { page, pageSize },
    }).then((r) => r.data),

  getItem: (siteId: string, collectionId: string, itemId: string) =>
    http.get<ContentItemDetail>(`/api/v1/sites/${siteId}/collections/${collectionId}/items/${itemId}`).then((r) => r.data),

  createItem: (siteId: string, collectionId: string, data: CreateItemRequest) =>
    http.post<ContentItemDetail>(`/api/v1/sites/${siteId}/collections/${collectionId}/items`, data).then((r) => r.data),

  updateItem: (siteId: string, collectionId: string, itemId: string, data: UpdateItemRequest) =>
    http.put<ContentItemDetail>(`/api/v1/sites/${siteId}/collections/${collectionId}/items/${itemId}`, data).then((r) => r.data),

  deleteItem: (siteId: string, collectionId: string, itemId: string) =>
    http.delete(`/api/v1/sites/${siteId}/collections/${collectionId}/items/${itemId}`),

  renameCollection: (siteId: string, id: string, name: string) =>
    http.patch<ContentCollection>(`/api/v1/sites/${siteId}/collections/${id}`, { name }).then((r) => r.data),

  reorderItems: (siteId: string, collectionId: string, itemIds: string[]) =>
    http.post(`/api/v1/sites/${siteId}/collections/${collectionId}/items/reorder`, { itemIds }),
};
