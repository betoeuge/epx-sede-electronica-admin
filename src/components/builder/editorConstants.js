// Shared editor constants — no imports from React or other components here
// to avoid circular dependencies.

export const THEMES = {
  Ambiente: {
    primary:     '#003DA6',
    primaryDark: '#002D7C',
    accent:      '#F5A623',
    navBg:       '#f4f4f4',
    navBorder:   '#ffa741',
    heroLeft:    '#005384',
  },
  Naturaleza: {
    primary:     '#1B5E20',
    primaryDark: '#0a3d10',
    accent:      '#FF8F00',
    navBg:       '#e8f5e9',
    navBorder:   '#66BB6A',
    heroLeft:    '#2E7D32',
  },
  Tecnología: {
    primary:     '#1A237E',
    primaryDark: '#0d1457',
    accent:      '#00BCD4',
    navBg:       '#e8eaf6',
    navBorder:   '#7986CB',
    heroLeft:    '#283593',
  },
};

// Unified curated list of popular Google Fonts — used for both title and body selectors.
// Fonts are lazy-loaded from Google Fonts when selected (no API key required).
export const GOOGLE_FONTS = [
  'ABeeZee', 'Abel', 'Abril Fatface', 'Acme', 'Alegreya', 'Alegreya Sans',
  'Alegreya Sans SC', 'Alfa Slab One', 'Alice', 'Alike', 'Allan', 'Allerta',
  'Allura', 'Almarai', 'Almendra', 'Alumni Sans', 'Amatic SC', 'Amiri',
  'Amita', 'Andada Pro', 'Antic', 'Anton', 'Archivo', 'Archivo Black',
  'Archivo Narrow', 'Arimo', 'Arvo', 'Asap', 'Asap Condensed', 'Assistant',
  'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Bebas Neue',
  'BioRhyme', 'Bitter', 'Black Han Sans', 'Boogaloo', 'Bowlby One SC',
  'Bree Serif', 'Cabin', 'Cabin Condensed', 'Candal', 'Cantarell',
  'Cardo', 'Catamaran', 'Caveat', 'Chakra Petch', 'Changa', 'Cinzel',
  'Clicker Script', 'Comic Neue', 'Comfortaa', 'Cormorant', 'Cormorant Garamond',
  'Courgette', 'Cousine', 'Crete Round', 'Crimson Pro', 'Crimson Text',
  'Cuprum', 'DM Mono', 'DM Sans', 'DM Serif Display', 'DM Serif Text',
  'Dancing Script', 'Didact Gothic', 'Domine', 'Dosis', 'EB Garamond',
  'Eczar', 'El Messiri', 'Electrolize', 'Encode Sans', 'Encode Sans Condensed',
  'Exo', 'Exo 2', 'Fahkwang', 'Faustina', 'Figtree', 'Finlandica',
  'Fira Code', 'Fira Sans', 'Fira Sans Condensed', 'Fjalla One',
  'Flamenco', 'Fraunces', 'Fredoka', 'Fredoka One', 'Gelasio',
  'Gentium Book Plus', 'Gilda Display', 'Gloock', 'Gloria Hallelujah',
  'Grenze Gotisch', 'Gudea', 'Hahmlet', 'Hanken Grotesk', 'Heebo',
  'Hind', 'Hind Madurai', 'Hind Siliguri', 'IBM Plex Mono', 'IBM Plex Sans',
  'IBM Plex Sans Condensed', 'IBM Plex Serif', 'Inconsolata', 'Indie Flower',
  'Ingrid Darling', 'Inter', 'Italiana', 'Josefin Sans', 'Josefin Slab',
  'Jost', 'Julee', 'Julius Sans One', 'Jura', 'Just Another Hand',
  'Kanit', 'Karla', 'Khand', 'Kodchasan', 'Kumbh Sans', 'Lalezar',
  'Lato', 'League Spartan', 'Leckerli One', 'Lexend', 'Lexend Deca',
  'Libre Baskerville', 'Libre Franklin', 'Lilita One', 'Lobster',
  'Lobster Two', 'Lora', 'M PLUS 1p', 'M PLUS Rounded 1c', 'Macondo',
  'Mandali', 'Manrope', 'Martel', 'Maven Pro', 'Merienda', 'Merriweather',
  'Merriweather Sans', 'Michroma', 'Mitr', 'Mogra', 'Monoton', 'Montserrat',
  'Montserrat Alternates', 'Moul', 'Mukta', 'Mulish', 'Nanum Gothic',
  'Noto Sans', 'Noto Serif', 'Nunito', 'Nunito Sans', 'Old Standard TT',
  'Oleo Script', 'Open Sans', 'Orbitron', 'Oswald', 'Outfit', 'Overpass',
  'Oxygen', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow',
  'PT Serif', 'Pacifico', 'Pathway Gothic One', 'Philosopher', 'Playfair Display',
  'Playfair Display SC', 'Plus Jakarta Sans', 'Podkova', 'Poppins',
  'Pragati Narrow', 'Pridi', 'Prompt', 'Proxima Nova', 'Public Sans',
  'Quattrocento', 'Quattrocento Sans', 'Questrial', 'Quicksand',
  'Rajdhani', 'Raleway', 'Readex Pro', 'Red Hat Display', 'Red Hat Text',
  'Roboto', 'Roboto Condensed', 'Roboto Flex', 'Roboto Mono', 'Roboto Serif',
  'Roboto Slab', 'Rokkitt', 'Rosario', 'Rubik', 'Rubik Bubbles', 'Rubik Mono One',
  'Ruda', 'Russo One', 'Sacramento', 'Saira', 'Saira Condensed',
  'Saira Semi Condensed', 'Satisfy', 'Schibsted Grotesk', 'Secular One',
  'Signika', 'Signika Negative', 'Slabo 27px', 'Sora', 'Source Code Pro',
  'Source Sans 3', 'Source Serif 4', 'Space Grotesk', 'Space Mono',
  'Spectral', 'Stardos Stencil', 'Tajawal', 'Teko', 'Titillium Web',
  'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Mono', 'Unna', 'Urbanist',
  'Varela Round', 'Vidaloka', 'Vollkorn', 'Work Sans', 'Yanone Kaffeesatz',
  'Yatra One', 'Yellowtail', 'Zeyada',
];

// Legacy aliases kept for backward compat — both point to the full list
export const TITLE_FONTS = GOOGLE_FONTS;
export const BODY_FONTS  = GOOGLE_FONTS;

export const PAGE_TEMPLATES = {
  landing: {
    id: 'landing',
    name: 'Página de Inicio (Landing)',
    icon: '🏠'
  },
  tramite: {
    id: 'tramite',
    name: 'Página de Trámite (Con Menú)',
    icon: '📋'
  },
  informe: {
    id: 'informe',
    name: 'Página de Informe (Tablas)',
    icon: '📊'
  },
  noticia: {
    id: 'noticia',
    name: 'Página de Noticia (ZigZag)',
    icon: '📰'
  }
};

// ── Header Styles ──
export const HEADER_STYLES = {
  'sedes-electronicas': {
    id: 'sedes-electronicas',
    name: 'Sedes Electrónicas',
    description: 'Header completo con logos, buscador, logo MinTIC y barra de navegación',
  },
  'tramites-servicios': {
    id: 'tramites-servicios',
    name: 'Trámites y Servicios',
    description: 'Header con logos y buscador, sin barra de navegación extendida',
  },
  'sedes-login': {
    id: 'sedes-login',
    name: 'Sedes Electrónicas (Login)',
    description: 'Header con logos, login y barra de navegación',
  },
  'tramites-login': {
    id: 'tramites-login',
    name: 'Trámites y Servicios (Login)',
    description: 'Header con logos y login, borde dorado',
  },
};

export const DEFAULT_HEADER_CONFIG = {
  govBar: true,
  logos: true,
  searchBar: true,
  loginLink: false,
  navBar: true,
  languageSwitch: true,
  logoLeftUrl: '/assets/logo_potencia.png',
  logoRightUrl: '/assets/logo_mintic_v2.png',
};

export const DEFAULT_HEADER_TEXTS = {
  entityName: 'COLOMBIA',
  entitySubtitle: 'POTENCIA DE LA VIDA',
  ministryName: 'Ministerio de Tecnologías de la Información y las Comunicaciones',
  searchPlaceholder: 'Buscar por componente',
  loginLabel: 'Iniciar sesión',
};

// ── Footer Styles ──
export const FOOTER_STYLES = {
  'version01': {
    id: 'version01',
    name: 'Completo (Card + Sedes)',
    description: 'Footer con card de información detallada sobre fondo amarillo y barra GOV.CO',
  },
  'version02': {
    id: 'version02',
    name: 'Compacto (Azul)',
    description: 'Footer compacto sobre fondo azul con logos, info y contacto',
  },
};

export const DEFAULT_FOOTER_DATA = {
  entityFullName: 'Nombre completo de la sede electrónica',
  mainOfficeTitle: 'Sede principal',
  mainFields: [
    { id: 'f1', value: 'Dirección: Calle 123 #45-67, Bogotá D.C.' },
    { id: 'f2', value: 'Código postal: 110111' },
    { id: 'f3', value: 'Horario de atención: Lunes a viernes 8:00 a.m. - 5:00 p.m.' },
    { id: 'f4', value: 'Teléfono conmutador: +57(1) 234 56 78' },
    { id: 'f5', value: 'Línea gratuita: +57(1) 800 12 34' },
    { id: 'f6', value: 'Línea anticorrupción: +57(1) 800 56 78' },
  ],
  mainEmails: [
    { id: 'e1', label: 'Correo institucional', value: 'ministero@ministerio.gov.co' },
    { id: 'e2', label: 'Correo notificaciones judiciales', value: 'judiciales@gov.co' },
  ],
  sedes: [
    { id: 's1', title: 'Sede 1', fields: [
      { id: 'sf1', value: 'Dirección: Calle 100 #10-20, Bogotá' },
      { id: 'sf2', value: 'Horario: Lunes a viernes 8:00 a.m. - 4:00 p.m.' },
    ]},
  ],
  contacts: [
    { id: 'c1', title: 'Contacto', fields: [
      { id: 'cf1', value: 'Teléfono conmutador: +57(1) 234 56 78' },
    ], email: { label: 'Correo institucional', value: 'ministero@ministerio.gov.co' }},
  ],
  socialMedia: [
    { id: 'sm1', platform: 'twitter', handle: '@entidad', url: '' },
    { id: 'sm2', platform: 'instagram', handle: '@entidad', url: '' },
    { id: 'sm3', platform: 'facebook', handle: '@entidad', url: '' },
  ],
  footerLinks: [
    { id: 'fl1', label: 'Políticas', url: '#' },
    { id: 'fl2', label: 'Mapa del sitio', url: '#' },
    { id: 'fl3', label: 'Términos y condiciones', url: '#' },
    { id: 'fl4', label: 'Accesibilidad', url: '#' },
  ],
  showSedes: true,
  showContacts: true,
  showSocialMedia: true,
  showFooterLinks: true,
};

// ── Accessibility Bar ──
export const DEFAULT_ACCESSIBILITY_DATA = {
  enabled: true,
  // Fixed items (cannot be removed)
  contrastEnabled: true,
  fontSizeEnabled: true,
  // Custom items (user-managed, with icon + hyperlink)
  customItems: [
    { id: 'a11y-1', icon: 'deaf', label: 'Centro de Relevo', url: 'https://centroderelevo.gov.co', target: 'external' },
    { id: 'a11y-2', icon: 'wheelchair', label: 'Accesibilidad Web', url: '#', target: 'external' },
  ],
};

// ── Left Links Bar ──
export const DEFAULT_LEFT_LINKS_DATA = {
  enabled: false,
  customItems: [
    { id: 'll-1', icon: 'link', label: 'Enlace 1', url: '#', target: 'external' },
  ],
};

export const DEFAULT_SITE_SETTINGS = {
  title: 'Mi Evolution Site',
  languages: '',
  description: 'Embark on an extraordinary and transformative journey into the realm of sustainable architecture with the groundbreaking project, "Al-Nuzha Retreat." This architectural endeavor transcends conventional boundaries, offering a profound exploration where the essence of eco-conscious living is intricately woven into every facet of its design.',
  faviconLight: '',
  faviconDark: '',
  socialPreview: '',
  analyticsId: '',
  domain: 'dominio.com',
  sslStatus: 'SSL activo — certificado válido hasta Nov 2026',
};

export const DEFAULT_EDITOR_STATE = {
  projectName: 'Nuevo Proyecto',
  fontTitles:  'Nunito Sans',
  fontBody:    'Verdana',
  themeName:   'Ambiente',
  cmsData: null, // Will be initialized with seed data in CMSPanel on first load
  pages: [
    { id: 'index', label: 'Index', templateId: 'landing',
      sections: [
        { id: 'header',  name: 'Header Main', locked: true },
        { id: 'footer',  name: 'Footer Main', locked: true }
      ]
    },
    { id: 'p1', label: 'Tramite - 1', templateId: 'tramite',
      sections: [
        { id: 'header', name: 'Header Main', locked: true },
        { id: 'footer', name: 'Footer Main', locked: true }
      ]
    },
    { id: 'p2', label: 'Informe - 1', templateId: 'informe',
      sections: [
        { id: 'header', name: 'Header Main', locked: true },
        { id: 'footer', name: 'Footer Main', locked: true }
      ]
    },
    { id: 'p3', label: 'Noticia - 1', templateId: 'noticia',
      sections: [
        { id: 'header', name: 'Header Main', locked: true },
        { id: 'footer', name: 'Footer Main', locked: true }
      ]
    },
  ],
  activePageId: 'index',
  selectedSectionId: null,
  navigation: [
    { id: 'nav-1', label: 'Inicio', type: 'simple', target: 'index' },
    { id: 'nav-2', label: 'Trámites', type: 'dropdown', target: null, children: [
      { id: 'nav-2-1', label: 'Tramite - 1', target: 'p1' },
    ]},
    { id: 'nav-3', label: 'Informes', type: 'simple', target: 'p2' },
    { id: 'nav-4', label: 'Noticias', type: 'simple', target: 'p3' },
  ],
  headerStyle: 'sedes-electronicas',
  headerConfig: { ...DEFAULT_HEADER_CONFIG },
  headerTexts: { ...DEFAULT_HEADER_TEXTS },
  footerStyle: 'version01',
  footerData: { ...DEFAULT_FOOTER_DATA },
  accessibilityData: { ...DEFAULT_ACCESSIBILITY_DATA },
  leftLinksData: { ...DEFAULT_LEFT_LINKS_DATA },
  siteSettings: { ...DEFAULT_SITE_SETTINGS },
  ...THEMES.Ambiente,
};
