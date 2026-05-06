export interface SiteResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  accentColor?: string;
  status: 'Active' | 'Draft' | 'Archived';
  groupId?: string;
  groupName?: string;
  settingsJson?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteGroupResponse {
  id: string;
  name: string;
  sortOrder: number;
  sites: SiteResponse[];
  createdAt: string;
}

export interface SitesListResponse {
  groups: SiteGroupResponse[];
  ungrouped: SiteResponse[];
}

export interface CreateSiteRequest {
  name: string;
  slug: string;
  description?: string;
  accentColor?: string;
  groupId?: string;
  templateId?: string;
}

export interface UpdateSiteRequest {
  name: string;
  description?: string;
  accentColor?: string;
  groupId?: string;
}

export interface CreateSiteGroupRequest {
  name: string;
  sortOrder?: number;
}
