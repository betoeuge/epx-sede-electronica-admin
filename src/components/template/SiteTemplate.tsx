import { GovHeader } from './GovHeader';
import { HeroSlider } from './HeroSlider';
import { QuickAccessRow } from './QuickAccessRow';
import { NewsGrid } from './NewsGrid';
import { TransparencyBlock } from './TransparencyBlock';
import { GovFooter } from './GovFooter';
import type { SiteSettings } from '@/types/site-settings.types';

interface SiteTemplateProps {
  entityName?: string;
  accentColor?: string;
  pages: { id: string; label: string; slug: string }[];
  settings: SiteSettings;
}

export function SiteTemplate({ entityName, accentColor, pages, settings }: SiteTemplateProps) {
  const sortedSections = [...settings.sections].sort((a, b) => a.order - b.order);

  function renderSection(sectionId: string) {
    switch (sectionId) {
      case 'hero':
        return <HeroSlider key="hero" entityName={entityName} accentColor={accentColor} />;
      case 'quickaccess':
        return <QuickAccessRow key="quickaccess" />;
      case 'news':
        return <NewsGrid key="news" />;
      case 'transparency':
        return <TransparencyBlock key="transparency" />;
      case 'footer':
        return <GovFooter key="footer" entityName={entityName} pages={pages} />;
      default:
        return null;
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#ffffff', minHeight: '100vh' }}>
      <GovHeader
        entityName={entityName}
        pages={pages}
        headerStyle={settings.headerStyle}
        showLogo={settings.showLogo}
        showSearch={settings.showSearch}
        showLanguageToggle={settings.showLanguageToggle}
        accentColor={accentColor}
      />
      {sortedSections
        .filter((s) => s.enabled)
        .map((s) => renderSection(s.id))}
    </div>
  );
}
