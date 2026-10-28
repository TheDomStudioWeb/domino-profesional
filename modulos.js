// DOMino Profesional · Perfil por rubro.
// Cada copia de DOMino (una por cliente) trabaja con UN rubro. Para cambiarlo, modificar RUBRO.
// El perfil decide qué grupos y herramientas muestra el Hub, cómo se llaman las cosas y qué módulos opcionales trae.
// OJO: el rubro ordena lo que se ve; NO da ni quita permisos (eso lo controlan los roles y las reglas de Firestore).
(function () {
  const RUBRO = 'contador';
  // Marca del negocio que contrata DOMino. En el Hub se muestra SU logo (imagenes/logo-cliente.png) y su nombre, no los de DOMino.
  // Si el archivo del logo no existe, se ve el de DOMino. Lo completa alta/preparar-cliente.js.
  const CLIENTE = { nombre: '', logo: 'imagenes/logo-cliente.png' };
  // Gestión de documentos (guardar y enviar archivos). Necesita Firebase Storage activo en el proyecto del cliente.
  // Mientras esté en false, el Hub muestra «Próximamente» y no deja cargar documentos. Pasar a true cuando Storage esté listo y probado.
  const DOCUMENTOS = false;

  const PERFILES = {
    // Todo lo que tiene DOMino Profesional, sin módulos opcionales. Sirve de base para rubros nuevos.
    general: {
      nombre: 'General', modulos: {}, ocultar: [], orden: [], etiquetas: {}, textos: {}
    },
    // Estudio contable / profesional con clientes empresas y trámites con vencimiento.
    contador: {
      nombre: 'Contador', modulos: {}, ocultar: [], orden: [], etiquetas: {}, textos: {}
    },
    // Arquitectura: mismo funcionamiento que el estudio contable, pero el cliente se llama «comitente».
    // Las veterinarias usan DOMino Veterinaria y los gimnasios DOMino Bienestar (repositorios aparte).
    arquitecto: {
      nombre: 'Arquitecto',
      modulos: {}, ocultar: ['cuit', 'iva'], orden: [], etiquetas: {},
      textos: { clientes: 'Comitentes', empresa: 'Comitente', desconocido: 'Comitente sin ficha', cartera_activos: 'Comitentes activos', cartera_inactivos: 'Comitentes inactivos', expedientes: 'Comitentes', ayuda_expediente: 'Elegí el comitente para ver sus procesos y documentos.', buscar_ayuda_buzon: 'Elegí el comitente para cargar documentos recibidos o enviarle documentación.', kpi_listos: 'Procesos listos' },
      // Cambia la palabra en toda la pantalla, también en lo que aparece después (listas, avisos, ventanas).
      reemplazos: [['clientes', 'comitentes'], ['cliente', 'comitente']]
    }
  };

  // Vista previa de otro rubro sin tocar la copia: ?rubro=arquitecto (solo cambia lo que se ve en ese navegador).
  let elegido = RUBRO;
  try { const q = new URLSearchParams(location.search).get('rubro'); if (q && PERFILES[q]) elegido = q; } catch (e) {}
  const P = PERFILES[elegido];
  window.DOMINO_RUBRO = elegido;
  window.DOMINO_PERFIL = P;
  window.DOMINO_MODULOS = Object.assign({ turnos: false }, P.modulos);
  window.DOMINO_FUNC = { documentos: DOCUMENTOS };
  window.DOMINO_T = (k, porDefecto) => (P.textos && P.textos[k]) || porDefecto;
  // Reemplaza los textos fijos del perfil cuando la página ya está lista
  const aplicarDom = () => {
    (P.dom || []).forEach(([sel, txt, ph, aria]) => {
      document.querySelectorAll(sel).forEach((el) => { if (txt) el.textContent = txt; if (ph) el.setAttribute('placeholder', ph); if (aria) el.setAttribute('aria-label', aria); });
    });
    document.querySelectorAll('h1').forEach((h) => { if (P.textos && P.textos.herr_titulo && /^Herramientas del estudio$/i.test(h.textContent.trim())) h.textContent = P.textos.herr_titulo; if (P.textos && P.textos.equipo_titulo && /^Equipo del estudio$/i.test(h.textContent.trim())) h.textContent = P.textos.equipo_titulo; });
  };
  // Reemplazo de palabras en toda la pantalla (por ejemplo cliente → comitente). Respeta mayúsculas.
  if (P.reemplazos && P.reemplazos.length) {
    const reglas = P.reemplazos.map(([de, a]) => [new RegExp('\\b' + de + '\\b', 'gi'), a]);
    const cambiar = (t) => reglas.reduce((x, [re, a]) => x.replace(re, (m) => m[0] === m[0].toUpperCase() ? (m === m.toUpperCase() && m.length > 1 ? a.toUpperCase() : a[0].toUpperCase() + a.slice(1)) : a), t);
    const ATR = ['placeholder', 'aria-label', 'title'];
    const recorrer = (raiz) => {
      if (!raiz) return;
      if (raiz.nodeType === 3) { const n = cambiar(raiz.nodeValue); if (n !== raiz.nodeValue) raiz.nodeValue = n; return; }
      if (raiz.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(raiz.nodeName) && raiz.nodeName !== 'INPUT') return;
      ATR.forEach((k) => { const v = raiz.getAttribute && raiz.getAttribute(k); if (v) { const n = cambiar(v); if (n !== v) raiz.setAttribute(k, n); } });
      if (raiz.nodeName === 'INPUT') return;
      raiz.childNodes.forEach(recorrer);
    };
    const iniciar = () => {
      recorrer(document.body); document.title = cambiar(document.title);
      new MutationObserver((ms) => ms.forEach((m) => { if (m.type === 'characterData') recorrer(m.target); else m.addedNodes.forEach(recorrer); })).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
    const alerta = window.alert.bind(window), confirma = window.confirm.bind(window);
    window.alert = (m) => alerta(cambiar(String(m))); window.confirm = (m) => confirma(cambiar(String(m)));
  }
  window.DOMINO_CLIENTE = CLIENTE;
  // Logo y nombre del negocio en el menú lateral y en el portal; sin logo cargado queda la marca DOMino.
  const aplicarMarca = () => {
    const img = new Image();
    img.onload = () => {
      document.querySelectorAll('.brand-icon, [data-marca-logo]').forEach((el) => { el.src = CLIENTE.logo; el.alt = CLIENTE.nombre || 'Logo'; el.removeAttribute('width'); el.removeAttribute('height'); el.style.height = el.classList.contains('brand-icon') ? '38px' : ''; el.style.width = 'auto'; el.style.maxWidth = '120px'; el.style.objectFit = 'contain'; });
      if (!CLIENTE.nombre) document.querySelectorAll('.brand-name').forEach((el) => { el.style.display = 'none'; });
    };
    img.src = CLIENTE.logo;
    if (CLIENTE.nombre) document.querySelectorAll('.brand-name').forEach((el) => { el.innerHTML = '<b></b><small>Gestión</small>'; el.querySelector('b').textContent = CLIENTE.nombre; });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicarMarca); else aplicarMarca();
  if (P.dom) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicarDom); else aplicarDom(); setTimeout(aplicarDom, 800); }
})();
