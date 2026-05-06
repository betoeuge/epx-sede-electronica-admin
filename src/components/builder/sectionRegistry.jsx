'use client';
import React from 'react';
import { SectionSlider } from './sections/SectionSlider';
import { SliderEditor } from './props-editors/SliderEditor';
import { SectionNoticias } from './sections/SectionNoticias';
import { NoticiasEditor } from './props-editors/NoticiasEditor';
import { SectionIconCarousel } from './sections/SectionIconCarousel';
import { IconCarouselEditor } from './props-editors/IconCarouselEditor';
import { SectionIconGrid } from './sections/SectionIconGrid';
import { IconGridEditor } from './props-editors/IconGridEditor';
import { SectionTable } from './sections/SectionTable';
import { TableEditor } from './props-editors/TableEditor';
import { SectionLinksDirectory } from './sections/SectionLinksDirectory';
import { LinksDirectoryEditor } from './props-editors/LinksDirectoryEditor';
import { SectionVideoEmbed } from './sections/SectionVideoEmbed';
import { VideoEmbedEditor } from './props-editors/VideoEmbedEditor';
import { SectionZigZag } from './sections/SectionZigZag';
import { ZigZagEditor } from './props-editors/ZigZagEditor';

// Dummy wrapper to simulate scaling for the menu preview
function PreviewWrapper({ children, height = 80 }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px`, overflow: 'hidden', borderRadius: '0.25rem', background: 'white' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: 'top left', pointerEvents: 'none' }}>
        {children}
      </div>
    </div>
  );
}

export const SECTION_REGISTRY = {
  'slider': {
    id: 'slider',
    name: 'Portada',
    defaultConfig: {
      variant: 'Hero',
      textAlign: 'left',
      textColor: '#ffffff',
      overlayOpacity: 0.9,
      splitImageWidth: 60,
      desktopHeight: '28.125rem',
      tabletHeight: '28rem',
      mobileHeight: '34rem',
      autoplay: true,
      intervalMs: 5000,
      showArrows: true,
      showDots: true,
      showPause: true,
      slides: [
        {
          title: 'Pago de Multas y Sanciones',
          subtitle: 'Información para el pago de multas y sanciones',
          bg: '#003DA6',
          img: 'https://i.ibb.co/L5h8Mvt/billetes-colombianos.jpg',
          buttons: [
            {
              label: 'Iniciar trámite',
              url: '#',
              style: 'primary',
              showIcon: true,
              icon: 'arrow-right',
              backgroundColor: '#0057B8',
              textColor: '#ffffff',
              borderColor: '#0057B8',
              radius: '4px'
            },
            {
              label: 'Más información',
              url: '#',
              style: 'secondary',
              showIcon: false,
              icon: 'external-link-alt',
              backgroundColor: 'transparent',
              textColor: '#ffffff',
              borderColor: 'rgba(255,255,255,0.72)',
              radius: '4px'
            }
          ]
        },
        {
          title: 'Renovación de Licencias',
          subtitle: 'Trámite rápido y seguro',
          bg: '#005384',
          img: '',
          buttons: [
            {
              label: 'Consultar requisitos',
              url: '#',
              style: 'primary',
              showIcon: false,
              icon: 'arrow-right',
              backgroundColor: '#0057B8',
              textColor: '#ffffff',
              borderColor: '#0057B8',
              radius: '4px'
            }
          ]
        }
      ]
    },
    Component: SectionSlider,
    PropsEditor: SliderEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionSlider config={config} theme={theme} isPreview />
      </PreviewWrapper>
    )
  },
  'noticias': {
    id: 'noticias',
    name: 'Listado',
    defaultConfig: {
      variant: 'Destacado',
      title: 'Noticias Destacadas',
      items: [
        {
          title: 'La Superintendencia Financiera invita a consultar su Menú de Transparencia',
          date: 'Mar 17 2026',
          category: 'Nacional',
          img: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=400&auto=format&fit=crop'
        },
        {
          title: 'Nuevos lineamientos para la facturación electrónica en 2026',
          date: 'Feb 12 2026',
          category: 'Economía',
          img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop'
        },
        {
          title: 'Avances en la digitalización de trámites ciudadanos',
          date: 'Ene 25 2026',
          category: 'Tecnología',
          img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop'
        },
        {
          title: 'Apertura de nuevas sedes de atención al ciudadano en zonas rurales',
          date: 'Dic 10 2025',
          category: 'Regiones',
          img: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=400&auto=format&fit=crop'
        }
      ]
    },
    Component: SectionNoticias,
    PropsEditor: NoticiasEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionNoticias config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'icon-carousel': {
    id: 'icon-carousel',
    name: 'Accesos',
    defaultConfig: {
      showTitle: true,
      title: 'Titulo',
      iconColor: '#003DA6',
      textColor: '#000000',
      bgColor: '#ffffff',
      bgImage: '',
      itemImageSize: 100,
      itemImageRadius: 'soft',
      itemImageFit: 'contain',
      items: [
        { id: 'ic-1', icon: 'link', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
        { id: 'ic-2', icon: 'search', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
        { id: 'ic-3', icon: 'home', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
      ]
    },
    Component: SectionIconCarousel,
    PropsEditor: IconCarouselEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionIconCarousel config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'icon-grid': {
    id: 'icon-grid',
    name: 'Pestañas',
    defaultConfig: {
      showTitle: true,
      title: 'Tramites y Servicios',
      subtitle: 'Encuentra todos nuestros tramites y servicios que tenemos para ti',
      iconColor: '#004cb0',
      textColor: '#000000',
      bgColor: '#f5f5f5',
      bgImage: '',
      itemImageSize: 100,
      itemImageRadius: 'soft',
      itemImageFit: 'contain',
      tabs: [
        {
          id: 'tab-1', label: 'General',
          items: [
            { id: 'ig-1', icon: 'map-marker-alt', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-2', icon: 'calendar-alt', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-3', icon: 'cog', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-4', icon: 'shield-alt', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-5', icon: 'home', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
          ]
        },
        {
          id: 'tab-2', label: 'Servicios',
          items: [
            { id: 'ig-6', icon: 'users', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-7', icon: 'search', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
            { id: 'ig-8', icon: 'link', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' },
          ]
        }
      ]
    },
    Component: SectionIconGrid,
    PropsEditor: IconGridEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionIconGrid config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'table': {
    id: 'table',
    name: 'Tabla',
    defaultConfig: {
      variant: 'simple',
      title: '',
      subtitle: '',
      showCheckbox: false,
      showTotals: false,
      columns: [
        { id: 'col-name', header: 'Nombre', align: 'left', type: 'text', sortable: true, width: '15.625rem' },
        { id: 'col-id', header: 'ID', align: 'right', type: 'number', sortable: true, width: '5.75rem' },
        { id: 'col-desc', header: 'Descripción', align: 'left', type: 'text', sortable: false, width: '' },
      ],
      rows: [
        { id: 'row-1', cells: { 'col-name': 'Modulo 1', 'col-id': '4598', 'col-desc': 'Descripción del módulo y su función.' } },
        { id: 'row-2', cells: { 'col-name': 'Modulo 2', 'col-id': '3201', 'col-desc': 'Descripción del segundo módulo.' } },
        { id: 'row-3', cells: { 'col-name': 'Modulo 3', 'col-id': '1574', 'col-desc': 'Descripción del tercer módulo.' } },
      ]
    },
    Component: SectionTable,
    PropsEditor: TableEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionTable config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'links-directory': {
    id: 'links-directory',
    name: 'Enlaces',
    defaultConfig: {
      variant: 'default',
      title: '',
      subtitle: '',
      sections: [],
    },
    Component: SectionLinksDirectory,
    PropsEditor: LinksDirectoryEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionLinksDirectory config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'video-embed': {
    id: 'video-embed',
    name: 'Video',
    defaultConfig: {
      title: 'Programa TV - Conectando Territorios',
      titleAlign: 'center',
      layout: 'text-right',
      descriptionTitle: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
      description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país. En esta entrega presentamos el lanzamiento del programa AgroTech en Boyacá, las iniciativas que acercan la tecnología a las comunidades en Mompox, Bolívar, y el encuentro liderado por la ministra TIC con rectores de instituciones educativas para fortalecer la transformación digital del sector educativo.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      backgroundType: 'image',
      backgroundColor: '#07031f',
      backgroundImage: '/assets/video-section-network-bg.png',
      textColor: '#ffffff',
    },
    Component: SectionVideoEmbed,
    PropsEditor: VideoEmbedEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionVideoEmbed config={config} theme={theme} />
      </PreviewWrapper>
    )
  },
  'zigzag': {
    id: 'zigzag',
    name: 'Contenido',
    defaultConfig: {
      title: '',
      subtitle: '',
      titleAlign: 'left',
      sourceMode: 'cms',
      cmsCollection: 'blog',
      backgroundColor: '#f4f4f4',
      titleColor: '#004cb0',
      textColor: '#000000',
      items: [
        {
          id: 'zigzag-1',
          layout: 'image-left',
          title: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
          description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.',
          image: '/assets/zigzag-section-image-left.jpg',
          imageAlt: '',
        },
        {
          id: 'zigzag-2',
          layout: 'image-right',
          title: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
          description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.',
          image: '/assets/zigzag-section-image-right.jpg',
          imageAlt: '',
        },
      ],
    },
    Component: SectionZigZag,
    PropsEditor: ZigZagEditor,
    Preview: ({ config, theme }) => (
      <PreviewWrapper height={80}>
        <SectionZigZag config={config} theme={theme} />
      </PreviewWrapper>
    )
  }
};
