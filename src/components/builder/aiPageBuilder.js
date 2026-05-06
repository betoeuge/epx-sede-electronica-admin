'use client';
import { SECTION_REGISTRY } from './sectionRegistry';

const TEMPLATE_IDS = ['landing', 'tramite', 'informe', 'noticia'];

const ALLOWED_CONFIG_KEYS = {
  slider: ['variant', 'textAlign', 'textColor', 'overlayOpacity', 'splitImageWidth', 'desktopHeight', 'tabletHeight', 'mobileHeight', 'autoplay', 'intervalMs', 'showArrows', 'showDots', 'showPause', 'slides'],
  noticias: ['variant', 'title', 'items', 'cmsCollection', 'sourceMode', 'titleAlign'],
  'icon-carousel': ['showTitle', 'title', 'iconColor', 'textColor', 'bgColor', 'bgImage', 'itemImageSize', 'itemImageRadius', 'itemImageFit', 'items'],
  'icon-grid': ['showTitle', 'title', 'subtitle', 'iconColor', 'textColor', 'bgColor', 'bgImage', 'itemImageSize', 'itemImageRadius', 'itemImageFit', 'tabs'],
  table: ['variant', 'title', 'subtitle', 'showCheckbox', 'showTotals', 'columns', 'rows', 'titleAlign'],
  'links-directory': ['variant', 'title', 'subtitle', 'sections', 'titleAlign'],
  'video-embed': ['title', 'titleAlign', 'layout', 'descriptionTitle', 'description', 'videoUrl', 'backgroundType', 'backgroundColor', 'backgroundImage', 'textColor'],
  zigzag: ['title', 'subtitle', 'titleAlign', 'sourceMode', 'cmsCollection', 'backgroundColor', 'titleColor', 'textColor', 'items'],
};

const SPORTS_IMAGES = [
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=1200&auto=format&fit=crop',
];

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function pickAllowedConfig(type, config = {}) {
  const allowedKeys = ALLOWED_CONFIG_KEYS[type] || [];
  return allowedKeys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      result[key] = config[key];
    }
    return result;
  }, {});
}

function clampText(value, fallback = '', maxLength = 280) {
  const text = String(value || fallback).trim();
  return text.slice(0, maxLength);
}

function removeUndefinedValues(config) {
  return Object.entries(config).reduce((result, [key, value]) => {
    if (value !== undefined) result[key] = value;
    return result;
  }, {});
}

function normalizeButtons(buttons = []) {
  return buttons.slice(0, 2).map((button, index) => ({
    label: clampText(button?.label, index === 0 ? 'Conocer más' : 'Ver detalle', 48),
    url: clampText(button?.url, '#', 160),
    style: button?.style === 'secondary' ? 'secondary' : 'primary',
    showIcon: button?.showIcon === true,
    icon: clampText(button?.icon, 'arrow-right', 40),
    backgroundColor: clampText(button?.backgroundColor, index === 0 ? '#0057B8' : 'transparent', 32),
    textColor: clampText(button?.textColor, '#ffffff', 32),
    borderColor: clampText(button?.borderColor, index === 0 ? '#0057B8' : 'rgba(255,255,255,0.72)', 40),
    radius: clampText(button?.radius, '4px', 16),
  }));
}

function normalizeConfig(type, config = {}, defaultConfig = {}) {
  const allowedConfig = pickAllowedConfig(type, config);

  if (type === 'slider') {
    return removeUndefinedValues({
      ...allowedConfig,
      slides: Array.isArray(allowedConfig.slides)
        ? allowedConfig.slides.slice(0, 8).map((slide, index) => ({
            title: clampText(slide?.title, `Slide ${index + 1}`, 90),
            subtitle: clampText(slide?.subtitle, 'Contenido destacado para la ciudadanía.', 220),
            bg: clampText(slide?.bg, defaultConfig.slides?.[0]?.bg || '#003DA6', 32),
            img: clampText(slide?.img, '', 260),
            buttons: normalizeButtons(slide?.buttons || []),
          }))
        : undefined,
    });
  }

  if (type === 'noticias') {
    return removeUndefinedValues({
      ...allowedConfig,
      items: Array.isArray(allowedConfig.items)
        ? allowedConfig.items.slice(0, 12).map((item, index) => ({
            id: clampText(item?.id, `ai-news-${Date.now()}-${index}`, 48),
            title: clampText(item?.title, `Noticia ${index + 1}`, 120),
            date: clampText(item?.date, 'May 04 2026', 32),
            category: clampText(item?.category || item?.status || item?.tag, 'Actualidad', 48),
            description: clampText(item?.description || item?.summary || item?.excerpt, 'Resumen breve de la noticia para publicación.', 260),
            img: clampText(item?.img, SPORTS_IMAGES[index % SPORTS_IMAGES.length], 260),
          }))
        : undefined,
    });
  }

  return removeUndefinedValues(allowedConfig);
}

function normalizeTemplateId(value) {
  return TEMPLATE_IDS.includes(value) ? value : 'landing';
}

function normalizeSections(sections = []) {
  return sections
    .filter(section => section && SECTION_REGISTRY[section.type])
    .slice(0, 8)
    .map((section, index) => {
      const registryItem = SECTION_REGISTRY[section.type];
      return {
        id: `ai-section-${Date.now()}-${index}`,
        name: registryItem.name,
        type: section.type,
        locked: false,
        config: {
          ...clone(registryItem.defaultConfig),
          ...normalizeConfig(section.type, section.config, registryItem.defaultConfig),
        },
      };
    });
}

function getRequestedCount(prompt, keyword, fallback, max) {
  const pattern = new RegExp(`(\\d+)\\s+(?:${keyword})`, 'i');
  const match = prompt.match(pattern);
  const parsed = match ? Number(match[1]) : fallback;
  return Math.min(max, Math.max(1, Number.isFinite(parsed) ? parsed : fallback));
}

function extractTextForReview(prompt) {
  const [, afterColon] = prompt.split(/:(.+)/s);
  if (afterColon) return afterColon.trim().replace(/^['"]|['"]$/g, '');
  return prompt.replace(/^(valida|revisa|corrige|mejora|validar|revisar|corregir|mejorar)\s+(este|esta|el|la)?\s*(texto|copy|frase|mensaje)?\s*/i, '').trim();
}

function createTextReviewReply(prompt) {
  const text = extractTextForReview(prompt);
  if (!text || text.length < 4) {
    return 'Puedo ayudarte a validar tono, claridad, ortografía, jerarquía y accesibilidad del texto. Pégame el texto exacto y te devuelvo una versión mejorada con observaciones puntuales.';
  }

  const startsWithVerb = /^(conoce|consulta|ingresa|entra|descubre|solicita|agenda|revisa)\b/i.test(text);
  const observations = [
    startsWithVerb ? 'El texto ya usa verbo de acción, eso ayuda.' : 'Conviene iniciar con un verbo claro de acción.',
    '“Entra ya” puede sentirse comercial o urgente; para tono institucional funciona mejor una acción concreta.',
    'La frase puede ser más específica si explica qué encontrará la persona al hacer clic.',
  ];

  return [
    `Revisé: “${text}”`,
    '',
    'Observaciones:',
    ...observations.map(item => `- ${item}`),
    '',
    'Versiones sugeridas:',
    '- Consulta nuestros servicios disponibles',
    '- Conoce los servicios y trámites disponibles',
    '- Accede a la información de servicios ciudadanos',
    '',
    'Mejor opción para botón: “Consultar servicios”.',
  ].join('\n');
}

function createSportsSlides(count) {
  const slideContent = [
    ['Agenda deportiva de la semana', 'Programación de torneos, escuelas de formación y actividades recreativas para todas las edades.'],
    ['Talento local en competencia', 'Deportistas de la región se preparan para representar a la comunidad en nuevos encuentros nacionales.'],
    ['Nuevos espacios para entrenar', 'Escenarios renovados fortalecen la práctica deportiva, la convivencia y el uso del tiempo libre.'],
    ['Actividad física en barrios', 'Jornadas comunitarias promueven hábitos saludables y participación ciudadana.'],
    ['Resultados y convocatorias', 'Consulta avances, inscripciones y oportunidades para clubes, entrenadores y familias.'],
    ['Deporte escolar activo', 'Instituciones educativas impulsan competencias formativas y procesos de iniciación deportiva.'],
    ['Inclusión a través del deporte', 'Programas adaptados abren espacios para la participación de personas con discapacidad.'],
    ['Recreación para la comunidad', 'Eventos abiertos fortalecen el encuentro ciudadano en parques y escenarios públicos.'],
  ];

  return slideContent.slice(0, count).map(([title, subtitle], index) => ({
    title,
    subtitle,
    bg: ['#003DA6', '#005384', '#1B5E20', '#1A237E', '#004cb0'][index % 5],
    img: SPORTS_IMAGES[index % SPORTS_IMAGES.length],
    buttons: normalizeButtons([
      { label: index === 0 ? 'Ver agenda' : 'Leer más', url: '#', style: 'primary', showIcon: true, icon: 'arrow-right' },
      { label: 'Inscripciones', url: '#', style: 'secondary' },
    ]),
  }));
}

function createSportsNews(count) {
  const items = [
    ['La ciudad abre inscripciones para escuelas deportivas', 'Formación', 'Niñas, niños y jóvenes podrán participar en procesos gratuitos de iniciación y fortalecimiento deportivo.'],
    ['Atletas locales se preparan para el campeonato regional', 'Competencias', 'Delegaciones de varias disciplinas adelantan jornadas de entrenamiento y preparación técnica.'],
    ['Renuevan escenarios para fútbol, atletismo y baloncesto', 'Infraestructura', 'Las mejoras buscan ampliar el acceso ciudadano a espacios seguros para la actividad física.'],
    ['Jornada de actividad física reúne a familias en parques', 'Comunidad', 'La estrategia promueve hábitos saludables con clases abiertas, juegos y orientación profesional.'],
    ['Clubes deportivos reciben acompañamiento institucional', 'Gestión', 'El programa fortalece procesos administrativos, técnicos y de participación comunitaria.'],
    ['Calendario deportivo incluye nuevas competencias barriales', 'Agenda', 'La programación busca activar escenarios locales y reconocer el talento de diferentes sectores.'],
    ['Deporte adaptado amplía su oferta de entrenamiento', 'Inclusión', 'Nuevos horarios facilitarán la participación de personas con discapacidad y cuidadores.'],
    ['Entrenadores participan en ciclo de actualización técnica', 'Capacitación', 'La formación aborda planificación, prevención de lesiones y metodologías para población joven.'],
  ];

  return items.slice(0, count).map(([title, category, description], index) => ({
    id: `sports-news-${Date.now()}-${index}`,
    title,
    date: ['May 04 2026', 'May 03 2026', 'May 02 2026', 'Abr 30 2026', 'Abr 28 2026', 'Abr 26 2026', 'Abr 24 2026', 'Abr 22 2026'][index],
    category,
    description,
    img: SPORTS_IMAGES[index % SPORTS_IMAGES.length],
  }));
}

function createPageFromPlan(plan) {
  const page = plan?.page || {};
  const pageId = `ai-page-${Date.now()}`;
  const generatedSections = normalizeSections(page.sections);

  if (generatedSections.length === 0) {
    throw new Error('El plan de IA no incluyó secciones válidas.');
  }

  return {
    id: pageId,
    label: String(page.label || 'Página generada').slice(0, 64),
    templateId: normalizeTemplateId(page.templateId),
    sections: [
      { id: 'header', name: 'Header Main', locked: true },
      ...generatedSections,
      { id: 'footer', name: 'Footer Main', locked: true },
    ],
  };
}

export function buildComponentCatalog() {
  return Object.values(SECTION_REGISTRY).map(section => ({
    id: section.id,
    name: section.name,
    allowedConfigKeys: ALLOWED_CONFIG_KEYS[section.id] || [],
  }));
}

export function createLocalAIResponse(prompt = '') {
  const lowerPrompt = prompt.toLowerCase();
  const mentionsText = /texto|copy|frase|mensaje|titulo|título|parrafo|párrafo|contenido/.test(lowerPrompt);
  const asksForTextHelp = /valid[aeo]r?|revis[aeo]r?|corrige|corregir|mejor[ao]r?|ortograf|redacci|copy|tono|seo|accesibilidad|claridad|microcopy|dime como|dime cómo/.test(lowerPrompt);
  const asksForPageWork = /crea|crear|constru|haz|hacer|pagina|página|seccion|sección|agrega|añade|genera una página|genera pagina/.test(lowerPrompt);
  const isGreeting = /^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|hey|hello|hi)[\s!.,¿?]*$/i.test(prompt.trim());
  const isTextTask = asksForTextHelp && mentionsText && !asksForPageWork;

  if (isGreeting || (!asksForPageWork && !isTextTask)) {
    return {
      intent: 'answer',
      reply: isGreeting
        ? 'Hola. Estoy listo para ayudarte a revisar contenido, proponer secciones o crear una página editable cuando me des una instrucción concreta.'
        : 'Puedo ayudarte con contenido, estructura, accesibilidad o creación de páginas. Dame una instrucción concreta, por ejemplo: “crea una página de trámites con tres secciones” o “revisa este texto para tono institucional”.',
      plan: null,
    };
  }

  if (isTextTask) {
    return {
      intent: 'validate_text',
      reply: createTextReviewReply(prompt),
      plan: null,
    };
  }

  return {
    intent: 'create_page',
    reply: 'Preparé una propuesta editable usando componentes del sistema y contenido inicial de muestra.',
    plan: createLocalAIPlan(prompt),
  };
}

export function createLocalAIPlan(prompt = '') {
  const lowerPrompt = prompt.toLowerCase();
  const wantsNews = /noticia|blog|prensa|actualidad/.test(lowerPrompt);
  const wantsSports = /deporte|deportes|deportiv|fútbol|futbol|baloncesto|atletismo|competencia|torneo/.test(lowerPrompt);
  const wantsProcedures = /tramite|trámite|servicio|ciudadano|solicitud/.test(lowerPrompt);
  const wantsData = /tabla|indicador|requisito|dato|informe/.test(lowerPrompt);
  const slideCount = getRequestedCount(prompt, 'slides?|diapositivas?', wantsSports ? 5 : 1, 8);
  const newsCount = getRequestedCount(prompt, 'noticias?|cards?|tarjetas?', wantsSports ? 6 : 4, 12);
  const pageLabel = wantsSports ? 'Noticias deportivas' : wantsProcedures ? 'Servicios ciudadanos' : wantsNews ? 'Centro de noticias' : wantsData ? 'Informe institucional' : 'Página generada';

  const sections = [
    {
      type: 'slider',
      config: {
        variant: 'Hero',
        slides: wantsSports ? createSportsSlides(slideCount) : [
          {
            title: pageLabel,
            subtitle: 'Encuentra información clara, servicios digitales y contenidos actualizados en un solo lugar.',
            bg: '#003DA6',
            img: '',
            buttons: [
              { label: 'Iniciar', url: '#', style: 'primary', showIcon: true, icon: 'arrow-right', backgroundColor: '#0057B8', textColor: '#ffffff', borderColor: '#0057B8', radius: '4px' },
              { label: 'Conocer más', url: '#', style: 'secondary', showIcon: false, icon: 'external-link-alt', backgroundColor: 'transparent', textColor: '#ffffff', borderColor: 'rgba(255,255,255,0.72)', radius: '4px' },
            ],
          },
        ],
      },
    },
    {
      type: wantsProcedures ? 'icon-grid' : 'icon-carousel',
      config: wantsProcedures
        ? {
            showTitle: true,
            title: 'Trámites y servicios',
            subtitle: 'Accede rápidamente a los servicios más consultados.',
            tabs: [
              { id: 'tab-1', label: 'General', items: [
                { id: 'ig-ai-1', icon: 'file-alt', showLabel: true, label: 'Radicar solicitud', target: 'none', url: '', pageId: '' },
                { id: 'ig-ai-2', icon: 'search', showLabel: true, label: 'Consultar estado', target: 'none', url: '', pageId: '' },
                { id: 'ig-ai-3', icon: 'calendar-alt', showLabel: true, label: 'Agendar cita', target: 'none', url: '', pageId: '' },
              ] },
            ],
          }
        : { showTitle: true, title: 'Accesos principales' },
    },
    wantsData
      ? { type: 'table', config: { title: 'Información clave', subtitle: 'Resumen de datos para consulta ciudadana.', variant: 'simple' } }
      : { type: 'links-directory', config: { title: 'Enlaces frecuentes', variant: 'default', sections: [{ id: 'links-ai-1', title: 'Información útil', collection: '' }] } },
    {
      type: 'noticias',
      config: {
        title: wantsSports ? 'Últimas noticias deportivas' : wantsNews ? 'Últimas noticias' : 'Contenido relacionado',
        subtitle: wantsSports ? 'Contenido editorial de muestra para mantener informada a la comunidad deportiva.' : '',
        variant: wantsSports || wantsNews ? 'Blog' : 'Lista Horizontal',
        items: wantsSports ? createSportsNews(newsCount) : undefined,
      },
    },
  ];

  return {
    action: 'create_page',
    page: {
      label: pageLabel,
      templateId: wantsProcedures ? 'tramite' : wantsNews || wantsSports ? 'noticia' : wantsData ? 'informe' : 'landing',
      sections,
    },
  };
}

export function applyAIPlanToEditorState(editorState, plan) {
  if (!plan || plan.action === 'none') return editorState;

  if (!['create_page', 'update_active_page'].includes(plan.action)) {
    throw new Error('El plan de IA no tiene una acción válida.');
  }

  if (plan.action === 'create_page') {
    const nextPage = createPageFromPlan(plan);
    return {
      ...editorState,
      pages: [...(editorState.pages || []), nextPage],
      activePageId: nextPage.id,
      selectedSectionId: null,
      navigation: [
        ...(editorState.navigation || []),
        { id: `nav-${nextPage.id}`, label: nextPage.label, type: 'simple', target: nextPage.id },
      ],
    };
  }

  const generatedSections = normalizeSections(plan.page?.sections || []);
  if (generatedSections.length === 0) {
    throw new Error('El plan de IA no incluyó secciones válidas.');
  }

  return {
    ...editorState,
    pages: (editorState.pages || []).map(page => {
      if (page.id !== editorState.activePageId) return page;
      const lockedHeader = (page.sections || []).find(section => section.id === 'header') || { id: 'header', name: 'Header Main', locked: true };
      const lockedFooter = (page.sections || []).find(section => section.id === 'footer') || { id: 'footer', name: 'Footer Main', locked: true };
      return {
        ...page,
        label: plan.page?.label || page.label,
        templateId: normalizeTemplateId(plan.page?.templateId || page.templateId),
        sections: [lockedHeader, ...generatedSections, lockedFooter],
      };
    }),
    selectedSectionId: null,
  };
}