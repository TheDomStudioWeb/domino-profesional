// DOMino Profesional · Hub de gestión
// Inicio con accesos, expedientes, calendario, herramientas y equipo.
// Usa la conexión a Firebase que arma app.js (window.DOMINO).
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const D = () => window.DOMINO;
const esc = (v) => (D() ? D().esc(v) : String(v ?? ''));
const $ = (id) => document.getElementById(id);
const hoyISO = () => new Date().toISOString().split('T')[0];
const ESTADO_FIN = 'Proceso Completo/Finalizado';

const ICONOS = {
  comando: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  cartera: '<path d="M3 7h18v13H3zM8 7V4h8v3"/>',
  expedientes: '<path d="M4 4h6l2 3h8v13H4z"/>',
  kanban: '<path d="M4 4h5v16H4zM10 4h5v10h-5zM16 4h5v13h-5z"/>',
  tareas: '<path d="M5 12l4 4L19 6"/>',
  buzon: '<path d="M3 8l9 6 9-6M3 6h18v12H3z"/>',
  pendientes: '<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/>',
  enviar: '<path d="M4 12l16-8-6 16-3-7z"/>',
  portal: '<path d="M10 4H5v16h14v-5M14 4h6v6M20 4l-9 9"/>',
  calendario: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  equipo: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 5a3 3 0 010 6M18 14c2 1 3 3 3 6"/>',
  cuit: '<path d="M4 6h16v12H4zM8 10h4M8 14h8"/>',
  iva: '<path d="M5 19L19 5M7 8a1.5 1.5 0 100-.01M17 18a1.5 1.5 0 100-.01"/>',
  hoja: '<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7"/>'
};
const icono = (k) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[k]}</svg>`;

// ---------------------------------------------------------------
// Catálogo del Hub: cada función de DOMino Profesional, en un lugar
// ---------------------------------------------------------------
const GRUPOS = [
  { titulo: 'Gestión del estudio', items: [
    { k: 'expedientes', t: 'Clientes', d: 'Empresas, procesos y documentos. Desde acá también se da de alta o baja a un cliente.', roles: ['senior', 'midsenior'], go: () => navegarA('expedientes') },
    { k: 'kanban', t: 'Tareas', d: 'Todas las tareas del estudio, por estado.', roles: ['senior', 'midsenior'], go: () => navegarA('kanban') },
    { k: 'tareas', t: 'Mis Tareas', d: 'Lo que tenés asignado, por estado.', roles: ['asistente'], go: () => navegarA('mis-tareas') }
  ]},
  { titulo: 'Documentos', items: [
    { k: 'buzon', t: 'Buzón documental', d: 'Cargar lo recibido y enviar documentación al cliente.', roles: ['senior', 'midsenior'], go: () => abrirExpedientes('buzon') },
    { k: 'pendientes', t: 'Documentos pendientes', d: 'Lo que subieron los clientes y falta procesar.', roles: ['senior', 'midsenior'], badge: 'docs', go: () => abrirModalDocsPendientes() },
    { k: 'portal', t: 'Portal del cliente', d: 'Cómo ve y envía documentos su cliente.', roles: ['senior', 'midsenior'], go: () => window.open('portal-cliente.html', '_blank', 'noopener') }
  ]},
  { titulo: 'Plazos y equipo', items: [
    { k: 'calendario', t: 'Calendario', d: 'Vencimientos del mes, día por día.', roles: ['senior', 'midsenior', 'asistente'], go: () => navegarA('calendario') },
    { k: 'chat', t: 'Chat interno', d: 'Mensajes del equipo con menciones.', roles: ['senior', 'midsenior', 'asistente'], badge: 'chat', go: () => abrirChat() },
    { k: 'equipo', t: 'Equipo', d: 'Quiénes tienen acceso y con qué nivel.', roles: ['senior'], go: () => navegarA('equipo') }
  ]},
  { titulo: 'Herramientas', items: [
    { k: 'cuit', t: 'Validador de CUIT', d: 'Dígito verificador y tipo de persona.', roles: ['senior', 'midsenior', 'asistente'], go: () => irHerramienta('tool-cuit') },
    { k: 'iva', t: 'Calculadora de IVA', d: 'De neto a total y de total a neto.', roles: ['senior', 'midsenior', 'asistente'], go: () => irHerramienta('tool-iva') },
    { k: 'hoja', t: 'Hoja unificada A4', d: 'Frente y dorso de un documento en una hoja.', roles: ['senior', 'midsenior', 'asistente'], go: () => irHerramienta('tool-hoja') }
  ]}
];
const ACCIONES = [];

function irHerramienta(id) {
  navegarA('herramientas');
  setTimeout(() => { const el = $(id); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('resalta'); setTimeout(() => el.classList.remove('resalta'), 1600); } }, 60);
}
window.abrirExpedientes = function (modo) {
  D().modoExp = modo || 'expediente';
  navegarA('expedientes');
};

// ---------------------------------------------------------------
// INICIO
// ---------------------------------------------------------------
const ROL_TXT = { senior: 'Profesional Senior', midsenior: 'Profesional Mid Senior', asistente: 'Asistente' };

function badgeChat() { const b = $('badge-chat'); return b && b.style.display !== 'none' ? b.innerText : ''; }

async function tareasAbiertas() {
  const snap = await getDocs(collection(D().db, 'tasks'));
  const out = [];
  snap.forEach((t) => out.push({ id: t.id, ...t.data() }));
  return out;
}

async function renderHub() {
  const rol = D().rol;
  $('hub-buscar').hidden = rol === 'asistente';
  if (rol !== 'asistente') { $('hub-q').value = ''; $('hub-q-res').innerHTML = ''; cargarEmpresas().catch((e) => console.error(e)); }
  const nombre = D().nombre || '';
  $('hub-fecha').innerText = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  $('hub-saludo').innerText = nombre ? `Hola, ${nombre}` : 'Hub de gestión';
  $('hub-sub').innerText = `${ROL_TXT[rol] || ''} · Todo el estudio en un solo lugar: elegí una herramienta y entrás en un toque.`;
  renderGrupos();
  try {
    let tareas = await tareasAbiertas();
    if (rol === 'asistente') tareas = tareas.filter((t) => t.responsable === nombre);
    const hoy = hoyISO();
    const lim = new Date(); lim.setDate(lim.getDate() + 4);
    const limite = lim.toISOString().split('T')[0];
    const abiertas = tareas.filter((t) => t.estado !== ESTADO_FIN);
    const vencidas = abiertas.filter((t) => t.vencimiento && t.vencimiento < hoy);
    const deHoy = abiertas.filter((t) => t.vencimiento === hoy);
    const proximas = abiertas.filter((t) => t.vencimiento && t.vencimiento > hoy && t.vencimiento <= limite);
    renderResumen({ listos: tareas.filter((t) => t.estado === ESTADO_FIN).length, vencidas: vencidas.length, hoy: deHoy.length, proceso: abiertas.filter((t) => t.estado === 'En Proceso' || t.estado === 'Procesado/Liquidado').length });
    renderHoy([...vencidas, ...deHoy, ...proximas].sort((a, b) => (a.vencimiento || '').localeCompare(b.vencimiento || '')).slice(0, 8), hoy);
  } catch (e) {
    console.error('Hub: no se pudieron leer las tareas', e);
    $('hub-lista-hoy').innerHTML = '<p class="vacio">No se pudieron cargar las tareas. Probá de nuevo en un momento.</p>';
  }
}

function renderResumen(r) {
  const rol = D().rol;
  const items = [
    { n: r.vencidas, t: 'Vencidas', cls: 'text-rojo', go: "navegarA('calendario')" },
    { n: r.hoy, t: 'Vencen hoy', cls: 'text-ambar', go: "navegarA('calendario')" },
    { n: r.proceso, t: 'En proceso', cls: 'text-ambar', go: `navegarA('${rol === 'asistente' ? 'mis-tareas' : 'kanban'}')` }
  ];
  items.push({ n: r.listos, t: rol === 'asistente' ? 'Finalizadas' : 'Balances listos', cls: 'text-verde', go: `navegarA('${rol === 'asistente' ? 'mis-tareas' : 'kanban'}')` });
  if (rol !== 'asistente') items.push({ n: (D().kpis || {}).docsPendientes ?? '–', t: 'Documentos por procesar', cls: 'text-ambar', go: 'abrirModalDocsPendientes()' });
  $('hub-resumen').innerHTML = items.map((i) => `<button type="button" class="res-card" onclick="${i.go}"><span class="numero ${i.cls}">${esc(i.n)}</span><span class="res-t">${esc(i.t)}</span></button>`).join('');
}

function renderHoy(lista, hoy) {
  const cont = $('hub-lista-hoy');
  if (!lista.length) { cont.innerHTML = '<p class="vacio">No hay vencimientos para hoy ni para los próximos días.</p>'; return; }
  const cache = (window.DOMINO && window.DOMINO.clientes) || {};
  cont.innerHTML = lista.map((t) => {
    const vencida = t.vencimiento < hoy;
    const eti = vencida ? 'Vencida' : t.vencimiento === hoy ? 'Hoy' : 'Próxima';
    const color = vencida ? 'border-rojo' : t.vencimiento === hoy ? 'border-ambar' : 'border-verde';
    const empresa = cache[t.cliente_id] || 'Empresa';
    const act = D().rol === 'asistente'
      ? `data-act="docs-tarea" data-id="${esc(t.id)}" data-titulo="${esc(t.titulo)}" data-cliente="${esc(t.cliente_id)}"`
      : `data-act="expediente" data-id="${esc(t.cliente_id)}" data-nombre="${esc(empresa)}"`;
    return `<div class="task-item ${color}"><div class="task-info"><h4>${esc(t.titulo)}</h4><p style="color:var(--text-muted);font-size:.85rem;"><strong>${esc(empresa)}</strong> | ${esc(t.responsable)} | Vence: ${esc(t.vencimiento)} | <b class="eti">${eti}</b></p></div><button class="btn-action" ${act}>${D().rol === 'asistente' ? 'Documentos' : 'Ver expediente'}</button></div>`;
  }).join('');
}

function renderGrupos() {
  const rol = D().rol;
  $('hub-grupos').innerHTML = GRUPOS.map((g, gi) => {
    const items = g.items.filter((i) => i.roles.includes(rol));
    if (!items.length) return '';
    return `<section class="hub-grupo"><h2>${esc(g.titulo)}</h2><div class="tiles">${items.map((i, ii) => `
      <button type="button" class="tile" data-g="${gi}" data-i="${g.items.indexOf(i)}">
        <span class="tile-ic">${icono(i.k)}</span>
        <span class="tile-tx"><b>${esc(i.t)}</b><small>${esc(i.d)}</small></span>
        <span class="tile-badge" data-badge="${i.badge || ''}" hidden></span>
      </button>`).join('')}</div></section>`;
  }).join('');
  refrescarBadges();
}
function refrescarBadges() {
  document.querySelectorAll('.tile-badge').forEach((b) => {
    let v = '';
    if (b.dataset.badge === 'docs') v = (D().kpis || {}).docsPendientes || '';
    if (b.dataset.badge === 'chat') v = badgeChat();
    b.hidden = !v || v === '0'; b.innerText = v;
  });
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('.tile');
  if (!t) return;
  GRUPOS[+t.dataset.g].items[+t.dataset.i].go();
});
window.addEventListener('domino:kpis', refrescarBadges);
setInterval(refrescarBadges, 4000);

// ---------------------------------------------------------------
// EXPEDIENTES (selector de empresa)
// ---------------------------------------------------------------
let empresas = [];
async function cargarEmpresas() {
  const [cl, ta, dc] = await Promise.all([
    getDocs(query(collection(D().db, 'clients'), where('estado', '==', 'activo'))),
    getDocs(collection(D().db, 'tasks')),
    getDocs(query(collection(D().db, 'documents'), where('estado', '==', 'Pendiente de Procesar')))
  ]);
  const abiertas = {}, docs = {};
  ta.forEach((t) => { const d = t.data(); if (d.estado !== ESTADO_FIN) abiertas[d.cliente_id] = (abiertas[d.cliente_id] || 0) + 1; });
  dc.forEach((x) => { const d = x.data(); docs[d.cliente_id] = (docs[d.cliente_id] || 0) + 1; });
  empresas = [];
  cl.forEach((c) => { const d = c.data(); empresas.push({ id: c.id, nombre: d.nombre_empresa, cuit: d.cuit, abiertas: abiertas[c.id] || 0, docs: docs[c.id] || 0 }); });
  empresas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
function pintarEmpresas() {
  const q = ($('buscar-expediente').value || '').toLowerCase().trim();
  const modo = D().modoExp === 'buzon' ? 'buzon' : 'expediente';
  const lista = empresas.filter((e) => !q || e.nombre.toLowerCase().includes(q) || String(e.cuit).includes(q));
  $('lista-expedientes').innerHTML = lista.length ? lista.map((e) => `
    <button type="button" class="exp-card" data-act="${modo}" data-id="${esc(e.id)}" data-nombre="${esc(e.nombre)}">
      <b>${esc(e.nombre)}</b><small>CUIT ${esc(e.cuit)}</small>
      <span class="exp-meta"><span>${e.abiertas} ${e.abiertas === 1 ? 'proceso abierto' : 'procesos abiertos'}</span>${e.docs ? `<span class="exp-doc">${e.docs} ${e.docs === 1 ? 'documento por procesar' : 'documentos por procesar'}</span>` : ''}</span>
    </button>`).join('') : '<p class="vacio">No hay empresas que coincidan.</p>';
}
async function renderExpedientes() {
  const modo = D().modoExp === 'buzon' ? 'buzon' : 'expediente';
  $('titulo-expedientes').innerText = modo === 'buzon' ? 'Buzón documental' : 'Expedientes';
  $('expedientes-ayuda').innerText = modo === 'buzon' ? 'Elegí la empresa para cargar documentos recibidos o enviarle documentación.' : 'Elegí la empresa para ver sus procesos y documentos.';
  $('lista-expedientes').innerHTML = '<p class="vacio">Cargando…</p>';
  try { await cargarEmpresas(); pintarEmpresas(); } catch (e) { console.error(e); $('lista-expedientes').innerHTML = '<p class="vacio">No se pudieron cargar las empresas.</p>'; }
  D().modoExp = 'expediente';
}
$('buscar-expediente').addEventListener('input', pintarEmpresas);

// ---------------------------------------------------------------
// CALENDARIO
// ---------------------------------------------------------------
let calMes = new Date(); calMes.setDate(1);
let calTareas = [];
let calSel = null;
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

async function renderCalendario() {
  try {
    let t = await tareasAbiertas();
    if (D().rol === 'asistente') t = t.filter((x) => x.responsable === D().nombre);
    calTareas = t.filter((x) => x.vencimiento);
  } catch (e) { console.error(e); }
  pintarCalendario();
}
function pintarCalendario() {
  const y = calMes.getFullYear(), m = calMes.getMonth();
  $('cal-titulo').innerText = `${MESES[m][0].toUpperCase()}${MESES[m].slice(1)} ${y}`;
  const primero = new Date(y, m, 1).getDay();
  const offset = (primero + 6) % 7; // lunes primero
  const dias = new Date(y, m + 1, 0).getDate();
  const hoy = hoyISO();
  let h = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map((d) => `<div class="cal-cab">${d}</div>`).join('');
  for (let i = 0; i < offset; i++) h += '<div class="cal-vacio"></div>';
  for (let d = 1; d <= dias; d++) {
    const f = iso(y, m, d);
    const ts = calTareas.filter((t) => t.vencimiento === f);
    const abiertas = ts.filter((t) => t.estado !== ESTADO_FIN).length;
    const cls = ['cal-dia-btn', f === hoy ? 'es-hoy' : '', f === calSel ? 'sel' : '', abiertas && f < hoy ? 'vencido' : ''].join(' ');
    const lab = ts.length ? `${d}: ${ts.length} ${ts.length === 1 ? 'vencimiento' : 'vencimientos'}` : `${d}: sin vencimientos`;
    h += `<button type="button" class="${cls}" data-f="${f}" aria-label="${lab}"><span>${d}</span>${ts.length ? `<em>${ts.length}</em>` : ''}</button>`;
  }
  $('cal-grid').innerHTML = h;
  pintarDia();
}
function pintarDia() {
  if (!calSel) { $('cal-dia-titulo').innerText = 'Elegí un día'; $('cal-dia-lista').innerHTML = ''; return; }
  const [y, m, d] = calSel.split('-').map(Number);
  $('cal-dia-titulo').innerText = new Date(y, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const ts = calTareas.filter((t) => t.vencimiento === calSel);
  const cache = D().clientes || {};
  $('cal-dia-lista').innerHTML = ts.length ? ts.map((t) => {
    const fin = t.estado === ESTADO_FIN;
    const act = D().rol === 'asistente'
      ? `data-act="docs-tarea" data-id="${esc(t.id)}" data-titulo="${esc(t.titulo)}" data-cliente="${esc(t.cliente_id)}"`
      : `data-act="expediente" data-id="${esc(t.cliente_id)}" data-nombre="${esc(cache[t.cliente_id] || 'Empresa')}"`;
    return `<div class="task-item ${fin ? 'border-verde' : 'border-ambar'}"><div class="task-info"><h4>${esc(t.titulo)}</h4><p style="color:var(--text-muted);font-size:.85rem;"><strong>${esc(cache[t.cliente_id] || 'Empresa')}</strong> | ${esc(t.responsable)} | Estado: ${esc(t.estado)}</p></div><button class="btn-action" ${act}>${D().rol === 'asistente' ? 'Documentos' : 'Ver expediente'}</button></div>`;
  }).join('') : '<p class="vacio">No hay vencimientos este día.</p>';
}
$('cal-grid').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (!b) return; calSel = b.dataset.f; pintarCalendario(); });
$('cal-prev').addEventListener('click', () => { calMes.setMonth(calMes.getMonth() - 1); pintarCalendario(); });
$('cal-next').addEventListener('click', () => { calMes.setMonth(calMes.getMonth() + 1); pintarCalendario(); });
$('cal-hoy').addEventListener('click', () => { calMes = new Date(); calMes.setDate(1); calSel = hoyISO(); pintarCalendario(); });

// ---------------------------------------------------------------
// EQUIPO
// ---------------------------------------------------------------
async function renderEquipo() {
  const cont = $('lista-equipo');
  cont.innerHTML = '<p class="vacio">Cargando…</p>';
  try {
    const snap = await getDocs(collection(D().db, 'users'));
    const filas = [];
    snap.forEach((u) => filas.push(u.data()));
    const orden = { senior: 0, midsenior: 1, asistente: 2 };
    filas.sort((a, b) => (orden[a.rol_jerarquia] ?? 9) - (orden[b.rol_jerarquia] ?? 9));
    cont.innerHTML = filas.map((u) => `<div class="task-item ${u.rol_jerarquia === 'senior' ? 'border-verde' : 'border-ambar'}"><div class="task-info"><h4>${esc(u.nombre_display || u.email)}</h4><p style="color:var(--text-muted);font-size:.85rem;">${esc(u.email)} | Nivel: <strong>${esc(ROL_TXT[u.rol_jerarquia] || u.rol_jerarquia || 'Sin nivel')}</strong></p></div></div>`).join('') || '<p class="vacio">No hay personas cargadas.</p>';
  } catch (e) { console.error(e); cont.innerHTML = '<p class="vacio">No se pudo cargar el equipo.</p>'; }
}

// ---------------------------------------------------------------
// HERRAMIENTAS
// ---------------------------------------------------------------
// 1) CUIT / CUIL
export function validarCuit(txt) {
  const n = String(txt).replace(/\D/g, '');
  if (n.length !== 11) return { ok: false, msg: 'Debe tener 11 dígitos.' };
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((a, p, i) => a + p * +n[i], 0);
  let dv = 11 - (suma % 11);
  if (dv === 11) dv = 0;
  if (dv === 10 || dv !== +n[10]) return { ok: false, msg: `El dígito verificador no coincide (debería ser ${dv === 10 ? 'no válido' : dv}).` };
  const pre = n.slice(0, 2);
  const tipos = { '20': 'persona humana (masculino)', '27': 'persona humana (femenino)', '23': 'persona humana', '24': 'persona humana', '30': 'persona jurídica', '33': 'persona jurídica', '34': 'persona jurídica' };
  return { ok: true, msg: `Dígito verificador correcto. Prefijo ${pre}: ${tipos[pre] || 'tipo no estándar, verificalo en ARCA'}.`, fmt: `${n.slice(0, 2)}-${n.slice(2, 10)}-${n[10]}` };
}
$('cuit-in').addEventListener('input', () => {
  const v = $('cuit-in').value;
  const out = $('cuit-out');
  if (!v.trim()) { out.innerHTML = ''; return; }
  const r = validarCuit(v);
  out.className = 'tool-out ' + (r.ok ? 'ok' : 'mal');
  out.innerHTML = `<b>${r.ok ? '✓ Válido' : '✕ No válido'}</b>${r.fmt ? ` · ${esc(r.fmt)}` : ''}<br>${esc(r.msg)}<br><small>Solo controla el formato matemático; no confirma que esté inscripto.</small>`;
});

// 2) IVA
let ivaModo = 'neto';
const moneda = (n) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
function calcIva() {
  const m = parseFloat($('iva-monto').value);
  const out = $('iva-out');
  if (!isFinite(m)) { out.innerHTML = ''; return; }
  const a = parseFloat($('iva-alicuota').value) / 100;
  const neto = ivaModo === 'neto' ? m : m / (1 + a);
  const iva = neto * a;
  out.className = 'tool-out';
  out.innerHTML = `<table class="mini-tabla"><tr><td>Neto</td><td>${moneda(neto)}</td></tr><tr><td>IVA</td><td>${moneda(iva)}</td></tr><tr><td><b>Total</b></td><td><b>${moneda(neto + iva)}</b></td></tr></table>`;
}
function setIvaModo(modo) {
  ivaModo = modo;
  $('iva-neto').className = modo === 'neto' ? 'btn-primary' : 'btn-secundario';
  $('iva-total').className = modo === 'total' ? 'btn-primary' : 'btn-secundario';
  $('iva-neto').setAttribute('aria-pressed', modo === 'neto'); $('iva-total').setAttribute('aria-pressed', modo === 'total');
  calcIva();
}
$('iva-neto').addEventListener('click', () => setIvaModo('neto'));
$('iva-total').addEventListener('click', () => setIvaModo('total'));
$('iva-monto').addEventListener('input', calcIva);
$('iva-alicuota').addEventListener('change', calcIva);

// 3) Hoja A4 unificada
const hoja = { frente: null, dorso: null };
function cargarImg(file) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
}
function dibujarHoja() {
  const c = $('hoja-canvas'); const x = c.getContext('2d');
  c.width = 1240; c.height = 1754; // A4 a 150 ppp
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  const caja = (img, y0) => {
    const mx = 120, my = 90, w = c.width - mx * 2, h = c.height / 2 - my * 2;
    x.strokeStyle = '#d9d9d9'; x.setLineDash([8, 8]); x.strokeRect(mx, y0 + my, w, h); x.setLineDash([]);
    if (!img) return;
    const k = Math.min(w / img.width, h / img.height);
    const iw = img.width * k, ih = img.height * k;
    x.drawImage(img, mx + (w - iw) / 2, y0 + my + (h - ih) / 2, iw, ih);
  };
  caja(hoja.frente, 0); caja(hoja.dorso, c.height / 2);
}
async function leerHoja(que, file) { if (!file) { hoja[que] = null; } else { try { hoja[que] = await cargarImg(file); } catch (e) { hoja[que] = null; } } dibujarHoja(); }
$('hoja-frente').addEventListener('change', (e) => leerHoja('frente', e.target.files[0]));
$('hoja-dorso').addEventListener('change', (e) => leerHoja('dorso', e.target.files[0]));
$('hoja-descargar').addEventListener('click', () => {
  if (!hoja.frente && !hoja.dorso) { alert('Elegí al menos una imagen.'); return; }
  $('hoja-canvas').toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'hoja-unificada-A4.png'; document.body.appendChild(a); a.click(); a.remove(); }, 'image/png');
});
$('hoja-imprimir').addEventListener('click', () => {
  if (!hoja.frente && !hoja.dorso) { alert('Elegí al menos una imagen.'); return; }
  const url = $('hoja-canvas').toDataURL('image/png');
  const w = window.open('', '_blank');
  if (!w) { alert('El navegador bloqueó la ventana de impresión.'); return; }
  w.document.write(`<title>Hoja unificada</title><style>@page{size:A4;margin:0}body{margin:0}img{width:210mm;height:297mm;display:block}</style><img src="${url}" onload="setTimeout(function(){print()},200)">`);
  w.document.close();
});
dibujarHoja();

// ---------------------------------------------------------------
// Enrutado de vistas
// ---------------------------------------------------------------
window.addEventListener('domino:vista', (e) => {
  if (!D().listo) return;
  const v = e.detail;
  if (v === 'hub') renderHub();
  else if (v === 'expedientes') renderExpedientes();
  else if (v === 'calendario') renderCalendario();
  else if (v === 'equipo') renderEquipo();
});

// ---------------------------------------------------------------
// Buscador de empresa en Inicio: escribir tres letras y entrar directo
// ---------------------------------------------------------------
function buscarEnInicio() {
  const q = $('hub-q').value.toLowerCase().trim();
  const out = $('hub-q-res');
  if (q.length < 2) { out.innerHTML = ''; return; }
  const lista = empresas.filter((e) => e.nombre.toLowerCase().includes(q) || String(e.cuit).replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§')).slice(0, 6);
  out.innerHTML = lista.length ? lista.map((e) => `
    <div class="q-fila">
      <div class="q-txt"><b>${esc(e.nombre)}</b><small>CUIT ${esc(e.cuit)} · ${e.abiertas} ${e.abiertas === 1 ? 'proceso abierto' : 'procesos abiertos'}${e.docs ? ` · ${e.docs} por procesar` : ''}</small></div>
      <div class="q-acc">
        <button type="button" class="btn-primary" data-act="expediente" data-id="${esc(e.id)}" data-nombre="${esc(e.nombre)}">Expediente</button>
        <button type="button" class="btn-secundario" data-act="buzon" data-id="${esc(e.id)}" data-nombre="${esc(e.nombre)}">Buzón</button>
      </div>
    </div>`).join('') : '<p class="vacio">No hay empresas activas que coincidan.</p>';
}
$('hub-q').addEventListener('input', buscarEnInicio);
$('hub-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { const b = document.querySelector('#hub-q-res [data-act="expediente"]'); if (b) b.click(); } });
