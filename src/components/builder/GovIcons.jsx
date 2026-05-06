import React from 'react';
import { 
  FaUser, FaCog, FaHome, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaSearch, FaBars, FaTimes, FaCheck, FaExclamationTriangle,
  FaFileAlt, FaFilePdf, FaImage, FaVideo, FaLink, FaExternalLinkAlt,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp,
  FaArrowRight, FaArrowLeft, FaChevronDown, FaChevronUp, FaChevronRight, FaChevronLeft,
  FaAccessibleIcon, FaUniversalAccess, FaBlind, FaDeaf, FaWheelchair,
  FaBullhorn, FaCalendarAlt, FaCamera, FaChartBar, FaDownload, FaUpload
} from 'react-icons/fa';
import { MaskIcon } from './MaskIcon';

export const IconGovCo = (props) => (
  <svg viewBox="0 0 100 30" fill="currentColor" {...props}>
    <text x="0" y="22" fontFamily="sans-serif" fontSize="20" fontWeight="bold">GOV.CO</text>
  </svg>
);

export const IconColombiaPotencia = (props) => (
  <svg viewBox="0 0 150 40" fill="currentColor" {...props}>
    <text x="0" y="16" fontFamily="sans-serif" fontSize="14" fontWeight="bold">Colombia</text>
    <text x="0" y="32" fontFamily="sans-serif" fontSize="12">Potencia de la Vida</text>
  </svg>
);

// Helper to create an icon component from a public /builder-icons/ URL
const createFigmaIcon = (id) => {
  const url = `/builder-icons/${id}.svg`;
  const Comp = (props) => <MaskIcon icon={url} {...props} />;
  return Comp;
};

// All 799 SVG icon IDs available in /public/builder-icons/
// Generated from the prototype's src/assets/icons/ directory.
const FIGMA_ICON_IDS = [
  'accessible-icon','address-book','address-card','adjust','ad','align-center',
  'align-justify','align-left','align-right','allergies','amazon','ambulance',
  'american-sign-language-interpreting','anchor','android','angle-double-down',
  'angle-double-left','angle-double-right','angle-double-up','angle-down',
  'angle-left','angle-right','angle-up','angry','angular','apple','app-store',
  'archive','arrow-circle-down','arrow-circle-left','arrow-circle-right',
  'arrow-circle-up','arrow-down','arrow-left','arrow-right','arrow-up',
  'assistive-listening-systems','asterisk','at','audio-description',
  'award','AZoom','AzoomPlus',
  'baby','backspace','backward','balance-scale','ban','band-aid','barcode',
  'bars','baseball-ball','basketball-ball','bath','battery-empty',
  'battery-full','battery-half','battery-quarter','battery-three-quarters',
  'bed','beer','bell','bell-slash','bezier-curve','bible','bicycle','binoculars',
  'birthday-cake','blender','blind','bold','bolt','bomb','book','bookmark',
  'book-open','book-reader','bowling-ball','box','boxes','braille','briefcase',
  'broadcast-tower','broom','brush','bug','building','bullhorn','bullseye',
  'burn','bus','business-time','calculator','calendar','calendar-alt',
  'calendar-check','calendar-day','calendar-minus','calendar-plus',
  'calendar-times','calendar-week','camera','camera-retro','campground',
  'candy-cane','cannabis','capsules','car','car-alt','carrot','car-side',
  'cart-arrow-down','cart-plus','cash-register','cat','certificate','chair',
  'chalkboard','chalkboard-teacher','charging-station','chart-area',
  'chart-bar','chart-line','chart-pie','check','check-circle','check-double',
  'check-square','chess','chess-bishop','chess-board','chess-king',
  'chess-knight','chess-pawn','chess-queen','chess-rook','chevron-circle-down',
  'chevron-circle-left','chevron-circle-right','chevron-circle-up',
  'chevron-down','chevron-left','chevron-right','chevron-up','child',
  'church','circle','circle-notch','city','clipboard','clipboard-check',
  'clipboard-list','clock','clone','closed-captioning','cloud',
  'cloud-download-alt','cloud-meatball','cloud-moon','cloud-moon-rain',
  'cloud-rain','cloud-showers-heavy','cloud-sun','cloud-sun-rain',
  'cloud-upload-alt','cocktail','code','code-branch','coffee','cog','cogs',
  'coins','columns','comment','comment-alt','comment-dollar','comment-dots',
  'comment-medical','comments','comment-slash','compact-disc','compass',
  'compress','compress-arrows-alt','concierge-bell','cookie','cookie-bite',
  'copy','copyright','couch','credit-card','crop','crop-alt','cross',
  'crosshairs','crow','crown','crutch','cube','cubes','cut',
  'database','deaf','democrat','desktop','dharmachakra','diagnoses',
  'dice','dice-d20','dice-d6','dice-five','dice-four','dice-one','dice-six',
  'dice-three','dice-two','digital-tachograph','directions','disease',
  'divide','dizzy','dna','dog','dollar-sign','dolly','dolly-flatbed',
  'donate','door-closed','door-open','dot-circle','dove','download',
  'drafting-compass','dragon','draw-polygon','drum','drum-steelpan',
  'drumstick-bite','dumbbell','dumpster','dumpster-fire','dungeon',
  'edit','egg','eject','ellipsis-h','ellipsis-v','envelope','envelope-open',
  'envelope-open-text','envelope-square','equals','eraser','ethernet','euro-sign',
  'exchange-alt','exclamation','exclamation-circle','exclamation-triangle',
  'expand','expand-arrows-alt','external-link-alt','external-link-square-alt',
  'eye','eye-dropper','eye-slash','facebook','facebook-f','facebook-messenger',
  'facebook-square','fan','fast-backward','fast-forward','fax','feather',
  'feather-alt','female','fighter-jet','file','file-alt','file-archive',
  'file-audio','file-code','file-contract','file-csv','file-download',
  'file-excel','file-export','file-image','file-import','file-invoice',
  'file-invoice-dollar','file-medical','file-medical-alt','file-pdf',
  'file-powerpoint','file-prescription','file-signature','file-upload',
  'file-video','file-word','fill','fill-drip','film','filter','fingerprint',
  'fire','fire-alt','fire-extinguisher','first-aid','fish','fist-raised',
  'flag','flag-checkered','flag-usa','flask','flushed','folder','folder-minus',
  'folder-open','folder-plus','font','football-ball','forward','frog',
  'frown','frown-open','funnel-dollar','futbol',
  'gamepad','gas-pump','gavel','gem','genderless','ghost','gift','gifts',
  'glass-cheers','glass-martini','glass-martini-alt','glass-whiskey',
  'glasses','globe','globe-africa','globe-americas','globe-asia',
  'globe-europe','golf-ball','gopuram','graduation-cap','greater-than',
  'greater-than-equal','grimace','grin','grin-alt','grin-beam','grin-beam-sweat',
  'grin-hearts','grin-squint','grin-squint-tears','grin-stars','grin-tears',
  'grin-tongue','grin-tongue-squint','grin-tongue-wink','grin-wink',
  'grip-horizontal','grip-lines','grip-lines-vertical','grip-vertical','guitar',
  'h-square','hamburger','hammer','hamsa','hand-holding','hand-holding-heart',
  'hand-holding-usd','hand-lizard','hand-middle-finger','hand-paper',
  'hand-peace','hand-point-down','hand-pointer','hand-point-left',
  'hand-point-right','hand-point-up','hand-rock','hands','hand-scissors',
  'handshake','hands-helping','hand-spock','hanukiah','hard-hat',
  'hashtag','hat-wizard','haykal','hdd','heading','headphones',
  'headphones-alt','headset','heart','heartbeat','heart-broken',
  'helicopter','highlighter','hiking','hippo','history','hockey-puck',
  'holly-berry','home','horse','horse-head','hospital','hospital-alt',
  'hospital-symbol','hot-tub','hotdog','hotel','hourglass','hourglass-end',
  'hourglass-half','hourglass-start','house-damage','hryvnia',
  'i-cursor','id-badge','id-card','id-card-alt','igloo','image','images',
  'inbox','indent','industry','infinity','info','info-circle','instagram',
  'interrobang',
  'italic',
  'jedi','joint','journal-whills',
  'kaaba','key','keyboard','khanda','kiss','kiss-beam','kiss-wink-heart',
  'kiwi-bird',
  'landmark','language','laptop','laugh','laugh-beam','laugh-squint',
  'laugh-wink','layer-group','leaf','lemon','less-than','less-than-equal',
  'level-down-alt','level-up-alt','life-ring','lightbulb','linkedin',
  'linkedin-in','linode','lira-sign','list','list-alt','list-ol','list-ul',
  'location-arrow','lock','lock-open','long-arrow-alt-down','long-arrow-alt-left',
  'long-arrow-alt-right','long-arrow-alt-up','low-vision','luggage-cart',
  'magic','magnet','mail-bulk','male','map','map-marked','map-marked-alt',
  'map-marker','map-marker-alt','map-pin','map-signs','marker','mars',
  'mars-double','mars-stroke','mars-stroke-h','mars-stroke-v','mask',
  'medal','medkit','meh','meh-blank','meh-rolling-eyes','memory','menorah',
  'mercury','meteor','microchip','microphone','microphone-alt',
  'microphone-alt-slash','microphone-slash','microscope','minus',
  'minus-circle','minus-square','mitten','mobile','mobile-alt','money-bill',
  'money-bill-alt','money-bill-wave','money-bill-wave-alt','money-check',
  'money-check-alt','monument','moon','mortar-pestle','mosque',
  'motorcycle','mountain','mouse','mouse-pointer','mug-hot','music',
  'network-wired','neuter','newspaper','not-equal','notes-medical',
  'object-group','object-ungroup','oil-can','om','otter','outdent',
  'pager','paint-brush','paint-roller','palette','pallet','paper-plane',
  'paperclip','parachute-box','paragraph','parking','passport',
  'pastafarianism','paste','pause','pause-circle','paw','peace','pen',
  'pen-alt','pencil-alt','pencil-ruler','pen-fancy','pen-nib','pen-square',
  'people-carry','pepper-hot','percent','percentage','person-booth',
  'phone','phone-alt','phone-slash','phone-square','phone-square-alt',
  'phone-volume','photo-video','piggy-bank','pills','pizza-slice',
  'place-of-worship','plane','plane-arrival','plane-departure',
  'play','play-circle','plug','plus','plus-circle','plus-square',
  'podcast','poll','poll-h','poo','poop','poo-storm','portrait',
  'pound-sign','power-off','pray','praying-hands','prescription',
  'prescription-bottle','prescription-bottle-alt','print','procedures',
  'project-diagram','puzzle-piece',
  'qrcode','question','question-circle','quidditch','quote-left','quote-right',
  'quran',
  'radiation','radiation-alt','rainbow','random','receipt','record-vinyl',
  'recycle','redo','redo-alt','registered','remove-format','reply',
  'reply-all','republican','restroom','retweet','ribbon','ring','road',
  'robot','rocket','route','rss','rss-square','ruble-sign','ruler',
  'ruler-combined','ruler-horizontal','ruler-vertical','running',
  'rupee-sign','sad-cry','sad-tear','satellite','satellite-dish',
  'save','school','screwdriver','scroll','sd-card','search','search-dollar',
  'search-location','search-minus','search-plus','seedling','server',
  'shapes','share','share-alt','share-alt-square','share-square',
  'shekel-sign','shield-alt','ship','shipping-fast','shoe-prints',
  'shopping-bag','shopping-basket','shopping-cart','shower','shuttle-van',
  'sign','sign-in-alt','sign-language','sign-out-alt','signal','signature',
  'sim-card','sitemap','skating','skiing','skiing-nordic','skull',
  'skull-crossbones','slash','sleigh','sliders-h','smile','smile-beam',
  'smile-wink','smog','smoking','smoking-ban','sms','snowboarding',
  'snowflake','snowman','snowplow','socks','solar-panel','sort',
  'sort-alpha-down','sort-alpha-down-alt','sort-alpha-up','sort-alpha-up-alt',
  'sort-amount-down','sort-amount-down-alt','sort-amount-up','sort-amount-up-alt',
  'sort-down','sort-numeric-down','sort-numeric-down-alt','sort-numeric-up',
  'sort-numeric-up-alt','sort-up','spa','space-shuttle','spell-check',
  'spider','spinner','splotch','spray-can','square','square-full',
  'square-root-alt','stamp','star','star-and-crescent','star-half',
  'star-half-alt','star-of-david','star-of-life','step-backward','step-forward',
  'stethoscope','sticky-note','stop','stop-circle','stopwatch','store',
  'store-alt','stream','street-view','strikethrough','stroopwafel',
  'subscript','subway','suitcase','suitcase-rolling','sun','superscript',
  'surprise','swatchbook','swimmer','swimming-pool','synagogue','sync',
  'sync-alt','syringe',
  'table','tablet','tablet-alt','tablets','tachometer-alt','tag','tags',
  'tape','tasks','taxi','teeth','teeth-open','temperature-high',
  'temperature-low','tenge','terminal','text-height','text-width','th',
  'theater-masks','thermometer','thermometer-empty','thermometer-full',
  'thermometer-half','thermometer-quarter','thermometer-three-quarters',
  'th-large','th-list','thumbs-down','thumbs-up','thumbtack','ticket-alt',
  'times','times-circle','tiktok','tint','tint-slash','tired','toggle-off',
  'toggle-on','toilet','toilet-paper','toolbox','tools','tooth','torah',
  'torii-gate','tractor','trademark','traffic-light','train','tram',
  'transgender','transgender-alt','trash','trash-alt','trash-restore',
  'trash-restore-alt','tree','trophy','truck','truck-loading','truck-monster',
  'truck-moving','truck-pickup','tshirt','tty','tv','twitter','twitter-square',
  'umbrella','umbrella-beach','underline','universal-access','university',
  'unlink','unlock','unlock-alt','upload','user','user-alt','user-alt-slash',
  'user-astronaut','user-check','user-circle','user-clock','user-cog',
  'user-edit','user-friends','user-graduate','user-injured','user-lock',
  'user-md','user-minus','user-ninja','user-nurse','user-plus','users',
  'users-cog','user-secret','user-shield','user-slash','user-tag',
  'user-tie','user-times','utensil-spoon','utensils',
  'vector-square','venus','venus-double','venus-mars','vial','vials',
  'video','video-slash','vihara','voicemail','volleyball-ball','volume-down',
  'volume-mute','volume-off','volume-up','vote-yea',
  'walking','wallet','warehouse','water','wave-square','weight','weight-hanging',
  'wheelchair','wifi','wind','window-close','window-maximize','window-minimize',
  'window-restore','wine-bottle','wine-glass','wine-glass-alt','won-sign',
  'wrench','x-ray','yen-sign','yin-yang','youtube',
];

// Build figmaIcons from the static list
const figmaIcons = {};
FIGMA_ICON_IDS.forEach((id) => {
  const name = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  figmaIcons[id] = {
    name,
    icon: createFigmaIcon(id),
    tags: id.split('-'),
    isFigma: true,
  };
});

// Base icons (manually curated or legacy)
const baseIcons = {
  // Brand
  'govco': { name: 'Gov.co', icon: IconGovCo, tags: ['brand', 'logo', 'gov'] },
  'colombia-potencia': { name: 'Colombia Potencia', icon: IconColombiaPotencia, tags: ['brand', 'logo', 'colombia'] },

  // Accessibility (legacy mapping to react-icons, can be overridden by figma icons below)
  'accessible': { name: 'Accesibilidad', icon: FaAccessibleIcon, tags: ['a11y', 'accessibility'] },
  'universal-access': { name: 'Acceso Universal', icon: FaUniversalAccess, tags: ['a11y', 'accessibility'] },
  'blind': { name: 'Invidente', icon: FaBlind, tags: ['a11y', 'blind'] },
  'deaf': { name: 'Sordo', icon: FaDeaf, tags: ['a11y', 'deaf'] },
  'wheelchair': { name: 'Silla de Ruedas', icon: FaWheelchair, tags: ['a11y', 'wheelchair'] },
};

// Merge both sets. Base icons take priority for a11y overrides.
export const GOV_ICONS = {
  ...figmaIcons,
  ...baseIcons,
};
