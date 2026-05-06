export interface SiteSection {
  id: 'hero' | 'quickaccess' | 'news' | 'transparency' | 'footer';
  label: string;
  enabled: boolean;
  order: number;
}

export interface SiteSettings {
  headerStyle: 'blue' | 'white' | 'transparent';
  showLogo: boolean;
  showSearch: boolean;
  showLanguageToggle: boolean;
  sections: SiteSection[];
}
