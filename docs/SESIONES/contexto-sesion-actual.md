# Contexto de Sesión — NexCode97 (Guardado para continuar)

> Fecha: 2026-06-02 · Modelo: Opus
> Esta sesión cubrió varios proyectos. Lee esto al iniciar una sesión nueva.

---

## 📍 ESTADO ACTUAL — Resumen rápido

Trabajamos en 3 frentes dentro del repo **NexCode97** (`C:\Users\nexco\Documents\GitHub\NexCode97`):

1. **Sitio principal** (`index.html`) — ajustes menores hechos
2. **Cotización Parapente al Parque** (`cotizaciones/parapente-al-parque.html`) — COMPLETADA
3. **Panel Admin** (`admin/index.html`) — rediseñado con drawers, kanban, gráfica
4. **Landing Parapente al Parque** (`parapente/index.html`) — EN PROGRESO ACTIVO ⬅️ aquí estábamos

**Repo remoto:** `github.com/NexCode97/NexCode97.git` (se renombró desde NexCode97-Tech)
**Dominio producción:** `nexcode97.com`
**Deploy:** Vercel (auto-deploy en push a main)

---

## 🪂 LANDING PARAPENTE — donde quedamos (`parapente/index.html`)

### Stack
HTML puro + CSS + JS vanilla (NO React). Todo en un solo `index.html`.

### Tipografía (editorial premium)
- Headings: **Bricolage Grotesque** (`--sans`)
- Acentos italic: **Instrument Serif** (`--serif`)
- Body: **Inter** (`--body`)

### Paleta (IMPORTANTE — ya NO usar azul)
TODO el azul fue reemplazado por el dorado del logo:
- `--sky:#F5A623` (dorado del logo)
- `--sky-d:#D88C12` (bronce)
- `--sunset:#F5A623` / `--sunset-l:#FBBF24`
- `--grad:linear-gradient(135deg,#F5A623,#FBBF24)` (solo dorados, sin mezclar azul)
- Logo real: naranja dorado `#F5A623`, negro `#1A1A1A`, blanco `#FAFAFA`

### Videos en la carpeta (renombrados sin espacios)
- `hero-video.mp4` — fondo del hero
- `video-2.mp4` — sección "Por qué nosotros"
- `galeria-1.mp4` a `galeria-5.mp4` — galería

### Secciones completadas
1. **Hero** — video fondo + navbar glassmorphism pill + título con **efecto gooey morph**
   (palabras rotan: Las Nubes → El Cielo → Bucaramanga → El Viento → La Libertad)
   + botón "Reservar tu Vuelo" (DORADO) + scroll parallax + menú hamburguesa móvil
2. **Stats** — 3 Liquid Glass cards con gauges semicirculares animadas:
   - Vuelos Realizados (gauge BLANCO/PLATA) — 500
   - Años Experiencia (gauge BRONCE/COBRE) — 8 años
   - Seguridad (gauge VERDE) — 100%
   (cada gauge color DISTINTO, no repetir)
3. **Experiencias** — efecto Expand-on-Hover, 3 cards (Bautizo azul→ahora revisar, Tándem dorado, Curso violeta)
   - Títulos colapsados en `writing-mode:vertical-rl`
   - Títulos expandidos en una sola línea (`white-space:nowrap`)
4. **Por qué nosotros** — video-2 + lista de features
5. **Galería** — 5 videos en bento grid con zoom hover
6. **CTA final** — "¿Listo para volar?" (una sola línea) + WhatsApp
7. **Footer**

### ⏳ TAREA PENDIENTE INMEDIATA (lo último que pidió el usuario)
El usuario quiere aplicar el componente **"woven-light-hero"** (Three.js partículas
torus-knot interactivas con mouse) al HERO. Es un efecto de partículas de seda tejida
por luz que reacciona al cursor.

**Decisión a tomar:** el hero actual tiene VIDEO de fondo. El woven-light-hero usa
Three.js con 50,000 partículas. Opciones:
- A) Reemplazar video por partículas Three.js
- B) Partículas Three.js COMO OVERLAY sobre el video
- C) Combinar
**CONFIRMAR con el usuario antes de implementar.** Adaptar a vanilla JS (sin React/framer-motion).
Three.js se carga por CDN. Ya hay precedente: el admin usa Chart.js por CDN y CSP permite cdn.jsdelivr.net.

### Testimonios — quedó a medias
Empecé a portar el componente **3D Marquee testimonials** (4 columnas verticales con
perspective 3D, scroll infinito). El CSS ya está puesto (`.test-3d-wrap`, `.test-col`,
`marqueeY` keyframe, avatares `.av-1` a `.av-9`). **FALTA el HTML de las cards de testimonios**
(reemplazar el `.test-grid` viejo por `.test-3d-wrap` con las columnas). Revisar si quedó
HTML viejo `.test-grid` que ya no matchea el CSS nuevo.

### Prompts de imágenes para cards de experiencias (entregados, pendiente que el cliente genere)
Si el usuario trae imágenes `exp-1.jpg`, `exp-2.jpg`, `exp-3.jpg`, integrarlas como
fondo de cada card de experiencia (reemplazando degradados sólidos).

---

## 🔑 ADMIN PANEL (`admin/index.html`) — estado

- Usa **Supabase** (auth + 3 tablas: `leads`, `proyectos`, `finanzas`)
  - URL: `https://eshdkxfalahxoudedogh.supabase.co`
  - Proyecto se PAUSA solo (plan free) tras 1 semana inactivo → restaurar en supabase.com
- Login con `nexcode97@gmail.com`. Se agregó botón "¿Olvidaste tu contraseña?"
- Rediseñado con 7 skills: impeccable, ui-ux-pro-max, taste, emilkowal-animations,
  micro-interactions, glassmorphism, page-transitions
- **Modales → Drawers** laterales (panel desliza desde derecha)
- **Leads → Kanban** board 5 columnas (Nuevo/Conversación/Propuesta/Cerrado/Perdido)
- **Dashboard** con gráfica de línea tipo pulso (Chart.js) ingresos vs gastos
- **Confirm-delete** personalizado (no browser dialog)
- **Flatpickr** para fechas + **Custom Select propio** (se quitó Tom Select por conflictos CSS)
- Paleta admin: púrpura `#7c3aed` + cyan `#06b6d4`
- **Migración a Railway** quedó PENDIENTE (el usuario quería pasar de Supabase a Railway
  para tener todo en un punto, pero primero recuperar contraseña)

---

## 📄 COTIZACIÓN PARAPENTE (`cotizaciones/parapente-al-parque.html`) — COMPLETADA

- Cliente: **Parapente al Parque** (dueño: Hotman Guevara)
- Servicio: página web · Precio: **$2.500.000 COP** pago único · Validez 15 días
- NexCode97 cubre dominio primer año (~$10 USD), hosting Vercel gratis permanente
- Header con imagen `header nuevo.png`
- Sin precios por ítem (solo checkmarks ✓)
- Para exportar PDF: abrir en Chrome → Imprimir → Guardar PDF, márgenes Ninguno

---

## ⚙️ NOTAS TÉCNICAS / ERRORES RESUELTOS

- **CSP en `vercel.json`**: agregado `cdn.jsdelivr.net` a `style-src`, `font-src`, `connect-src`
  para permitir Flatpickr, Tom Select, Chart.js. Si se agrega Three.js debería funcionar
  (script-src ya tiene cdn.jsdelivr.net).
- **Windows + git**: warning LF→CRLF es normal, ignorar
- **Renombrar archivos con espacios** antes de usarlos en src (URLs no aceptan espacios)
- WhatsApp del negocio actualizado a nivel sitio: **300 635 9008** (`573006359008`)
- Commits: terminar con `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 🎨 SKILLS instaladas esta sesión (vía npx skills add)
- `framer-motion-animator`, `micro-interactions`, `glassmorphism`, `page-transitions`
- Ya estaban: impeccable, ui-ux-pro-max, taste-skill, emilkowal-animations
- **REGLA DEL USUARIO:** siempre usar las skills de diseño al diseñar (invocarlas, no de memoria)

## 🔌 MCP instalado
- **Magic de 21st.dev** (`@21st-dev/magic`) — genera componentes UI premium.
  Herramientas: `mcp__magic__21st_magic_component_builder`, `..._inspiration`
  Flujo: pedir componente → devuelve React → PORTAR a vanilla HTML/CSS/JS para esta landing.
