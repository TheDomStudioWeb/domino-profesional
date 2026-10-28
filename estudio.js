// DOMino Profesional · Datos del estudio y profesión.
// La primera vez que entra el Profesional Senior, carga el nombre del estudio, el logo, la profesión y cuántas personas trabajan en cada puesto
// (solo como dato informativo: los nombres y las tareas de cada persona se cargan en Equipo).
// La profesión decide qué palabras, listas y herramientas ve todo el estudio (ver modulos.js).
// Se guarda en Firestore: config/negocio (completo, solo el personal) y config/publico (nombre y profesión, para el portal del cliente).
import { doc, getDoc, setDoc, getDocs, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const D = () => window.DOMINO, $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PUESTOS = [['senior', 'Profesional Senior', 'Dirigen el estudio y dan de alta al equipo.'], ['midsenior', 'Profesional Mid Senior', 'Gestionan clientes y tareas.'], ['asistente', 'Asistentes', 'Ven y completan sus propias tareas.']];
const NOMBRE_PUESTO = { senior: 'Senior', midsenior: 'Mid Senior', asistente: 'Asistente' };
let negocio = null, cargado = false;

async function leerNegocio() {
  try { const s = await getDoc(doc(D().db, 'config', 'negocio')); negocio = s.exists() ? s.data() : null; cargado = true; }
  catch (e) { console.warn('Estudio: no se pudo leer config/negocio', e); negocio = null; cargado = false; }
  window.DOMINO_NEGOCIO = negocio;
}
const perfiles = () => window.DOMINO_PERFILES || [];
const nombreProfesion = (id) => (perfiles().find((p) => p.id === id) || { nombre: id }).nombre;

function estilos() {
  if ($('es-css')) return;
  const s = document.createElement('style'); s.id = 'es-css';
  s.textContent = `
  .es-fondo{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.78);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 16px 24px}
  .es-caja{background:var(--bg-panel,#16181c);border:1px solid var(--hairline,#d4af3740);border-radius:12px;width:100%;max-width:560px;margin:auto;padding:22px 20px;color:var(--text-main,#f4f1ea)}
  .es-caja h2{font-family:Cinzel,serif;font-size:1.35rem;margin:0 0 6px;color:var(--gold-light,#e8c766)}
  .es-caja p{margin:0 0 12px;color:var(--text-muted,#a8a396);line-height:1.5}
  .es-caja label.es-l{display:block;margin:16px 0 6px;font-weight:600}
  .es-caja input[type=text]{width:100%;padding:12px;border-radius:8px;border:1px solid var(--line,#2a2d33);background:var(--bg-base,#0a0a0a);color:inherit;font-size:1rem}
  .es-x{position:sticky;top:0;float:right;margin:-8px -6px 0 8px;width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#2a2d33);background:var(--bg-base,#0a0a0a);color:var(--text-main,#f4f1ea);font-size:1.1rem;cursor:pointer}
  .es-logo-fila{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.es-logo-prev{width:96px;height:96px;border:1px dashed var(--line,#2a2d33);border-radius:10px;display:grid;place-items:center;background:var(--bg-base,#0a0a0a);color:var(--text-muted,#a8a396);font-size:.85rem;overflow:hidden}.es-logo-prev img{max-width:100%;max-height:100%;object-fit:contain}
  .es-prof{display:grid;gap:8px}
  .es-op{display:flex;gap:12px;align-items:center;padding:12px;border:1px solid var(--line,#2a2d33);border-radius:10px;cursor:pointer;background:var(--bg-base,#0a0a0a);font-weight:600}
  .es-op:has(input:checked){border-color:var(--gold,#d4af37);background:#d4af3714}
  .es-op input{width:22px;height:22px;accent-color:#d4af37;flex:none}
  .es-pu{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--line,#2a2d33);border-radius:10px;background:var(--bg-base,#0a0a0a)}
  .es-pu small{display:block;color:var(--text-muted,#a8a396);font-weight:400}
  .es-cnt{display:flex;gap:6px;align-items:center}.es-cnt button{width:44px;height:44px;border-radius:8px;border:1px solid var(--gold,#d4af37);background:transparent;color:var(--gold-light,#e8c766);font-size:1.3rem;cursor:pointer}
  .es-cnt input{width:56px;text-align:center;padding:10px 4px;border-radius:8px;border:1px solid var(--line,#2a2d33);background:var(--bg-base,#0a0a0a);color:inherit;font-size:1.05rem}
  .es-fila{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
  .es-btn{padding:12px 18px;border-radius:8px;border:1px solid var(--gold,#d4af37);background:var(--gold,#d4af37);color:#0a0a0a;font-weight:700;font-size:1rem;cursor:pointer}
  .es-btn.sec{background:transparent;color:var(--gold-light,#e8c766)}
  .es-err{color:#ff9b93;margin-top:10px;min-height:1.2em}
  #hub-estudio{margin:0 0 18px;padding:14px 16px;border:1px solid var(--hairline,#d4af3740);border-radius:12px;background:var(--bg-panel,#16181c)}
  #hub-estudio h2{margin:0 0 8px;font-size:1.05rem}
  .es-chips{display:flex;flex-wrap:wrap;gap:6px}.es-chip{padding:5px 11px;border-radius:99px;border:1px solid var(--gold,#d4af37);font-size:.85rem;color:var(--gold-light,#e8c766)}
  #hub-estudio .es-fila{margin-top:12px}`;
  document.head.appendChild(s);
}
function cerrar() { const f = $('es-fondo'); if (f) f.remove(); document.body.style.overflow = ''; }

function prepararLogo(file) {
  return new Promise((ok, mal) => {
    const esSvg = /svg/i.test(file.type) || /\.svg$/i.test(file.name), esPng = /png/i.test(file.type) || /\.png$/i.test(file.name);
    if (!esSvg && !esPng) return mal(new Error('El logo tiene que ser PNG o SVG.'));
    if (file.size > 3 * 1024 * 1024) return mal(new Error('El archivo es muy pesado (máximo 3 MB).'));
    const r = new FileReader();
    r.onerror = () => mal(new Error('No se pudo leer el archivo.'));
    if (esSvg) {
      if (file.size > 150 * 1024) return mal(new Error('El SVG es muy pesado (máximo 150 KB). Pruebe con un PNG.'));
      r.onload = () => { const t = String(r.result); if (!/<svg[\s>]/i.test(t)) return mal(new Error('El archivo no parece un SVG válido.')); ok('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(t)))); };
      r.readAsText(file);
    } else {
      r.onload = () => { const img = new Image(); img.onload = () => { const k = Math.min(1, 256 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); const url = c.toDataURL('image/png'); url.length > 700000 ? mal(new Error('El logo quedó muy pesado. Pruebe con una imagen más simple.')) : ok(url); }; img.onerror = () => mal(new Error('No se pudo abrir la imagen.')); img.src = String(r.result); };
      r.readAsDataURL(file);
    }
  });
}

function aplicarMarca() {
  const url = negocio && negocio.logo;
  document.querySelectorAll('.brand-icon').forEach((el) => {
    if (!el.dataset.orig) el.dataset.orig = el.getAttribute('src') || '';
    if (url && /^data:image\/(png|svg\+xml);base64,/.test(url)) { el.src = url; el.alt = (negocio && negocio.nombre) || 'Logo'; el.removeAttribute('width'); el.removeAttribute('height'); el.style.height = '38px'; el.style.width = 'auto'; el.style.maxWidth = '120px'; el.style.objectFit = 'contain'; }
    else if (el.dataset.orig) { el.src = el.dataset.orig; el.style.height = ''; el.style.width = ''; }
  });
  if (negocio && negocio.nombre) document.querySelectorAll('.brand-name').forEach((el) => { el.innerHTML = '<b></b><small>Gestión</small>'; el.querySelector('b').textContent = negocio.nombre; });
}

function asistente() {
  estilos(); cerrar();
  const primera = !negocio, eq = Object.assign({ senior: 1, midsenior: 0, asistente: 0 }, (negocio && negocio.equipo) || {});
  const rubroActual = (negocio && negocio.rubro) || window.DOMINO_RUBRO || 'contador';
  const f = document.createElement('div'); f.id = 'es-fondo'; f.className = 'es-fondo'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'es-t');
  f.innerHTML = `<form class="es-caja" id="es-form" novalidate>
    <button type="button" class="es-x" id="es-x" aria-label="Cerrar">✕</button>
    <h2 id="es-t">${primera ? 'Bienvenido a DOMino Profesional' : 'Datos del estudio'}</h2>
    <p>${primera ? 'Antes de empezar, cuéntenos sobre su estudio. DOMino se ajusta a su profesión para mostrar solo lo que le sirve. Lo puede cambiar cuando quiera.' : 'Cambiar la profesión ajusta las palabras, las listas y las herramientas de todo el estudio. Los datos ya cargados no se borran.'}</p>
    <label class="es-l" for="es-nombre">Nombre del estudio</label>
    <input type="text" id="es-nombre" maxlength="60" autocomplete="organization" placeholder="Ej. Estudio Altamira" value="${esc((negocio && negocio.nombre) || '')}">
    <label class="es-l" for="es-logo">Logo del estudio (PNG o SVG, opcional)</label>
    <div class="es-logo-fila"><div class="es-logo-prev" id="es-logo-prev">${negocio && negocio.logo ? `<img src="${esc(negocio.logo)}" alt="Logo actual">` : '<span>Sin logo</span>'}</div>
    <div style="display:grid;gap:6px"><input type="file" id="es-logo" accept="image/png,image/svg+xml,.png,.svg"><button type="button" class="es-btn sec" id="es-logo-quitar"${negocio && negocio.logo ? '' : ' hidden'}>Quitar logo</button><small style="color:var(--text-muted,#a8a396)">Se muestra en el menú. Ideal: fondo transparente.</small></div></div>
    <label class="es-l" id="es-prof-l">¿A qué se dedica el estudio?</label>
    <div class="es-prof" role="radiogroup" aria-labelledby="es-prof-l">${perfiles().map((p) => `<label class="es-op"><input type="radio" name="es-rubro" value="${esc(p.id)}"${p.id === rubroActual ? ' checked' : ''}><span>${esc(p.nombre)}</span></label>`).join('')}</div>
    <label class="es-l">¿Cuántas personas trabajan en el estudio?</label>
    <p style="margin-bottom:8px">Es solo informativo. Los nombres y las tareas de cada persona se cargan después, en «Equipo».</p>
    <div style="display:grid;gap:8px">${PUESTOS.map(([k, t, d]) => `<div class="es-pu"><div><b>${esc(t)}</b><small>${esc(d)}</small></div><div class="es-cnt"><button type="button" data-k="${k}" data-d="-1" aria-label="Uno menos: ${esc(t)}">−</button><input type="number" id="es-n-${k}" min="0" max="99" inputmode="numeric" value="${Number(eq[k]) || 0}" aria-label="Cantidad: ${esc(t)}"><button type="button" data-k="${k}" data-d="1" aria-label="Uno más: ${esc(t)}">+</button></div></div>`).join('')}</div>
    <div class="es-err" id="es-err" role="alert"></div>
    <div class="es-fila"><button type="submit" class="es-btn" id="es-ok">${primera ? 'Guardar y empezar' : 'Guardar cambios'}</button><button type="button" class="es-btn sec" id="es-no">${primera ? 'Más tarde' : 'Cancelar'}</button></div>
  </form>`;
  document.body.appendChild(f); document.body.style.overflow = 'hidden';
  $('es-nombre').focus();
  $('es-no').onclick = cerrar; $('es-x').onclick = cerrar;
  f.addEventListener('click', (e) => { if (e.target === f) cerrar(); });
  f.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  f.querySelectorAll('.es-cnt button').forEach((b) => { b.onclick = () => { const i = $('es-n-' + b.dataset.k); i.value = Math.max(0, Math.min(99, (Number(i.value) || 0) + Number(b.dataset.d))); }; });
  let logoNuevo = (negocio && negocio.logo) || '';
  const prevLogo = () => { $('es-logo-prev').innerHTML = logoNuevo ? `<img src="${esc(logoNuevo)}" alt="Logo">` : '<span>Sin logo</span>'; $('es-logo-quitar').hidden = !logoNuevo; };
  $('es-logo-quitar').onclick = () => { logoNuevo = ''; $('es-logo').value = ''; prevLogo(); };
  $('es-logo').onchange = async () => {
    const file = $('es-logo').files[0]; $('es-err').textContent = ''; if (!file) return;
    try { logoNuevo = await prepararLogo(file); prevLogo(); }
    catch (e) { $('es-logo').value = ''; $('es-err').textContent = e.message || 'No se pudo leer el logo.'; }
  };
  $('es-form').onsubmit = async (ev) => {
    ev.preventDefault();
    const err = (m) => { $('es-err').textContent = m; };
    const nom = $('es-nombre').value.trim(), rubro = (f.querySelector('input[name="es-rubro"]:checked') || {}).value;
    if (nom.length < 3) return err('Escriba el nombre del estudio.');
    if (!rubro) return err('Elija a qué se dedica el estudio.');
    const equipo = {}; PUESTOS.forEach(([k]) => { equipo[k] = Math.max(0, Math.min(99, Math.floor(Number($('es-n-' + k).value) || 0))); });
    $('es-ok').disabled = true; $('es-ok').textContent = 'Guardando…';
    try {
      const datos = { nombre: nom, rubro, equipo, logo: logoNuevo || '', actualizado: serverTimestamp() };
      if (!negocio) datos.creado = serverTimestamp();
      await setDoc(doc(D().db, 'config', 'negocio'), datos, { merge: true });
      await setDoc(doc(D().db, 'config', 'publico'), { nombre: nom, rubro, actualizado: serverTimestamp() }, { merge: true });
      const cambioRubro = rubro !== window.DOMINO_RUBRO;
      negocio = Object.assign({}, negocio, datos); window.DOMINO_NEGOCIO = negocio;
      if (window.DOMINO_RUBRO_FIJAR) window.DOMINO_RUBRO_FIJAR(rubro);
      if (cambioRubro && !window.DOMINO_RUBRO_VISTA_PREVIA) { location.reload(); return; }
      cerrar(); pintarPanel(); aplicarMarca();
    } catch (e) { console.error(e); $('es-ok').disabled = false; $('es-ok').textContent = 'Guardar'; err('No se pudo guardar. Revise su conexión e intente de nuevo.'); }
  };
}

async function cuentasCreadas() {
  try { const s = await getDocs(collection(D().db, 'users')); const c = { senior: 0, midsenior: 0, asistente: 0 }; s.forEach((d) => { const u = d.data(); if (u.activo !== false && c[u.rol_jerarquia] !== undefined) c[u.rol_jerarquia]++; }); return c; }
  catch (e) { return null; }
}

async function pintarPanel() {
  const dest = $('hub-grupos'); if (!dest) return;
  estilos();
  let p = $('hub-estudio'); if (!p) { p = document.createElement('section'); p.id = 'hub-estudio'; p.setAttribute('aria-label', 'Su estudio'); dest.parentNode.insertBefore(p, dest); }
  const senior = D() && D().rol === 'senior';
  if (!cargado) { p.hidden = true; return; }
  p.hidden = false;
  if (!negocio) {
    p.innerHTML = `<h2>Falta cargar los datos del estudio</h2><p style="margin:0;color:var(--text-muted)">${senior ? 'Cargue el nombre, la profesión y el equipo para dejar todo listo.' : 'El Profesional Senior todavía no cargó los datos del estudio.'}</p>${senior ? '<div class="es-fila"><button type="button" class="es-btn" id="es-abrir">Cargar datos del estudio</button></div>' : ''}`;
  } else {
    const eq = negocio.equipo || {}, total = PUESTOS.reduce((n, [k]) => n + (Number(eq[k]) || 0), 0);
    p.innerHTML = `<h2>${esc(negocio.nombre)}</h2><div class="es-chips"><span class="es-chip">${esc(nombreProfesion(negocio.rubro))}</span>${PUESTOS.filter(([k]) => Number(eq[k]) > 0).map(([k]) => `<span class="es-chip">${Number(eq[k])} ${esc(NOMBRE_PUESTO[k])}</span>`).join('')}</div>
    <p id="es-cuentas" style="margin:10px 0 0;color:var(--text-muted)" hidden></p>
    ${senior ? '<div class="es-fila"><button type="button" class="es-btn sec" id="es-abrir">Datos del estudio</button></div>' : ''}`;
    if (senior && total > 0) cuentasCreadas().then((c) => {
      const el = $('es-cuentas'); if (!el || !c) return;
      const hechas = c.senior + c.midsenior + c.asistente;
      el.hidden = false; el.textContent = hechas >= total ? `Las ${total} personas del equipo ya tienen su cuenta.` : `Cuentas creadas: ${hechas} de ${total}. Sume al resto desde «Equipo».`;
    });
  }
  const a = $('es-abrir'); if (a) a.onclick = () => asistente();
}

async function iniciar() {
  if (!D() || !D().listo) return;
  if (!cargado) await leerNegocio();
  // Si la profesión guardada es otra que la de este navegador, se ajusta y se recarga una sola vez.
  if (cargado && negocio && negocio.rubro && negocio.rubro !== window.DOMINO_RUBRO && !window.DOMINO_RUBRO_VISTA_PREVIA) {
    let ya = false; try { ya = sessionStorage.getItem('dm_rl') === negocio.rubro; sessionStorage.setItem('dm_rl', negocio.rubro); } catch (e) {}
    if (!ya && window.DOMINO_RUBRO_FIJAR) { window.DOMINO_RUBRO_FIJAR(negocio.rubro); location.reload(); return; }
  }
  pintarPanel(); aplicarMarca();
  if (cargado && !negocio && D().rol === 'senior' && !window.__esOfrecido) { window.__esOfrecido = true; asistente(); }
}
window.addEventListener('domino:listo', iniciar);
window.addEventListener('domino:vista', (e) => { if (e.detail === 'hub') pintarPanel(); });
if (D() && D().listo) iniciar();
