
/* ── Llamadas por WhatsApp (25-sep): conectar la línea desde el CRM, activar llamadas por línea, recibir y hacer llamadas.
   Reglas de Meta que se respetan aquí: la línea debe estar en la API oficial, la cuenta con límite de 2.000 y método de pago;
   para llamar al cliente hace falta su permiso (1 solicitud al día y 2 por semana, dura 7 días; 4 llamadas seguidas sin
   contestar lo quitan); las entrantes se contestan en menos de 30 segundos o van al buzón. Meta graba y transcribe si se pide
   en cada llamada, con un aviso hablado del propósito; el CRM guarda la copia porque Meta la borra a los 7 días.
   26-sep: conectar una línea es real (GET /crm/lineas/disponibles y POST /crm/lineas). Las llamadas no
   se activan en esta etapa: una línea solo llama cuando el API la marca con `llamadas: true` (Meta las activó y el CRM tiene
   con qué llamar). Mientras tanto el botón de llamar dice el motivo real. ── */
document.head.insertAdjacentHTML('beforeend', `<style>
.ll-sec{display:grid;gap:10px;border-top:1px solid var(--line2);padding-top:12px}
.ll-sec > .row2 > span > b{font-size:13px;font-weight:600}
.ll-req{display:grid;gap:8px}
.ll-ok{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--green-ink)}
.ll-ok svg{width:14px;height:14px}
.ll-no{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--red-ink)}
.ll-med{font-size:11.5px;font-weight:600;color:var(--amber-ink);background:var(--amber-soft);border-radius:6px;padding:2px 8px}
.ll-baja{font-size:11.5px;font-weight:600;color:var(--red-ink);background:var(--red-soft);border-radius:6px;padding:2px 8px}
.ll-nota{font-size:12px;color:var(--amber-ink);background:var(--amber-soft);border:1px solid var(--amber-line);border-radius:9px;padding:8px 10px}
.cx-list{display:grid;gap:8px;margin:4px 0 10px}
.cx-op{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#fff}
.cx-op[aria-checked="true"]{border-color:var(--blue);background:var(--blue-soft)}
.cx-op:disabled{opacity:.55;cursor:default}
.cx-op .rd{width:16px;height:16px;border-radius:50%;border:2px solid var(--ink4);flex:none}
.cx-op[aria-checked="true"] .rd{border-color:var(--blue);box-shadow:inset 0 0 0 3px #fff;background:var(--blue)}
.cx-op b{display:block;font-size:14px;font-weight:400;color:var(--ink)}
.cx-lnk{align-self:flex-start;justify-self:start;text-align:left;border:0;background:none;padding:0;color:var(--blue-ink);font:inherit;font-size:13px;font-weight:500;cursor:pointer}
.cx-otra{display:grid;gap:10px;padding:14px;border:1px solid var(--line2);border-radius:12px;background:var(--bg2)}
.cx-op small{font-size:12px;color:var(--ink3)}
.cx-f{display:grid;gap:10px;margin:6px 0 12px}
.cx-f label{display:grid;gap:5px;font-size:12.5px;font-weight:600;color:var(--ink2)}
.cx-f input{border:1px solid var(--line);border-radius:9px;padding:8px 10px;font:inherit;font-size:13px;font-weight:400}
.cx-f small{font-weight:400;color:var(--ink3);font-size:12px}
.cx-prog{display:grid;gap:8px;margin:8px 0 12px;font-size:13px}
.cx-prog div{display:flex;align-items:center;gap:8px;color:var(--ink3)}
.cx-prog div.ok{color:var(--ink)}
.cx-prog div.mal{color:var(--red-ink)}
.cx-prog div svg{width:16px;height:16px}
.cx-prog div.ok svg{color:var(--green-ink)}
.cx-pasos{display:flex;gap:6px;font-size:12px;color:var(--ink3);margin-bottom:8px}
.cx-pasos span.on{color:var(--blue-ink);font-weight:600}
.cx-op.cx-grande{align-items:flex-start;padding:14px}
.cx-op.cx-grande > svg{width:22px;height:22px;flex:none;color:var(--blue-ink);margin-top:1px}
.cx-dato{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:9px;padding:6px 6px 6px 10px;margin:6px 0;font-size:12.5px}
.cx-dato span{color:var(--ink3);flex:none}
.cx-dato code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
.cx-dato .btn.ic{width:28px;height:28px;padding:0}
.cx-ayuda{font-size:12.5px;color:var(--ink2);margin:0 0 10px}
.cx-ayuda summary{cursor:pointer;color:var(--blue-ink);font-weight:600}
.cx-ayuda ol{margin:8px 0 0;padding-left:18px;display:grid;gap:4px}
.cx-fila{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px}
.cx-fila b{font-size:14px;font-weight:600}
.cx-acc{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:10px}
.cx-acc > span:first-child{margin-right:auto}
.callrec{align-self:center;width:min(440px,100%);border:1px solid var(--line);border-radius:12px;background:#fff;padding:12px 14px;font-size:13px;display:grid;gap:8px}
.callrec .t{display:flex;align-items:center;gap:7px;font-weight:600}
.callrec .t svg{width:15px;height:15px;color:var(--green-ink)}
.callrec.perdida .t svg{color:var(--red-ink)}
.callrec .r{display:flex;justify-content:space-between;gap:10px;color:var(--ink2)}
.callrec .r span:last-child{color:var(--ink);font-variant-numeric:tabular-nums;text-align:right}
.callrec .wave{position:relative;overflow:hidden}
.callrec .wave i{position:absolute;inset:0 auto 0 0;width:0;background:rgba(31,147,255,.25);transition:width .25s linear}
.callrec .pl{cursor:pointer}
.callrec details summary{cursor:pointer;color:var(--blue-ink);font-size:12.5px;font-weight:500}
.callrec details p{margin:6px 0 0;font-size:12.5px;color:var(--ink2);line-height:1.5}
.callrec details p b{font-weight:600;color:var(--ink)}
.callrec .ft{font-size:11px;color:var(--ink4);text-align:right}
</style>`);

// Ajustes de llamadas (clave `llam`). `lineas` tiene los de cada línea: {on, icono, eq, buzon, grabar, desde}.
const LLAM = {
  lineas: {},
  saludo:'Hola, gracias por llamar. En este momento no podemos contestar. Déjanos tu mensaje y te devolvemos la llamada.',
  proposito:'mejorar la atención y dejar constancia de lo que acordemos',
};
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const lineaDe = id => LINEAS.find(l => l.id === id) || {id, n: id ? 'Línea desconectada' : 'Sin línea', tel: ''};
// Límite de mensajería según Meta (TIER_250, TIER_2K, TIER_UNLIMITED o un número) en número; null si Meta no lo dio.
function limiteNum(v){
  if (v == null || v === '') return null;
  if (typeof v === 'number') return v;
  const s = String(v).toUpperCase();
  if (/UNLIMITED|ILIMITADO/.test(s)) return Infinity;
  const m = s.match(/(\d+(?:[.,]\d+)?)\s*([KM])?/); if (!m) return null;
  return parseFloat(m[1].replace(',', '.')) * (m[2] === 'M' ? 1e6 : m[2] === 'K' ? 1e3 : 1);
}
const fmtLimite = n => n === Infinity ? 'Sin límite' : n.toLocaleString('es-CO');
const CALIDAD_META = {GREEN:['Alta', 'ok2'], HIGH:['Alta', 'ok2'], YELLOW:['Media', 'll-med'], MEDIUM:['Media', 'll-med'], RED:['Baja', 'll-baja'], LOW:['Baja', 'll-baja']};
const calidadHTML = v => { const c = CALIDAD_META[String(v || '').toUpperCase()]; return c ? `<span class="${c[1]}">${c[0]}</span>` : '<span class="muted">Sin dato de Meta</span>'; };
const ESTADO_LINEA = {conectada:['Conectada', 'ok2'], error:['Con error', 'll-baja'], desconectada:['Desconectada', 'll-baja']};
const estadoLineaHTML = l => { const e = ESTADO_LINEA[l.estado] || [l.estado || 'Sin estado', 'pill']; return `<span class="${e[1]}" style="margin-left:auto">${esc(e[0])}</span>`; };
// Meta activó las llamadas en la línea y el CRM tiene con qué llamar: lo dice el API en la línea. En esta etapa no pasa.
const metaLlamadas = l => !!(l && l.llamadas === true);
const llamadasActivas = id => metaLlamadas(LINEAS.find(l => l.id === id)) && !!(LLAM.lineas[id] || {}).on;
// Cada línea tiene su fila en CFG.lineas (mensajes) y en LLAM.lineas (llamadas); si falta, se crea con los valores de siempre.
function ajLinea(id, eq = 'Ventas'){
  if (!CFG.lineas.some(x => x.id === id)) CFG.lineas.push({id, eq, recepcion:false});
  if (!LLAM.lineas[id]) LLAM.lineas[id] = {on:false, icono:true, eq, buzon:true, grabar:true};
}
const horaCfg = s => { const m = String(s || '').match(/^(\d{1,2}):(\d{2})$/); return m ? fmtMin(+m[1] * 60 + +m[2]) : String(s || ''); };

/* Cuentas de Meta conectadas (26-sep): cómo se conectó cada una, si Meta ya manda los avisos, revisar y desconectar */
function cajaCuentasMeta(){
  const cs = conexionesWa(); if (!cs.length) return '';
  return `<div class="box2"><h4>${I('lock')}Cuentas de Meta conectadas</h4>${cs.map(c => {
    const est = c.estado === 'conectada' ? `<span class="ll-ok">${I('check')}Conectada</span>` : c.estado === 'error' ? `<span class="ll-no">${I('x')}Con un problema</span>` : `<span class="muted">Pendiente</span>`;
    const avisos = c.ultimoAviso ? `El último llegó ${cuandoKB(c.ultimoAviso)}` : (c.verificado || c.modo === 'meta') ? 'Meta ya puede mandarlos; todavía no ha llegado ninguno' : 'Meta todavía no ha verificado la dirección de los avisos';
    const manualPendiente = c.modo === 'manual' && c.webhookUrl && (c.estado === 'error' || (!c.verificado && !c.ultimoAviso && c.webhookApp !== 'otro'));
    return `<div class="ll-sec"><div class="cx-fila"><b>${esc(cxNombre(c))}</b>${est}</div>
      ${fila('Cómo se conectó', '', `<span class="muted">${c.modo === 'meta' ? 'Con el botón de Meta' : `Con los datos de la app ${esc(c.appId || '')}`}</span>`)}
      ${fila('Cuentas de WhatsApp y líneas', '', `<span class="muted">${c.cuentas} ${c.cuentas === 1 ? 'cuenta' : 'cuentas'} · ${c.lineas} ${c.lineas === 1 ? 'línea' : 'líneas'} en el CRM</span>`)}
      ${fila('Avisos de mensajes', avisos, '')}
      ${c.error ? `<div class="ll-nota">${esc(c.error)}</div>` : ''}
      ${manualPendiente ? `<p class="muted" style="margin:6px 0 0">Si Meta no los manda solo, en tu app de Meta ve a WhatsApp, Configuración, Webhook: pega esta dirección y este código y suscríbete al campo «messages».</p>${datoCopiable('Dirección', c.webhookUrl)}${datoCopiable('Código de verificación', c.verifyToken || '')}` : ''}
      <div class="cx-acc"><button type="button" class="btn" data-cxm-revisar="${c.id}">${I('swap')}Revisar</button><button type="button" class="btn" data-cxm-quitar="${c.id}">${I('x')}Desconectar</button></div></div>`;
  }).join('')}</div>`;
}
/* El botón «Conectar con Facebook» usa la app de Meta de la plataforma: la configura su administrador, una sola vez. */
st.provCfg = null;
function cajaProveedor(){
  if (!CRM_YO.operador) return '';
  const p = st.provCfg;
  if (!p) { crmApi('GET', '/crm/conexiones/proveedor').then(d => { st.provCfg = d; if (st.pagina === 'cfg-lineas') render(); }).catch(() => {}); return ''; }
  return `<div class="box2"><h4>${I('fb')}Botón «Conectar con Facebook» de la plataforma</h4>
    <p class="muted" style="margin:0 0 8px">Lo ven todas las empresas del CRM al conectar WhatsApp, Instagram y Messenger. Usa una app de Meta de la plataforma aprobada como proveedor tecnológico, con Facebook Login for Business: una configuración para el registro integrado de WhatsApp y otra para páginas. Solo lo ve el administrador de la plataforma.</p>
    <div class="cx-f"><label>Identificador de la app (App ID)<input id="pv-app" value="${esc(p.appId || '')}" inputmode="numeric" autocomplete="off"></label>
      <label>Configuración de WhatsApp (config_id)<input id="pv-cfg" value="${esc(p.configId || '')}" inputmode="numeric" autocomplete="off"></label>
      <label>Configuración de páginas, para Instagram y Messenger (config_id)<input id="pv-cfgp" value="${esc(p.configPaginas || '')}" inputmode="numeric" autocomplete="off"></label>
      <label>Clave secreta de la app<input id="pv-sec" type="password" value="" autocomplete="new-password" placeholder="${p.conClave ? 'Guardada: déjala vacía para no cambiarla' : '32 letras y números'}"></label></div>
    ${p.verifyToken ? `<p class="muted" style="margin:0">En esa app, WhatsApp, Configuración, Webhook: pega esta dirección y este código y suscríbete a «messages», «message_template_status_update» y «phone_number_quality_update».</p>${datoCopiable('Dirección', p.webhookUrl)}${datoCopiable('Código de verificación', p.verifyToken)}
      <p class="muted" style="margin:0">Y en Webhooks, en «Page» y en «Instagram», esta otra dirección con el mismo código, suscrita a «messages» y «messaging_postbacks»; en «Page» también «message_deliveries», «message_reads» y «message_echoes», y en «Instagram», «messaging_seen».</p>${datoCopiable('Dirección de páginas', p.webhookPaginas || '')}` : ''}
    <div class="cx-acc"><span class="${p.listo || p.listoPaginas ? 'll-ok' : 'muted'}">${p.listo && p.listoPaginas ? `${I('check')}Activo` : p.listo ? `${I('check')}Activo para WhatsApp` : p.listoPaginas ? `${I('check')}Activo para Instagram y Messenger` : 'Sin configurar'}</span><button type="button" class="btn pri" data-pv-guardar="1">${I('check')}Guardar</button></div></div>`;
}

/* Página «Líneas de WhatsApp» */
function paginaLineas(){
  const volver = `<button type="button" class="volver" data-ir="ajustes-crm">${I('back')}Ajustes del CRM</button>`;
  const ok = t => `<span class="ll-ok">${I('check')}${t}</span>`, no = t => `<span class="ll-no">${I('x')}${t}</span>`;
  const lims = LINEAS.map(l => limiteNum(l.limite)).filter(n => n != null), lim = lims.length ? Math.max(...lims) : null;
  // Pintar no escribe ajustes: el visitante de solo lectura entraba en un bucle de pintar y revertir.
  if (!crmSoloLectura()) LINEAS.forEach(l => ajLinea(l.id));
  const A = CFG.recepcion || {}, noche = A.desde && A.hasta ? `De ${horaCfg(A.desde)} a ${horaCfg(A.hasta)}` : '';
  return `<div class="ajw ancho">${volver}
    <div class="pg-h"><div><h2>Líneas de WhatsApp</h2><p class="sub">Las líneas conectadas por la API oficial de Meta. Aquí se conecta cada línea, se elige su equipo y se activan sus llamadas.</p></div><button type="button" class="btn pri" data-ll-conectar="1">${I('plus')}Conectar línea</button></div>
    <div class="cfg">
      ${cajaCuentasMeta()}
      <div class="box2"><h4>${I('lock')}Requisitos de Meta para las llamadas</h4>
        <div class="ll-req">${fila('Límite de mensajería de la cuenta', 'Meta pide al menos 2.000 para activar llamadas', lim == null ? '<span class="muted">Sin dato de Meta</span>' : lim >= 2000 ? ok(fmtLimite(lim)) : no(fmtLimite(lim)))}
        ${fila('Método de pago en la cuenta de WhatsApp', 'Sin él no se pueden hacer llamadas. Se revisa en el administrador de WhatsApp de Meta', '<span class="muted">Sin confirmar</span>')}</div></div>
      ${LINEAS.length ? LINEAS.map(l => { const i = CFG.lineas.findIndex(x => x.id === l.id), x = CFG.lineas[i] || {id:l.id, eq:'Ventas', recepcion:false}, c = LLAM.lineas[l.id] || {on:false, icono:true, eq:'Ventas', buzon:true, grabar:true}, meta = metaLlamadas(l), on = meta && !!c.on;
        const nueva = on && c.desde && Date.now() - Date.parse(c.desde) < 7 * 864e5;
        return `<div class="box2"><h4>${I('wa')}${esc(l.n)} · ${esc(l.tel)}${estadoLineaHTML(l)}</h4>
        ${fila('Equipo que la atiende', '', ddSel('data-cfg-lineq', EQUIPOS.map(e => [`${i}|${e.n}`, e.n]), `${i}|${x.eq}`))}
        ${fila('El agente IA responde de noche', noche, sw('linea-recepcion-' + i, x.recepcion))}
        ${fila('Calidad según Meta', 'Si baja, Meta limita cuántos mensajes se pueden enviar', calidadHTML(l.calidad))}
        <div class="ll-sec">
          ${fila('<b>Llamadas por WhatsApp</b>', !meta ? 'Meta todavía no las tiene activadas en esta línea: nadie ve el botón de llamar' : on ? 'Los clientes pueden llamar a esta línea y los asesores pueden llamarlos' : 'Apagadas: nadie ve el botón de llamar y no se puede llamar desde esta línea', `<button type="button" class="tg" role="switch" data-ll-on="${l.id}" aria-checked="${on}" aria-label="Llamadas por WhatsApp en ${esc(l.n)}" ${meta && lim != null && lim >= 2000 ? '' : 'disabled'}></button>`)}
          ${nueva ? `<div class="ll-nota">Activadas hace poco. Meta puede tardar hasta 7 días en mostrar el botón de llamar en los teléfonos.</div>` : ''}
          ${on ? `${fila('Mostrar el botón de llamar en WhatsApp', 'Si se oculta, el cliente solo puede llamar desde un botón que le mande el asesor', `<button type="button" class="tg" role="switch" data-ll-tg="${l.id}|icono" aria-checked="${c.icono}" aria-label="Mostrar el botón de llamar"></button>`)}
          ${fila('Quién contesta', 'Suena a los asesores conectados de ese equipo y el primero que contesta se la queda', ddSel('data-ll-eq', EQUIPOS.map(e => [`${l.id}|${e.n}`, e.n]), `${l.id}|${c.eq}`))}
          ${fila('Horario para recibir llamadas', 'El mismo horario de atención del CRM', `<button type="button" class="btn" data-ir="cfg-horario">Cambiar</button>`)}
          ${fila('Horario para llamar a clientes', 'Lunes a viernes de 7 a. m. a 7 p. m. y sábados de 8 a. m. a 3 p. m.; nunca domingos ni festivos. Lo fija la Ley 2300 y no se puede cambiar', `<span class="ll-ok">${I('lock')}Fijo por ley</span>`)}
          ${fila('Buzón de voz si nadie contesta en 30 segundos', 'El mensaje de voz llega a la conversación, transcrito', `<button type="button" class="tg" role="switch" data-ll-tg="${l.id}|buzon" aria-checked="${c.buzon}" aria-label="Buzón de voz"></button>`)}
          ${fila('Grabar y transcribir las llamadas', 'Solo si el contacto autorizó sus datos y, si es menor de edad, su representante legal', `<button type="button" class="tg" role="switch" data-ll-tg="${l.id}|grabar" aria-checked="${c.grabar}" aria-label="Grabar y transcribir"></button>`)}` : ''}
        </div></div>`; }).join('')
        : `<div class="box2"><div class="vacio">${I('wa')}<b>Ninguna línea conectada</b><p>Conecta la cuenta de WhatsApp Business de tu empresa y elige sus números.</p></div></div>`}
      <div class="box2">${fila('Grabaciones, buzón de voz y horario', 'Se configuran para todas las líneas en la página Llamadas', `<button type="button" class="btn" data-ir="cfg-llamadas">Abrir</button>`)}</div>
      ${cajaProveedor()}
    </div></div>`;
}
const paginaCfgBase = paginaCfg;
paginaCfg = function(k){ return k === 'lineas' ? paginaLineas() : paginaCfgBase(k); };

document.getElementById('page').addEventListener('click', e => {
  if (st.pagina !== 'cfg-lineas') return; const t = e.target;
  if (t.closest('[data-ll-conectar]')) { abrirConexion('Ventas'); return; }
  const cpy = t.closest('[data-cx-copiar]'); if (cpy) { copiar(cpy.dataset.cxCopiar, 'Copiado'); return; }
  const rv = t.closest('[data-cxm-revisar]'); if (rv && !rv.disabled) { rv.disabled = true;
    crmApi('POST', `/crm/conexiones/${rv.dataset.cxmRevisar}/revisar`).then(c => { mezclarConexion(c); toast(c.estado === 'conectada' ? 'La cuenta de Meta está bien' : 'La cuenta de Meta tiene un problema'); render(); })
      .catch(err => { toast(err.message || 'No se pudo revisar'); rv.disabled = false; }); return; }
  const qt = t.closest('[data-cxm-quitar]'); if (qt) { const c = CONEXIONES.find(x => x.id === qt.dataset.cxmQuitar); if (!c) return;
    abrirDialogo(`<h3>Desconectar ${esc(cxNombre(c))}</h3><p>Sus ${c.lineas} ${c.lineas === 1 ? 'línea sale' : 'líneas salen'} del CRM y dejan de llegar sus mensajes. Las conversaciones que ya hay se quedan.</p><div class="ft2"><button type="button" class="btn" data-cerrar-dlg="1">Cancelar</button><button type="button" class="btn pri" style="background:#dc2626;border-color:#dc2626" data-cxm-quitarok="${c.id}">${I('x')}Desconectar</button></div>`); return; }
  if (t.closest('[data-pv-guardar]')) { const v = id => (document.getElementById(id) || {}).value || '';
    crmApi('PUT', '/crm/conexiones/proveedor', {appId:v('pv-app').trim(), configId:v('pv-cfg').trim(), configPaginas:v('pv-cfgp').trim(), appSecret:v('pv-sec').trim()})
      .then(p => { st.provCfg = p; render(); toast('Botón de Meta guardado'); }).catch(err => toast(err.message || 'No se pudo guardar')); return; }
  const on = t.closest('[data-ll-on]'); if (on && !on.disabled) { const id = on.dataset.llOn, c = LLAM.lineas[id]; c.on = !c.on; c.desde = c.on ? new Date().toISOString() : null; render(); toast(c.on ? 'Llamadas activadas en ' + lineaDe(id).n : 'Llamadas apagadas en ' + lineaDe(id).n); return; }
  const tg = t.closest('[data-ll-tg]'); if (tg) { const [id, k] = tg.dataset.llTg.split('|'); LLAM.lineas[id][k] = !LLAM.lineas[id][k]; render(); toast(LLAM.lineas[id][k] ? 'Activado' : 'Apagado'); return; }
  const eq = t.closest('[data-ll-eq]'); if (eq) { const [id, n] = eq.dataset.llEq.split('|'); LLAM.lineas[id].eq = n; render(); toast(`Las llamadas de ${lineaDe(id).n} suenan a ${n}`); return; }
});
document.getElementById('page').addEventListener('input', e => { if (['cfg-lineas', 'cfg-llamadas'].includes(st.pagina) && e.target.dataset.llIn === 'proposito') { const c = document.getElementById('ll-prop-c'); if (c) c.textContent = `${e.target.value.length}/250`; } });
document.getElementById('page').addEventListener('change', e => {
  if (!['cfg-lineas', 'cfg-llamadas'].includes(st.pagina) || !e.target.dataset.llIn) return;
  LLAM[e.target.dataset.llIn] = e.target.value.trim() || LLAM[e.target.dataset.llIn]; toast('Guardado');
});

/* Conectar línea (26-sep, CRM independiente): 1. la cuenta de Meta de la empresa, con el botón de Meta o con los datos
   de su app (POST /crm/conexiones/whatsapp…); 2. el número; 3. nombre, equipo y PIN; 4. registrarlo (POST /crm/lineas). */
// Cuentas de Meta conectadas del espacio (GET /crm/inicio `conexiones` y el evento `conexiones`).
const CONEXIONES = [];
const conexionesWa = () => CONEXIONES.filter(c => c.tipo === 'whatsapp');
const cxUsable = c => c && c.estado !== 'desconectada';
function abrirConexion(eq){
  const usables = conexionesWa().filter(cxUsable);
  const x = st.cx = {paso:1, conexionId:usables.length === 1 ? usables[0].id : (usables[0] || {}).id || null, nueva:!usables.length, manual:false,
    app:{appId:'', appSecret:'', token:'', wabaId:''}, pideWaba:false, enviandoCx:false, errorCx:'', avisoCx:null, prov:null, fbCargando:false,
    cargando:false, error:'', configurado:true, numeros:[], sel:null, preferido:null, nombre:'', eq, pin:'', llamadas:true, estado:'', linea:null};
  crmApi('GET', '/crm/conexiones/proveedor').then(p => { x.prov = p; }).catch(() => { x.prov = {listo:false}; })
    .finally(() => { if (st.cx === x && x.paso === 1 && !document.getElementById('ov-x').hidden) pintarConexion(); });
  pintarConexion();
}
function buscarNumeros(x){
  x.cargando = true; x.error = '';
  crmApi('GET', '/crm/lineas/disponibles?conexionId=' + encodeURIComponent(x.conexionId || ''))
    .then(d => {
      x.configurado = !!(d && d.configurado); x.numeros = ((d && d.numeros) || []).filter(n => !LINEAS.some(l => l.phoneNumberId === n.phoneNumberId));
      // Con el botón de Meta ya se sabe qué número eligió: se salta la lista.
      if (x.preferido && x.numeros.some(n => n.phoneNumberId === x.preferido && n.ok)) { x.sel = x.preferido; x.preferido = null; if (x.paso === 2) x.paso = 3; }
    })
    .catch(err => { x.error = err.message || 'No respondió el servidor'; })
    .finally(() => { x.cargando = false; if (st.cx === x && (x.paso === 2 || x.paso === 3) && !document.getElementById('ov-x').hidden) pintarConexion(); });
}
const numeroSel = x => x.numeros.find(n => n.phoneNumberId === x.sel) || {};
const cxNombre = c => c.modo === 'meta' ? 'WhatsApp conectado con Meta' : c.nombre;
const cxDetalle = c => [c.modo === 'meta' ? 'Con el botón de Meta' : `App de Meta ${c.appId || ''}`.trim(), `${c.cuentas} ${c.cuentas === 1 ? 'cuenta' : 'cuentas'} de WhatsApp`, c.lineas ? `${c.lineas} ${c.lineas === 1 ? 'línea' : 'líneas'} en el CRM` : ''].filter(Boolean).join(' · ');
const datoCopiable = (etq, v) => `<div class="cx-dato"><span>${etq}</span><code>${esc(v)}</code><button type="button" class="btn ic" data-cx-copiar="${esc(v)}" aria-label="Copiar ${etq}">${I('share')}</button></div>`;
function pasoCuenta(x){
  const usables = conexionesWa().filter(cxUsable);
  if (!x.nueva && usables.length) return `<p>Elige la cuenta de Meta del número que vas a conectar.</p>
    <div class="cx-list">${usables.map(c => `<button type="button" class="cx-op" role="radio" aria-checked="${x.conexionId === c.id}" data-cx-cuenta="${c.id}"><span class="rd"></span><span><b>${esc(cxNombre(c))}</b><small>${esc(cxDetalle(c))}${c.estado === 'error' ? ' · con un problema: revísala en Líneas de WhatsApp' : ''}</small></span></button>`).join('')}
      <button type="button" class="cx-op" data-cx-nueva="1"><span class="rd"></span><span><b>Conectar otra cuenta de Meta</b><small>Otra cuenta de WhatsApp Business o la de otra app</small></span></button></div>`;
  if (x.avisoCx) { const c = x.avisoCx; return `<div class="ll-nota">${esc(c.error || 'Las claves están bien, pero falta configurar el aviso de mensajes.')}</div>
    <p>Configúralo a mano en tu app de Meta: en WhatsApp, Configuración, Webhook, pega esta dirección y este código, y suscríbete al campo «messages».</p>
    ${datoCopiable('Dirección', c.webhookUrl || '')}${datoCopiable('Código de verificación', c.verifyToken || '')}
    <p class="muted">Cuando Meta la verifique, los mensajes empiezan a llegar. Mientras tanto ya puedes elegir el número.</p>`; }
  const prov = x.prov, fbListo = prov && prov.listo;
  if (!x.manual) return `<p>Elige cómo conectar la cuenta de WhatsApp Business de tu empresa.</p>
    <div class="cx-list">
      <button type="button" class="opc" data-cx-fb="1" ${fbListo && !x.fbCargando ? '' : 'disabled'}><span class="marca fb">${LOGO.fb}</span><span class="tx"><b>${x.fbCargando ? 'Abriendo Facebook…' : 'Continuar con Facebook'}${fbListo ? '<span class="etq-rec">Recomendado</span>' : prov == null ? '' : '<span class="etq-pronto">No disponible todavía</span>'}</b><small>${prov == null ? 'Revisando…' : fbListo ? 'Inicias sesión con Facebook, eliges o creas el número y listo.' : 'Se activa cuando Meta apruebe este CRM. Mientras tanto, usa los datos de tu app.'}</small></span>${fbListo ? I('chev', 'i ch') : ''}</button>
      <button type="button" class="opc" data-cx-manual="1"><span class="marca neutra">${LOGO.llave}</span><span class="tx"><b>Con los datos de tu app de Meta</b><small>Si ya tienes una app en developers.facebook.com: pegas su identificador, su clave secreta y un token.</small></span>${I('chev', 'i ch')}</button>
    </div>${x.errorCx ? `<div class="ll-nota">${esc(x.errorCx)}</div>` : ''}`;
  const a = x.app;
  return `<div class="cx-f">
      <label>Identificador de la app (App ID)<input id="cx-app" value="${esc(a.appId)}" inputmode="numeric" autocomplete="off" placeholder="Ej. 1234567890123456"></label>
      <label>Clave secreta de la app<input id="cx-sec" type="password" value="${esc(a.appSecret)}" autocomplete="new-password" placeholder="32 letras y números"></label>
      <label>Token del usuario del sistema<input id="cx-tok" type="password" value="${esc(a.token)}" autocomplete="new-password" placeholder="Empieza por EAA…"><small>Se guarda cifrado y no se vuelve a mostrar.</small></label>
      ${x.pideWaba ? `<label>Identificador de la cuenta de WhatsApp Business<input id="cx-waba" value="${esc(a.wabaId || '')}" inputmode="numeric" autocomplete="off" placeholder="Ej. 1234567890123456"><small>Está en tu app de Meta, en WhatsApp, Configuración de la API, junto al número.</small></label>` : ''}</div>
    <details class="cx-ayuda"><summary>Cómo conseguir estos datos</summary><ol>
      <li>En developers.facebook.com crea una app de tipo Negocio (o usa la que ya tienes) y agrégale el producto WhatsApp.</li>
      <li>En Configuración de la app, Básica, copia el identificador de la app y la clave secreta.</li>
      <li>En la configuración de tu negocio en Meta, Usuarios del sistema: crea uno con rol de administrador, asígnale la app y la cuenta de WhatsApp, y genera un token sin vencimiento con los permisos whatsapp_business_management y whatsapp_business_messaging.</li>
      <li>Pega los tres datos aquí. El CRM configura el resto solo.</li></ol></details>
    ${x.errorCx ? `<div class="ll-nota">${esc(x.errorCx)}</div>` : ''}`;
}
function pintarConexion(){
  const x = st.cx, pasos = pasosHTML(['Cuenta', 'Número', 'Datos', 'Conexión'], x.paso);
  const cab = (titulo, sub) => dlgCab('wa', LOGO.wa, titulo, sub);
  const tel = esc(numeroSel(x).tel || '');
  let h = '';
  if (x.paso === 1) {
    const usables = conexionesWa().filter(cxUsable), eligiendo = !x.nueva && usables.length;
    const a = x.app, listoManual = /^\d{5,30}$/.test(a.appId.trim()) && a.appSecret.trim().length >= 32 && a.token.trim().length >= 40 && (!x.pideWaba || /^\d{5,30}$/.test((a.wabaId || '').trim()));
    const pie = x.avisoCx ? `<button type="button" class="btn pri" data-cx-seguir="1">Elegir el número</button>`
      : eligiendo ? `<button type="button" class="btn pri" data-cx-ir="2" ${x.conexionId ? '' : 'disabled'}>Siguiente</button>`
      : x.manual ? `<button type="button" class="btn atras" data-cx-atrasman="1">Atrás</button><button type="button" class="btn pri" data-cx-conectarcuenta="1" ${listoManual && !x.enviandoCx ? '' : 'disabled'}>${x.enviandoCx ? 'Conectando…' : `${I('check')}Conectar cuenta`}</button>`
      : (usables.length ? `<button type="button" class="btn atras" data-cx-volvercuentas="1">Atrás</button>` : '');
    h = `${cab('Conectar WhatsApp', x.manual ? 'Pega los datos de tu app de Meta: el CRM configura el resto' : 'Conecta tu cuenta de WhatsApp Business y elige el número')}${pasos}${pasoCuenta(x)}<div class="ft2"><button type="button" class="btn" data-cerrar-dlg="1">Cancelar</button>${pie}</div>`;
  }
  if (x.paso === 2) {
    const cuerpo = x.cargando ? '<p class="muted">Buscando los números de la cuenta de Meta…</p>'
      : x.error ? `<p>No se pudo consultar la cuenta de Meta: ${esc(x.error)}</p><div><button type="button" class="btn" data-cx-reintentar="1">${I('swap')}Volver a intentar</button></div>`
      : !x.numeros.length ? '<p>Esa cuenta de WhatsApp no tiene números libres para conectar.</p><p class="muted">Primero se agrega el número en el administrador de WhatsApp de Meta y se verifica con el código que llega por SMS. Después aparece aquí.</p>'
      : `<p>Estos son los números de la cuenta de WhatsApp que todavía no están en el CRM.</p>
        <div class="cx-list">${x.numeros.map(d => `<button type="button" class="cx-op" role="radio" aria-checked="${x.sel === d.phoneNumberId}" data-cx-sel="${esc(d.phoneNumberId)}" ${d.ok ? '' : 'disabled'}><span class="rd"></span><span><b>${esc(d.tel)}</b><small>${d.nombre ? esc(d.nombre) + ' · ' : ''}${esc(d.estadoMeta || (d.ok ? 'Verificado' : 'Falta verificarlo'))}</small></span></button>`).join('')}</div>
        <p class="muted">¿No aparece el número? Primero se agrega en el administrador de WhatsApp de Meta y se verifica con el código que llega por SMS. Después aparece aquí.</p>`;
    // Otra cuenta de WhatsApp en la misma conexión (28-sep): Meta no siempre dice todas las cuentas del token.
    const cxc = CONEXIONES.find(c => c.id === x.conexionId);
    const otra = x.cargando || !cxc || cxc.modo !== 'manual' ? ''
      : x.otraWaba ? `<div class="cx-otra"><label class="fld">Identificador de la otra cuenta de WhatsApp Business<input id="cx-waba2" value="${esc(x.waba2 || '')}" inputmode="numeric" autocomplete="off" placeholder="Solo números"><small class="muted">Está en tu app de Meta, en WhatsApp, Configuración de la API, junto al número. La cuenta tiene que estar asignada al usuario del sistema con control total.</small></label>
          ${x.errorWaba ? `<div class="ll-nota">${esc(x.errorWaba)}</div>` : ''}<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn" data-cx-otra-no="1">Cancelar</button><button type="button" class="btn pri" data-cx-otra-ok="1" ${x.enviandoWaba || !/^\d{5,30}$/.test(x.waba2 || '') ? 'disabled' : ''}>${x.enviandoWaba ? 'Agregando…' : 'Agregar la cuenta'}</button></div></div>`
      : '<button type="button" class="cx-lnk" data-cx-otra="1">¿El número está en otra cuenta de WhatsApp Business? Agrégala</button>';
    h = `${cab('Elige el número', 'Los números de la cuenta que todavía no están en el CRM')}${pasos}${cuerpo}${otra}
    <div class="ft2"><button type="button" class="btn atras" data-cx-ir="1">Atrás</button><button type="button" class="btn pri" data-cx-ir="3" ${x.sel ? '' : 'disabled'}>Siguiente</button></div>`;
  }
  if (x.paso === 3) h = `${cab(`Conectar ${tel}`, 'Ponle nombre, elige el equipo que la atiende y confirma con el PIN')}${pasos}
    <div class="cx-f"><label>Nombre de la línea<input id="cx-n" value="${esc(x.nombre)}" placeholder="Ej. Soporte 1"></label>
      <div class="fld">Equipo que la atiende${ddSel('data-cx-eq', EQUIPOS.map(e => [e.n, e.n]), x.eq)}</div>
      <label>PIN de seguridad de 6 dígitos<input id="cx-pin" value="${esc(x.pin)}" inputmode="numeric" maxlength="6" placeholder="Ej. 482913"><small>Es la verificación en dos pasos del número en Meta. Se usa solo para registrarlo; el CRM no lo guarda.</small></label>
      ${fila('Activar llamadas por WhatsApp', 'Se prenden cuando Meta las active en la línea, con el botón de llamar visible y el horario de atención', `<button type="button" class="tg" role="switch" data-cx-llam="1" aria-checked="${x.llamadas}" aria-label="Activar llamadas"></button>`)}</div>
    <div class="ft2"><button type="button" class="btn atras" data-cx-ir="2">Atrás</button><button type="button" class="btn pri" data-cx-conectar="1" ${x.nombre.trim() && /^\d{6}$/.test(x.pin) ? '' : 'disabled'}>${I('check')}Conectar</button></div>`;
  if (x.paso === 4) {
    // Maqueta aprobada «CRM · línea conectada» (28-sep): tres estados centrados, sin la barra de pasos.
    const L = x.linea, lim = L ? limiteNum(L.limite) : null, n = numeroSel(x);
    const ic = {ok:`<span class="lc-t ok">${I('check')}</span>`, pend:`<span class="lc-t pend">${I('clock')}</span>`, gira:'<span class="lc-t gira"></span>', espera:'<span class="lc-t espera"></span>', mal:`<span class="lc-t mal">${I('x')}</span>`};
    const tarea = (icono, texto, gris) => `<span class="lc-tarea${gris ? ' gris' : ''}">${icono}${texto}</span>`;
    if (x.estado === 'listo') {
      const eqI = EQUIPOS.findIndex(e => e.n === x.eq), color = colorOk(colorDe(x.eq, eqI));
      const ne = String(n.nombreEstado || '').toUpperCase(), enRevision = ne === 'PENDING_REVIEW';
      const chipNombre = enRevision ? '<span class="lc-chip rev">En revisión</span>' : ne === 'DECLINED' ? '<span class="lc-chip mal">Rechazado</span>' : /APPROVED|AVAILABLE_WITHOUT_REVIEW/.test(ne) ? '<span class="lc-chip ok">Aprobado</span>' : '';
      const cal = CALIDAD_META[String(L.calidad || '').toUpperCase()];
      const filaDato = (t, d, der) => `<div class="lc-fila"><span class="lc-q"><b>${t}</b><small>${d}</small></span>${der}</div>`;
      const sinDato = '<span class="lc-chip">Sin dato todavía</span>';
      h = `<div class="lc-hero"><span class="lc-wa">${LOGO.wa}<span class="lc-badge">${I('check')}</span></span><h3>Línea conectada</h3><p>${esc(x.nombre.trim())} ya recibe y envía mensajes desde el CRM.</p></div>
        <div class="lc-card">
          <div class="lc-cab"><span class="lc-wa2">${LOGO.wa}</span><span class="lc-n"><b>${esc(x.nombre.trim())}</b><small>${tel}</small></span><span class="lc-eq"><i style="background:${color}"></i>${esc(x.eq)}</span></div>
          ${filaDato('Nombre visible', 'Lo que ven las personas en WhatsApp', `<span class="lc-v">${n.nombre ? `<span>${esc(n.nombre)}</span>` : ''}${chipNombre || (n.nombre ? '' : sinDato)}</span>`)}
          ${filaDato('Calidad', 'Meta la calcula con los primeros mensajes', cal ? `<span class="lc-chip ${cal[0] === 'Alta' ? 'ok' : cal[0] === 'Media' ? 'rev' : 'mal'}">${cal[0]}</span>` : sinDato)}
          ${filaDato('Límite diario', 'Conversaciones nuevas que puede abrir al día', lim == null ? sinDato : `<span class="lc-v"><span>${fmtLimite(lim)}</span></span>`)}
        </div>
        <div class="lc-tareas">${tarea(ic.ok, 'Número registrado en la API de Meta')}${tarea(ic.ok, `Los mensajes llegan a la bandeja del equipo ${esc(x.eq)}`)}${x.llamadas ? (metaLlamadas(L) ? tarea(ic.ok, 'Llamadas por WhatsApp activas') : tarea(ic.pend, 'Llamadas por WhatsApp: se prenden cuando Meta las active en la línea', true)) : ''}</div>
        <div class="lc-nota">${I('chat')}<span><b>Haz una prueba:</b> escríbele al ${tel} desde tu WhatsApp y contesta desde el CRM.${enRevision ? ' Mientras Meta aprueba el nombre visible, la persona ve solo el número.' : ''}</span></div>
        <div class="ft2"><button type="button" class="btn" data-lc-lineas="1">Ver en Líneas de WhatsApp</button><button type="button" class="btn pri" data-cerrar-dlg="1">Listo</button></div>`;
    } else if (x.estado === 'error') {
      h = `<div class="lc-hero"><span class="lc-mal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v5"/><path d="M12 16.5h.01"/><circle cx="12" cy="12" r="9"/></svg></span><h3>No se pudo conectar la línea</h3><p>Meta no dejó terminar la conexión de ${tel}.</p></div>
        <div class="lc-error"><b>Lo que respondió Meta</b><span>${esc(x.error)}</span></div>
        <div class="lc-card lc-tareas pad">${tarea(ic.mal, 'Registrar el número en la API de Meta')}${tarea(ic.espera, 'Recibir los mensajes en el CRM', true)}</div>
        <div class="ft2 entre"><button type="button" class="btn" data-cx-ir="3">${I('back')}Atrás</button><button type="button" class="btn pri" data-cx-conectar="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></svg>Volver a intentar</button></div>`;
    } else {
      h = `<div class="lc-hero"><span class="lc-gira"></span><h3>Conectando la línea</h3><p>${tel} · esto tarda unos segundos, no cierres la ventana.</p></div>
        <div class="lc-card lc-tareas pad">${tarea(ic.gira, 'Registrando el número en la API de Meta…')}${tarea(ic.espera, 'Recibir los mensajes en el CRM', true)}</div>
        <div class="ft2"><button type="button" class="btn pri" disabled>Listo</button></div>`;
    }
    abrirDialogo(h, `ancho dlg-lc${x.estado === 'listo' || x.estado === 'error' ? '' : ' cargando'}`);
    return;
  }
  abrirDialogo(h, 'ancho');
}
/* Paso 4 de «Conectar WhatsApp» (maqueta «CRM · línea conectada», 28-sep). */
document.head.insertAdjacentHTML('beforeend', `<style>
.dlg.dlg-lc{padding:32px 28px 0;gap:20px}
.dlg.dlg-lc.cargando .dlg-cerrar{display:none}
.dlg.dlg-lc .ft2{margin:2px -28px 0;padding:14px 28px}
.dlg.dlg-lc .ft2.entre{justify-content:space-between}
.dlg.dlg-lc .ft2 .btn{height:40px;font-size:13.5px}
.dlg.dlg-lc .ft2 .btn svg{width:16px;height:16px}
.lc-hero{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.dlg.dlg-lc .lc-hero h3{margin:8px 0 0;padding:0;font-size:22px;font-weight:600}
.dlg.dlg-lc .lc-hero p{margin:0;font-size:14px;line-height:1.5;color:#4b5563}
.lc-wa{position:relative;width:60px;height:60px;border-radius:18px;background:#25D366;color:#fff;display:grid;place-items:center}
.lc-wa > svg{width:32px;height:32px}
.lc-badge{position:absolute;right:-6px;bottom:-6px;width:26px;height:26px;border-radius:50%;background:#16a34a;border:3px solid #fff;display:grid;place-items:center;box-sizing:content-box}
.lc-badge svg{width:13px;height:13px;color:#fff;stroke-width:3.2}
.lc-mal{width:60px;height:60px;border-radius:50%;background:#fee2e2;color:#dc2626;display:grid;place-items:center}
.lc-mal svg{width:28px;height:28px}
.lc-gira{width:60px;height:60px;border-radius:50%;border:4px solid #d6e9ff;border-top-color:#1f93ff;box-sizing:border-box;animation:lc-gira .9s linear infinite}
@keyframes lc-gira{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.lc-gira,.lc-t.gira{animation-duration:2.4s}}
.lc-card{border:1px solid #eef1f5;border-radius:14px;background:#f8fafc;display:flex;flex-direction:column}
.lc-card.pad{padding:16px;gap:12px}
.lc-cab{display:flex;align-items:center;gap:12px;padding:14px 16px}
.lc-wa2{width:40px;height:40px;border-radius:12px;background:#fff;border:1px solid #eef1f5;color:#25D366;display:grid;place-items:center;flex:none;box-sizing:border-box}
.lc-wa2 svg{width:22px;height:22px}
.lc-n{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.lc-n b{font-size:15px;font-weight:600;color:var(--ink)}
.lc-n small{font-size:13px;color:#6b7280}
.lc-eq{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border:1px solid #e5e9f0;border-radius:999px;background:#fff;font-size:12.5px;color:var(--ink);white-space:nowrap}
.lc-eq i{width:9px;height:9px;border-radius:3px;display:inline-block}
.lc-fila{display:flex;align-items:center;gap:16px;padding:12px 16px;border-top:1px solid #eef1f5}
.lc-q{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.lc-q b{font-size:13px;font-weight:600;color:#374151}
.lc-q small{font-size:12px;color:#6b7280}
.lc-v{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:400;color:var(--ink)}
.lc-chip{font-size:11.5px;font-weight:500;color:#4b5563;background:#eef1f5;border-radius:999px;padding:3px 10px;white-space:nowrap}
.lc-chip.rev{color:#92400e;background:#fef3c7}
.lc-chip.ok{color:#166534;background:#dcfce7}
.lc-chip.mal{color:#991b1b;background:#fee2e2}
.lc-tareas{display:flex;flex-direction:column;gap:10px}
.lc-tarea{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--ink)}
.lc-tarea.gris{color:#4b5563}
.lc-card .lc-tarea.gris{color:#6b7280}
.lc-t{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;flex:none;box-sizing:border-box}
.lc-t svg{width:13px;height:13px;stroke-width:3}
.lc-t.ok{background:#dcfce7;color:#16a34a}
.lc-t.pend{background:#f1f5f9;color:#6b7280}
.lc-t.pend svg{stroke-width:2.2}
.lc-t.mal{background:#fee2e2;color:#dc2626}
.lc-t.mal svg{width:12px;height:12px}
.lc-t.gira{border:2.5px solid #d6e9ff;border-top-color:#1f93ff;animation:lc-gira .9s linear infinite}
.lc-t.espera{border:2px dashed #cbd5e1}
.lc-nota{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:12px;background:#eef6ff;color:#1e3a5f;font-size:13px;line-height:1.55}
.lc-nota > svg{width:18px;height:18px;flex:none;margin-top:1px;color:#1976d2}
.lc-nota b{font-weight:600}
.lc-error{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid #fecaca;border-radius:12px;background:#fef2f2}
.lc-error b{font-size:12px;font-weight:600;color:#991b1b}
.lc-error span{font-size:13.5px;line-height:1.55;color:#7f1d1d}
</style>`);
document.getElementById('ov-x').addEventListener('click', e => { if (!e.target.closest('[data-lc-lineas]')) return; cerrarDialogo(); st.pagina = 'cfg-lineas'; render(); });
document.getElementById('ov-x').addEventListener('click', e => {
  const x = st.cx; if (!x || x.paso !== 2) return;
  if (e.target.closest('[data-cx-otra]')) { x.otraWaba = true; x.errorWaba = ''; pintarConexion(); setTimeout(() => { const i = document.getElementById('cx-waba2'); if (i) i.focus(); }, 30); return; }
  if (e.target.closest('[data-cx-otra-no]')) { x.otraWaba = false; x.waba2 = ''; x.errorWaba = ''; pintarConexion(); return; }
  const ok = e.target.closest('[data-cx-otra-ok]'); if (!ok || ok.disabled) return;
  x.enviandoWaba = true; x.errorWaba = ''; pintarConexion();
  crmApi('POST', `/crm/conexiones/${encodeURIComponent(x.conexionId)}/cuentas`, {wabaId:(x.waba2 || '').trim()})
    .then(c => { mezclarConexion(c); x.otraWaba = false; x.waba2 = ''; toast('Cuenta de WhatsApp agregada'); x.sel = null; buscarNumeros(x); })
    .catch(err => { x.errorWaba = err.message || 'Meta no respondió'; })
    .finally(() => { x.enviandoWaba = false; if (st.cx === x && !document.getElementById('ov-x').hidden) pintarConexion(); });
});
document.getElementById('ov-x').addEventListener('input', e => {
  if (e.target.id !== 'cx-waba2' || !st.cx) return;
  e.target.value = e.target.value.replace(/\D/g, ''); st.cx.waba2 = e.target.value;
  const b = document.querySelector('[data-cx-otra-ok]'); if (b) b.disabled = st.cx.enviandoWaba || !/^\d{5,30}$/.test(st.cx.waba2);
});
function mezclarConexion(c){ const i = CONEXIONES.findIndex(x => x.id === c.id); if (i >= 0) CONEXIONES[i] = c; else CONEXIONES.push(c); }
function conectarCuenta(x){
  x.enviandoCx = true; x.errorCx = ''; pintarConexion();
  crmApi('POST', '/crm/conexiones/whatsapp', {appId:x.app.appId.trim(), appSecret:x.app.appSecret.trim(), token:x.app.token.trim(), ...(x.pideWaba ? {wabaId:(x.app.wabaId || '').trim()} : {})})
    .then(c => {
      mezclarConexion(c); x.conexionId = c.id; x.app = {appId:'', appSecret:'', token:'', wabaId:''}; x.pideWaba = false;
      if (c.estado === 'error') { x.avisoCx = c; toast('Cuenta conectada; falta el aviso de mensajes'); return; }
      toast('Cuenta de Meta conectada'); x.paso = 2; x.sel = null; buscarNumeros(x);
    })
    // Meta no dijo la cuenta del token: se pide su identificador (conexiones.ts, conectarWhatsappManual).
    .catch(err => { x.errorCx = err.message || 'Meta no respondió'; if ((err.campos || []).includes('wabaId') || /identificador de la cuenta de WhatsApp Business/.test(err.message || '')) x.pideWaba = true; })
    .finally(() => { x.enviandoCx = false; if (st.cx === x && !document.getElementById('ov-x').hidden) pintarConexion(); });
}
/* El botón de Meta (registro integrado de WhatsApp): el SDK de Facebook abre la ventana de Meta y devuelve un código,
   la cuenta de WhatsApp y el número elegido. El CRM cambia el código por el acceso (POST /crm/conexiones/whatsapp/meta). */
let fbSdk = null;
function cargarSdkFacebook(appId){
  if (fbSdk) return fbSdk;
  fbSdk = new Promise((ok, mal) => {
    window.fbAsyncInit = () => { try { FB.init({appId, autoLogAppEvents:true, xfbml:false, version:'v21.0'}); ok(); } catch (e) { mal(e); } };
    const s = document.createElement('script'); s.src = 'https://connect.facebook.net/es_LA/sdk.js'; s.async = true; s.crossOrigin = 'anonymous';
    s.onerror = () => { fbSdk = null; mal(new Error('No se pudo abrir Meta. Revisa la conexión a internet o si un bloqueador lo impide')); };
    document.head.appendChild(s);
  });
  return fbSdk;
}
function conectarConFacebook(x){
  const p = x.prov; if (!p || !p.listo) return;
  x.fbCargando = true; x.errorCx = ''; pintarConexion();
  let sesion = {};
  const oir = ev => {
    if (!/(^|\.)facebook\.com$/.test(new URL(ev.origin).hostname)) return;
    try { const d = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; if (d && d.type === 'WA_EMBEDDED_SIGNUP') {
      if (d.event === 'FINISH' || d.event === 'FINISH_ONLY_WABA') sesion = d.data || {};
      if (d.event === 'CANCEL') x.errorCx = d.data && d.data.current_step ? 'Se cerró la ventana de Meta antes de terminar.' : 'Se canceló la conexión con Meta.';
    } } catch { /* otro mensaje de Facebook */ }
  };
  window.addEventListener('message', oir);
  cargarSdkFacebook(p.appId).then(() => new Promise(ok => FB.login(r => ok(r), {config_id:p.configId, response_type:'code', override_default_response_type:true, extras:{setup:{}, featureType:'', sessionInfoVersion:'3'}})))
    .then(r => {
      const code = r && r.authResponse && r.authResponse.code;
      if (!code) throw new Error(x.errorCx || 'No se terminó la conexión con Meta.');
      // El número llega por el mensaje de Meta; a veces después de la respuesta: se le da un momento.
      return new Promise(ok => setTimeout(ok, sesion.waba_id ? 0 : 800)).then(() =>
        crmApi('POST', '/crm/conexiones/whatsapp/meta', {code, wabaId:sesion.waba_id || '', phoneNumberId:sesion.phone_number_id || ''}));
    })
    .then(c => { mezclarConexion(c); x.conexionId = c.id; x.preferido = c.phoneNumberId || null; x.paso = 2; x.sel = null; toast('Cuenta de WhatsApp conectada con Meta'); buscarNumeros(x); })
    .catch(err => { x.errorCx = err.message || 'No se pudo conectar con Meta'; })
    .finally(() => { window.removeEventListener('message', oir); x.fbCargando = false; if (st.cx === x && !document.getElementById('ov-x').hidden) pintarConexion(); });
}
function conectarLinea(x){
  const n = numeroSel(x);
  x.paso = 4; x.estado = 'conectando'; x.error = ''; pintarConexion();
  crmApi('POST', '/crm/lineas', {conexionId:x.conexionId, phoneNumberId:n.phoneNumberId, wabaId:n.wabaId, nombre:x.nombre.trim(), equipo:x.eq, pin:x.pin, llamadas:x.llamadas})
    .then(L => {
      x.linea = L; x.estado = 'listo';
      if (!LINEAS.some(l => l.id === L.id)) LINEAS.push(L);
      ajLinea(L.id, x.eq);
      const c = LLAM.lineas[L.id]; if (x.llamadas && !c.on) { c.on = true; c.desde = new Date().toISOString(); }
      if (st.pagina && st.pagina.startsWith('cfg-')) render(); toast(`Línea conectada: ${x.nombre.trim()}`);
    })
    .catch(err => { x.estado = 'error'; x.error = err.message || 'Meta no respondió'; })
    .finally(() => { if (st.cx === x && !document.getElementById('ov-x').hidden) pintarConexion(); });
}
document.getElementById('ov-x').addEventListener('click', e => {
  const x = st.cx; if (!x) return; const t = e.target;
  const cp = t.closest('[data-cx-copiar]'); if (cp) { copiar(cp.dataset.cxCopiar, 'Copiado'); return; }
  if (t.closest('[data-cx-reintentar]')) { buscarNumeros(x); pintarConexion(); return; }
  const cu = t.closest('[data-cx-cuenta]'); if (cu) { x.conexionId = cu.dataset.cxCuenta; pintarConexion(); return; }
  if (t.closest('[data-cx-nueva]')) { x.nueva = true; x.manual = false; x.errorCx = ''; pintarConexion(); return; }
  if (t.closest('[data-cx-volvercuentas]')) { x.nueva = false; x.errorCx = ''; pintarConexion(); return; }
  if (t.closest('[data-cx-manual]')) { x.manual = true; x.errorCx = ''; pintarConexion(); return; }
  if (t.closest('[data-cx-atrasman]')) { x.manual = false; x.errorCx = ''; pintarConexion(); return; }
  const fb = t.closest('[data-cx-fb]'); if (fb && !fb.disabled) { conectarConFacebook(x); return; }
  const cc = t.closest('[data-cx-conectarcuenta]'); if (cc && !cc.disabled) { conectarCuenta(x); return; }
  if (t.closest('[data-cx-seguir]')) { x.avisoCx = null; x.paso = 2; x.sel = null; buscarNumeros(x); pintarConexion(); return; }
  const s = t.closest('[data-cx-sel]'); if (s && !s.disabled) { x.sel = s.dataset.cxSel; pintarConexion(); return; }
  const ir = t.closest('[data-cx-ir]'); if (ir && !ir.disabled) { const p = +ir.dataset.cxIr; if (p === 2 && x.paso === 1) { x.sel = null; buscarNumeros(x); } x.paso = p; pintarConexion(); return; }
  const eq = t.closest('[data-cx-eq]'); if (eq) { x.eq = eq.dataset.cxEq; pintarConexion(); return; }
  if (t.closest('[data-cx-llam]')) { x.llamadas = !x.llamadas; pintarConexion(); return; }
  const cn = t.closest('[data-cx-conectar]'); if (cn && !cn.disabled && x.estado !== 'conectando') { conectarLinea(x); return; }
});
// Desconectar una cuenta de Meta (confirmado en el diálogo): sus líneas salen del CRM; las conversaciones se quedan.
document.getElementById('ov-x').addEventListener('click', e => {
  const b = e.target.closest('[data-cxm-quitarok]'); if (!b || b.disabled) return; b.disabled = true;
  crmApi('DELETE', `/crm/conexiones/${b.dataset.cxmQuitarok}`)
    .then(() => { const i = CONEXIONES.findIndex(c => c.id === b.dataset.cxmQuitarok); if (i >= 0) CONEXIONES.splice(i, 1); cerrarDialogo(); render(); toast('Cuenta de Meta desconectada'); })
    .catch(err => { b.disabled = false; toast(err.message || 'No se pudo desconectar'); });
});
document.getElementById('ov-x').addEventListener('input', e => {
  const x = st.cx; if (!x) return;
  if (e.target.id === 'cx-n') { x.nombre = e.target.value; }
  if (e.target.id === 'cx-pin') { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6); x.pin = e.target.value; }
  if (e.target.id === 'cx-app') { e.target.value = e.target.value.replace(/\D/g, ''); x.app.appId = e.target.value; }
  if (e.target.id === 'cx-sec') x.app.appSecret = e.target.value;
  if (e.target.id === 'cx-tok') x.app.token = e.target.value;
  if (e.target.id === 'cx-waba') { e.target.value = e.target.value.replace(/\D/g, ''); x.app.wabaId = e.target.value; }
  const b = document.querySelector('[data-cx-conectar]'); if (b && x.paso === 3) b.disabled = !(x.nombre.trim() && /^\d{6}$/.test(x.pin));
  const bc = document.querySelector('[data-cx-conectarcuenta]'); if (bc) bc.disabled = x.enviandoCx || !(/^\d{5,30}$/.test(x.app.appId.trim()) && x.app.appSecret.trim().length >= 32 && x.app.token.trim().length >= 40 && (!x.pideWaba || /^\d{5,30}$/.test((x.app.wabaId || '').trim())));
});

/* Registro de cada llamada en la conversación */
const burbujaBase = burbuja;
burbuja = function(m){
  if (!m.call) return burbujaBase(m);
  const k = m.call, perdida = k.estado !== 'ok';
  const titulo = k.estado === 'buzon' ? 'Llamada perdida · dejó un mensaje de voz' : k.estado === 'perdida' ? 'Llamada perdida' : k.estado === 'nocontesto' ? 'Llamada por WhatsApp · no contestó' : `${k.dir === 'in' ? 'Llamada entrante' : 'Llamada saliente'} por WhatsApp · ${mmss(k.dur || 0)}`;
  const audio = k.audio && /^https:\/\//.test(k.audio) ? `<audio controls preload="none" src="${esc(k.audio)}" style="width:100%;margin-top:6px"></audio>` : '';
  return `<div class="callrec ${perdida ? 'perdida' : ''}"><div class="t">${I('phone')}${titulo}</div>
    ${k.estado === 'ok' ? `<div class="r"><span>Atendió</span><span>${esc(k.quien)}</span></div>` : ''}
    <div class="r"><span>Línea</span><span>${esc(lineaDe(k.linea).n)}</span></div>
    ${k.sinGrabar ? `<div class="r"><span>Grabación</span><span>No se grabó: ${esc(k.sinGrabar)}</span></div>` : ''}
    ${audio}${k.trans ? `<details><summary>${k.estado === 'buzon' ? 'Ver lo que dijo' : 'Ver transcripción'}</summary>${k.trans.map(([q, x]) => `<p>${q ? `<b>${esc(q)}:</b> ` : ''}${esc(x)}</p>`).join('')}</details>` : ''}
    <div class="ft">${m.h || ''}</div></div>`;
};

/* Botón de llamar de la conversación: dice el motivo real cuando no se puede llamar */
function motivoSinLlamar(c){
  const l = LINEAS.find(x => x.id === c.linea);
  if (!l) return 'Esta conversación no tiene una línea de WhatsApp conectada.';
  if (!metaLlamadas(l)) return `Las llamadas por WhatsApp todavía no están activadas en Meta para la línea ${l.n}.`;
  if (!(LLAM.lineas[l.id] || {}).on) return `Las llamadas están apagadas en la línea ${l.n}.`;
  return 'El CRM todavía no tiene con qué hacer la llamada desde el navegador.';
}
document.addEventListener('click', e => {
  if (!e.target.closest('#b-call')) return;
  e.stopPropagation();
  const c = CONV.find(x => x.id === st.sel); if (!c) return;
  if (c.canal !== 'wa') { toast(`Las llamadas van por WhatsApp; ${(CANALES[c.canal] || {n:'este canal'}).n} no permite llamar`); return; }
  const hl = horarioLegal();
  if (llamadasActivas(c.linea) && !hl.ok) { abrirDialogo(`<h3>Ahora no se puede llamar a ${esc(c.n)}</h3><p>${esc(hl.motivo)} La Ley 2300 solo permite llamadas de venta de lunes a viernes de 7 a. m. a 7 p. m. y los sábados de 8 a. m. a 3 p. m., nunca domingos ni festivos.</p><p class="muted">Si el cliente te llama, sí puedes contestar: esa restricción es solo para las llamadas que hace el asesor.</p><div class="ft2"><button type="button" class="btn" data-cerrar-dlg="1">Cerrar</button><button type="button" class="btn pri" data-ll-recordar="${esc(hl.siguiente)}" data-para="${hl.para || ''}">${I('bell')}Recordarme ${esc(hl.siguiente)}</button></div>`); return; }
  if (llamadasActivas(c.linea) && PD.rneOn && c.rne && !c.aut) { abrirDialogo(`<h3>No se puede llamar a ${esc(c.n)}</h3><p>Su número está en el Registro de Números Excluidos de la CRC y no ha autorizado a la empresa. No se le puede llamar ni incluir en difusiones.</p><p class="muted">Como escribió primero, sí le puedes responder por el chat. Si autoriza sus datos, se le puede llamar.</p><div class="ft2"><button type="button" class="btn" data-cerrar-dlg="1">Entendido</button><button type="button" class="btn pri" data-ll-aut="1">${I('send')}Pedirle autorización</button></div>`); return; }
  abrirDialogo(`<h3>Llamar a ${esc(c.n)}</h3><p>${esc(motivoSinLlamar(c))} Mientras tanto, escríbele por el chat.</p>${st.rol === 'l' ? '<p class="muted">Las llamadas de cada línea se ven en Ajustes del CRM, Líneas de WhatsApp.</p>' : ''}<div class="ft2"><button type="button" class="btn" data-cerrar-dlg="1">Entendido</button></div>`);
}, true);
