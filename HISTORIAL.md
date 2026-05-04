# NexCode97 — Historial de Proyecto

> Este archivo documenta todas las decisiones, cambios y contexto del proyecto.
> Actualizado cada vez que se realiza un cambio importante.

---

## Identidad de Marca

| Campo | Valor |
|---|---|
| **Nombre** | NexCode97 |
| **Tipo** | Empresa de desarrollo de software a la medida |
| **Tagline** | "Cada negocio merece su propio sistema." |
| **WhatsApp** | +57 316 413 4212 |
| **Correo** | nexcode97@gmail.com |
| **Instagram** | @nexcode97 |
| **Web** | nexcode97.com (pendiente publicar) |

---

## Colores Corporativos

| Nombre | Hex | Uso |
|---|---|---|
| Fondo principal | `#0a0a14` | Background de todas las páginas |
| Fondo cards | `#1e293b` | Tarjetas y secciones secundarias |
| Violeta | `#7c3aed` | Acento principal (inicio del gradiente) |
| Violeta claro | `#a78bfa` | Textos y badges |
| Cian | `#06b6d4` | Acento secundario (fin del gradiente) |
| Cian claro | `#22d3ee` | Textos hover |
| Gradiente | `#7c3aed → #06b6d4` | Botones, íconos, elementos destacados |
| Texto principal | `#f1f5f9` | Textos en blanco |
| Texto secundario | `#94a3b8` | Subtítulos y descripciones |
| Borde | `#334155` | Bordes de cards |

---

## Tipografía

- **Fuente:** System font stack — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Estilo del nombre:** `NexCode` en blanco + `97` en cian/gradiente
- **Estilo headings:** Font-weight 800, letter-spacing negativo

---

## Logo

Archivos en `C:/Users/socia/OneDrive/Desktop/Claude/NexCode97/`:

| Archivo | Descripción |
|---|---|
| `Icono Full - NexCode97.png` | Logo completo: ícono `</>` + texto "NexCode97" sobre fondo oscuro redondeado |
| `Letrero.png` | Solo ícono `</>` + "NexCode97" + tagline, fondo transparente |
| `Logos + Letreros.cdr` | Archivo fuente editable en CorelDRAW |

**Descripción del ícono:** Símbolo `< / >` con tres elementos separados. `<` en violeta, `/` en gradiente, `>` en cian. Líneas redondeadas, estilo moderno.

---

## Servicios que ofrece NexCode97

1. Apps web a la medida
2. Apps móviles
3. Páginas web corporativas y landing pages
4. Sistemas internos y herramientas de gestión
5. Tiendas en línea y plataformas digitales
6. Integraciones (pagos, WhatsApp, correo y más)
7. PWA — Apps instalables sin tienda de aplicaciones

---

## Portafolio de Proyectos

### APP NTRL
- **Tipo:** Sistema de gestión completo
- **Cliente:** Empresa de ropa deportiva (Natural)
- **Estado:** En producción ✅
- **Tecnología:** React + Node.js + PostgreSQL | Vercel + Render + Cloudinary (tier gratuito)
- **Modelo de pago:** Pago único, sin mensualidades
- **Repo/Código:** `C:/Users/socia/OneDrive/Desktop/Claude/app-ntrl/`

**Paneles:**
- Admin (11 módulos): Dashboard, Pedidos, Clientes, Catálogo, Producción, Finanzas, Suministros, Proveedores, Usuarios, Mensajes, Reportes
- Vendedor (4 módulos): Pedidos, Clientes, Catálogo, Finanzas
- Trabajador (3 módulos): Mis Tareas, Suministros, Mensajes

### VeloClub
- **Tipo:** Plataforma SaaS de gestión para clubs de ciclismo
- **Cliente:** VeloClub (propio)
- **Estado:** En desarrollo ✓
- **Tecnología:** Next.js 15 + Express.js + PostgreSQL + Prisma + Clerk Auth + Cloudinary
- **Modelo:** SaaS — suscripción mensual por club
- **Funcionalidades:** Gestión de miembros, cuotas mensuales, pagos automáticos, competencias, resultados, reportes financieros
- **URL:** https://veloclub-plum.vercel.app/

### Páginas web completadas
- **Natural Ropa Deportiva** — Sitio corporativo con catálogo
- **Guevara Sport** — Sitio corporativo con catálogo

---

## Estructura de Archivos del Proyecto Web

```
C:/Users/socia/OneDrive/Desktop/Claude/
├── NexCode97/                    ← Sitio principal de NexCode97 (EN CONSTRUCCIÓN)
│   ├── HISTORIAL.md              ← Este archivo
│   ├── Icono Full - NexCode97.png
│   ├── Letrero.png
│   ├── Logos + Letreros.cdr
│   ├── nexcode-colores.html      ← Preview de opciones de color (referencia)
│   ├── nexcode97-logo.svg        ← Logo en SVG (versión anterior)
│   └── nexcode97-story.html      ← Flyer historia Instagram (borrador)
│
├── app-ntrl/                     ← Código fuente de APP NTRL
│
└── appntrl-landing.html          ← Landing page de APP NTRL ✅ LISTA
```

**Estructura planeada del sitio NexCode97:**
```
NexCode97/
├── index.html          ← Sitio principal con portafolio
└── appntrl/
    └── index.html      ← Landing de APP NTRL (ya existe como appntrl-landing.html)
```

---

## Plan del Sitio Web NexCode97

### Secciones de `index.html` (sitio principal):
1. **Navbar** — Logo + botón contactar
2. **Hero** — Headline, tagline, CTA
3. **Servicios** — 7 servicios en grid con íconos
4. **Portafolio** — Cards de proyectos (APP NTRL + futuros)
   - Al hacer clic en APP NTRL → va a la landing de APP NTRL
5. **Por qué NexCode97** — Diferenciadores
6. **Contacto** — WhatsApp, correo, Instagram
7. **Footer**

### Páginas adicionales:
- `appntrl/index.html` — Landing page de APP NTRL (ya construida)

---

## Historial de Cambios

### 2026-04-10
- ✅ Definido nombre de empresa: **NexCode97**
- ✅ Definidos colores corporativos: violeta `#7c3aed` + cian `#06b6d4` (Opción E)
- ✅ Definido tagline: "Cada negocio merece su propio sistema."
- ✅ Definidos datos de contacto: WhatsApp, correo, Instagram
- ✅ Logo creado en CorelDRAW por el usuario (3 versiones)
- ✅ Landing page de APP NTRL construida (`appntrl-landing.html`)
- ✅ Flyer historia Instagram creado como borrador (`nexcode97-story.html`)
- ⏳ Sitio principal NexCode97 — **pendiente construir**
- ⏳ Flyer Instagram — **pendiente refinar/exportar**
- ⏳ Videos de APP NTRL — **pendiente grabar** (PC, tablet, móvil)
- ⏳ Publicación en Vercel — **pendiente**

---

## Historial de Cambios (continuación)

### 2026-05-04
- ✅ Agregado VeloClub al portafolio — SaaS de gestión para clubs de ciclismo
- ✅ Actualizado HISTORIAL.md con información de VeloClub

---

## Pendientes

- [ ] Grabar videos de APP NTRL (PC + tablet + móvil) y subirlos a YouTube
- [ ] Refinar flyer de historia Instagram
- [ ] Publicar sitio en Vercel (actualizar dirección)
- [ ] Crear cuenta de Instagram @nexcode97
- [ ] Landing page dedicada para VeloClub
- [ ] Definir precio y plan de monetización para VeloClub (SaaS)
