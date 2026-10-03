# Contexto de Sesión — NexCode97 (Guardado para continuar)

> Fecha: 2026-06-02 · Modelo: Opus
> Esta sesión cubrió varios proyectos. Lee esto al iniciar una sesión nueva.

---

## 📍 ESTADO ACTUAL — Resumen rápido

Dos frentes, relacionados con el repo **NexCode97** (`C:\Users\nexco\Documents\GitHub\NexCode97`):

1. **Sitio principal**: app Next.js en `web/` (Vercel)
2. **CRM**: repo aparte `NexCode97/crm` (Railway), servido en `/crm`

**Repo remoto:** `github.com/NexCode97/NexCode97.git` (se renombró desde NexCode97-Tech)
**Dominio producción:** `nexcode97.com`
**Deploy:** Vercel (auto-deploy en push a main)

---

## 🔑 PANEL / CRM — estado

- El panel `admin/` se eliminó (2026-10-02). El panel de NexCode97 es ahora el CRM en `www.nexcode97.com/crm`
  (repo `NexCode97/crm`, desplegado en Railway con su base PostgreSQL)

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
