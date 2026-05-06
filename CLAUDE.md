@AGENTS.md

# sede-admin — Panel de administración

Frontend del panel de administración de la Sede Electrónica. **Solo accesible desde red interna** (nunca CDN pública).

## Stack
Next.js 14 · React 18 · TypeScript 5 · Tailwind 4 · Lucide · class-variance-authority

## Dev server
```bash
npm run dev   # http://localhost:3000
```

## Entrada del sistema
`/setup` es el wizard de instalación. Es la primera pantalla en una instancia nueva. No requiere `.env` — la URL del backend la ingresa el usuario en el Paso 1 del wizard.

## Arquitectura de carpetas
```
src/
  app/
    setup/               ← Wizard de instalación (5 pasos)
      _components/       ← Stepper, SetupWizard, steps/
    (módulos futuros: login/, dashboard/, noticias/, tramites/...)
  components/
    ui/                  ← Button, Input, Select, Card, Badge, Table, Modal, Spinner, Toggle, Accordion, Avatar
    layout/              ← AdminLayout, Sidebar, TopBar, PageHeader
  lib/
    setup.service.ts     ← Fetch helpers — reciben apiUrl como parámetro, sin .env
    utils.ts             ← cn()
  types/
    setup.types.ts       ← DTOs que mapean el backend .NET (camelCase)
```

## Convenciones obligatorias
- Componentes React: `PascalCase.tsx`
- Hooks: `usePascalCase.ts`
- Servicios: `camelCase.service.ts`
- Rutas Next.js: kebab-case (`/mapa-del-sitio`, `/mis-tramites`)
- Booleanos: prefijo `is/has/can/should`
- Constantes globales: `SCREAMING_SNAKE_CASE`
- **No** mezclar rutas del portal ciudadano aquí (va en `sede-portal`)

## Componentes UI
Antes de crear uno nuevo verificar `src/components/ui/`. Usan `cva` + `cn`. Tema oscuro: canvas `#000`, surface `#181818`, border `#2d2d2d`.

## Tokens de color clave
- `#003DA6` — azul GOV.CO (brand primary, botón principal)
- `#F0A500` — amarillo GOV.CO (brand secondary, alertas)
- `#27ae60` éxito · `#eb5757` error · `#f2994a` warning

## Backend
Corre en `http://localhost:5212` en DEV. Los servicios reciben `apiUrl` como parámetro. No hardcodear la URL del backend en el código.
