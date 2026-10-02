# NexCode97 — Instrucciones para Claude

## Contexto del proyecto
Repositorio principal de NexCode97, agencia de desarrollo de software fundada por un desarrollador fullstack colombiano. Contiene el sitio principal y los portafolios de productos.

## Stack
- Sitio: Next.js en `web/` (Vercel, proyecto `nex-code97`, www.nexcode97.com), despliega desde GitHub en cada push a `main`
- CRM: repo aparte `NexCode97/crm` en Railway (proyecto "NexCode97 CRM"), servido en `/crm` por rewrite en `web/next.config.ts`
- No se usa Supabase. Toda base de datos va en PostgreSQL de Railway
- Repo: github.com/NexCode97/NexCode97

## Estructura del proyecto
```
NexCode97/
├── web/                ← Sitio principal nexcode97.com (Next.js)
├── assets/             ← Imágenes, videos, favicon
├── appntrl/            ← Portafolio producto APP NTRL
├── veloclub/           ← Portafolio producto VeloClub
└── vercel.json
```

## Preferencias de trabajo
- Hacer commit y push directamente sin pedir confirmación
- Idioma: español colombiano
- Confirmar antes de cambios grandes o estructurales
- Actualizar memoria cuando haya cambios importantes de contexto
- Mensajes de commit en inglés, concisos

## CRM (/crm)
- Código en el repo `NexCode97/crm` (Express + Prisma + PostgreSQL), desplegado en Railway desde GitHub
- `web/next.config.ts` reenvía `/crm` y `/crm/*` a `crm-production-9b97.up.railway.app` quitando el prefijo
- En Railway el CRM corre con `CRM_BASE=/crm` y `TRUST_PROXY=2`
- Las cabeceras de seguridad del sitio excluyen `/crm`: el CRM manda las suyas. Con dos CSP el navegador aplica ambas y rompe el CRM
- El botón "Ingresar" del header (escritorio y móvil) lleva a `/crm/`
- El formulario de contacto sigue guardando leads y avisando por correo (Resend); no hay panel de leads en el sitio

## Seguridad implementada
- HTTP security headers en `web/next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- `noopener noreferrer` en todos los links externos

## Grids responsive (estándar en todo el proyecto)
- Desktop: `repeat(4, 1fr)`
- Tablet (≤960px): `repeat(3, 1fr)`
- Móvil (≤768px y ≤560px): `repeat(2, 1fr)`

## Hero sections (portafolios)
- Desktop: alineado a la izquierda
- Tablet y móvil (≤960px): centrado

## Skills — activar automáticamente según contexto

### Regla principal
Evaluar todas las skills disponibles en cada tarea — incluyendo las que se instalen a futuro — y activar las que apliquen sin esperar que el usuario las mencione explícitamente.

### Mapa de skills por tarea

| Tarea | Skills a considerar |
|-------|-------------------|
| Bug o error | `diagnose` |
| Revisar / limpiar código | `simplify`, `backend-code-review` |
| Seguridad / auth / vulnerabilidades | `owasp-security`, `security-review`, `security-requirement-extraction` |
| Cambios de UI / diseño visual | `web-design-guidelines`, `ui-ux-pro-max`, `design:design-critique` |
| Accesibilidad | `design:accessibility-review` |
| Textos / copy / microcopy | `design:ux-copy` |
| Design system | `design:design-system`, `tailwind-design-system`, `design-system` |
| Investigación de usuarios | `design:user-research`, `design:research-synthesis` |
| Handoff specs | `design:design-handoff` |
| Deploy / Vercel | `deploy-to-vercel`, `vercel-cli-with-tokens` |
| Búsqueda en internet | `nimble:search`, `nimble:nimble-web-expert` |
| SEO | `nimble:seo-intel` |
| Competidores / mercado | `nimble:competitor-intel`, `nimble:competitor-positioning`, `nimble:market-finder` |
| Análisis de empresas | `nimble:company-deep-dive` |
| Reuniones / personas | `nimble:meeting-prep` |
| Talento / recruiting | `nimble:talent-sourcing` |
| Lugares locales / negocios | `nimble:local-places` |
| Artefactos web interactivos | `anthropic-skills:web-artifacts-builder` |
| PDFs | `anthropic-skills:pdf` |
| Documentos Word | `anthropic-skills:docx` |
| Hojas de cálculo Excel | `anthropic-skills:xlsx` |
| Presentaciones PowerPoint | `anthropic-skills:pptx` |
| Arte / imágenes / diseño visual | `anthropic-skills:canvas-design` |
| Crear MCPs | `anthropic-skills:mcp-builder` |
| Crear skills nuevas | `anthropic-skills:skill-creator` |
| Tareas programadas / routines | `anthropic-skills:schedule` |
| Organizar / consolidar memoria | `anthropic-skills:consolidate-memory` |
| Figma | `figma:figma-use` (siempre primero), luego la skill específica |
| React / Next.js | `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions` |
| React Native / Expo | `vercel-react-native-skills` |
| Node.js backend | `nodejs-backend-patterns` |
| API de Anthropic / Claude SDK | `claude-api` |
| Miro boards | `miro:miro-mcp`, luego `miro:diagram`, `miro:doc`, `miro:table`, `miro:browse`, `miro:summarize` |
| Validar idea / plan de negocio | `grill-me` |
| Explicación muy simple | `caveman` |
| Buscar skills nuevas | `find-skills` |
| Configurar settings / hooks | `update-config` |
| Atajos de teclado | `keybindings-help` |
| Reducir prompts de permisos | `fewer-permission-prompts` |
| Tarea repetitiva / loop | `loop` |

### Skills instaladas manualmente
- `grill-me` — mattpocock/skills
- `caveman` — juliusbrussee/caveman
- `diagnose` — mattpocock/skills
- `security-requirement-extraction` — wshobson/agents
- `owasp-security` — instalada durante auditoría de seguridad
