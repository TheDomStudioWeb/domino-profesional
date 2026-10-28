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

  // ── Palabras del vínculo con la persona atendida (cliente, comitente, paciente…) ──
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const terminos = (s, p) => ({
    clientes: cap(p), empresa: cap(s), desconocido: cap(s) + ' sin ficha', cartera_activos: cap(p) + ' activos', cartera_inactivos: cap(p) + ' inactivos', expedientes: cap(p),
    ayuda_expediente: 'Elegí el ' + s + ' para ver sus procesos y documentos.', buscar_ayuda_buzon: 'Elegí el ' + s + ' para cargar documentos recibidos o enviarle documentación.'
  });
  const reemp = (s, p) => [['clientes', p], ['cliente', s]];
  // Listas de las ventanas (áreas de trabajo, categorías de documento y tipos de documento enviado) propias de cada profesión.
  // Cada lista es [valor, texto]; la primera opción vacía de cada selector (o «todas») se conserva.
  const L = (...x) => x.map((v) => [v, v]);
  const PERFILES = {
    // Todo lo que tiene DOMino Profesional, sin módulos opcionales. Sirve de base para rubros nuevos.
    general: {
      nombre: 'General', modulos: {}, ocultar: [], orden: [], etiquetas: {}, textos: {}
    },
    // Estudio contable / profesional con clientes empresas y trámites con vencimiento.
    contador: {
      nombre: 'Contaduría', modulos: {}, ocultar: [], orden: [], etiquetas: {}, textos: {}
    },
    // Escribanía: escrituras, certificaciones e inscripciones. Sin calculadora de IVA.
    escribano: {
      nombre: 'Escribanía', modulos: {}, ocultar: ['iva'], orden: [], etiquetas: {},
      textos: Object.assign(terminos('cliente', 'clientes'), { kpi_listos: 'Trámites listos' }),
      selects: {
        'task-responsable': L('Escrituras', 'Certificaciones', 'Inscripciones', 'Administración', 'Dirección'),
        'doc-category': [['Escrituras', 'Escrituras y poderes'], ['Certificaciones', 'Certificaciones y firmas'], ['Inscripciones', 'Inscripciones y registros'], ['Documentacion', 'Documentación del cliente']],
        'entrega-categoria': [['Escritura', 'Escritura'], ['Certificado', 'Certificado'], ['Informe', 'Informe de dominio'], ['Comunicacion', 'Comunicación'], ['Otro', 'Otro']],
        'filtro-area': [['Escrituras', 'Escrituras'], ['Certificaciones', 'Certificaciones'], ['Inscripciones', 'Inscripciones'], ['Documentacion', 'Documentación']]
      }
    },
    // Abogacía: causas y expedientes, plazos y honorarios. Sin calculadora de IVA.
    abogado: {
      nombre: 'Abogacía', modulos: {}, ocultar: ['iva'], orden: [], etiquetas: {},
      textos: Object.assign(terminos('cliente', 'clientes'), { procesos: 'Causas y trámites', kpi_listos: 'Causas cerradas' }),
      selects: {
        'task-responsable': L('Causas y expedientes', 'Audiencias y plazos', 'Contratos', 'Honorarios', 'Dirección'),
        'doc-category': [['Escritos', 'Escritos y demandas'], ['Contratos', 'Contratos y acuerdos'], ['Pruebas', 'Pruebas y documentación'], ['Cedulas', 'Cédulas y notificaciones']],
        'entrega-categoria': [['Escrito', 'Escrito'], ['Contrato', 'Contrato'], ['Cedula', 'Cédula'], ['Comunicacion', 'Comunicación'], ['Otro', 'Otro']],
        'filtro-area': [['Escritos', 'Escritos'], ['Contratos', 'Contratos'], ['Pruebas', 'Pruebas'], ['Cedulas', 'Cédulas']]
      }
    },
    // Arquitectura: mismo funcionamiento que el estudio contable, pero el cliente se llama «comitente».
    // Las veterinarias usan DOMino Veterinaria y los gimnasios DOMino Bienestar (repositorios aparte).
    arquitecto: {
      nombre: 'Arquitectura',
      modulos: {}, ocultar: ['cuit', 'iva'], orden: [], etiquetas: {},
      textos: Object.assign(terminos('comitente', 'comitentes'), { kpi_listos: 'Procesos listos' }),
      // Cambia la palabra en toda la pantalla, también en lo que aparece después (listas, avisos, ventanas).
      reemplazos: reemp('comitente', 'comitentes'),
      selects: {
        'task-responsable': L('Proyecto', 'Dirección de obra', 'Habilitaciones y planos', 'Honorarios', 'Dirección'),
        'doc-category': [['Planos', 'Planos y proyecto'], ['Presupuestos', 'Pliegos y presupuestos'], ['Habilitaciones', 'Habilitaciones y permisos'], ['Contratos', 'Contratos de obra']],
        'entrega-categoria': [['Plano', 'Plano'], ['Presupuesto', 'Presupuesto'], ['Certificado', 'Certificado de obra'], ['Comunicacion', 'Comunicación'], ['Otro', 'Otro']],
        'filtro-area': [['Planos', 'Planos'], ['Presupuestos', 'Presupuestos'], ['Habilitaciones', 'Habilitaciones'], ['Contratos', 'Contratos']]
      }
    },
    // Psicología y psiquiatría: la persona atendida es el «paciente». Sin datos de empresa, CUIT ni IVA.
    psicologo: {
      nombre: 'Psicología / Psiquiatría', modulos: {}, ocultar: ['cuit', 'iva'], orden: [], etiquetas: {},
      textos: Object.assign(terminos('paciente', 'pacientes'), { procesos: 'Seguimiento', kpi_listos: 'Seguimientos listos' }),
      reemplazos: reemp('paciente', 'pacientes'),
      dom: [['#lbl-client-cuit', 'DNI / Identificador', '', ''], ['#client-cuit', '', 'Ej. 30123456', '']],
      selects: {
        'task-responsable': L('Admisión', 'Seguimiento de pacientes', 'Facturación a obras sociales', 'Administración', 'Dirección'),
        'doc-category': [['Consentimientos', 'Consentimientos'], ['Informes', 'Informes'], ['Documentacion', 'Documentación del paciente'], ['Facturacion', 'Facturación y órdenes']],
        'entrega-categoria': [['Informe', 'Informe'], ['Certificado', 'Certificado'], ['Constancia', 'Constancia de asistencia'], ['Comunicacion', 'Comunicación'], ['Otro', 'Otro']],
        'filtro-area': [['Consentimientos', 'Consentimientos'], ['Informes', 'Informes'], ['Documentacion', 'Documentación'], ['Facturacion', 'Facturación']]
      }
    }
  };
  window.DOMINO_PERFILES = Object.keys(PERFILES).filter((k) => k !== 'general').map((k) => ({ id: k, nombre: PERFILES[k].nombre }));

  // Qué profesión usa esta copia: ?rubro=… (vista previa) > la guardada en el navegador (viene de config/publico) > RUBRO.
  // Vista previa de otro rubro sin tocar la copia: ?rubro=arquitecto (solo cambia lo que se ve en ese navegador).
  const PROYECTO = 'domino-profesional';
  let elegido = RUBRO, guardado = '', porUrl = false;
  try { guardado = localStorage.getItem('domino_rubro') || ''; if (guardado && PERFILES[guardado]) elegido = guardado; } catch (e) {}
  try { const q = new URLSearchParams(location.search).get('rubro'); if (q && PERFILES[q]) { elegido = q; porUrl = true; } } catch (e) {}
  window.DOMINO_RUBRO_VISTA_PREVIA = porUrl;
  window.DOMINO_RUBRO_FIJAR = (r) => { try { if (r && PERFILES[r]) localStorage.setItem('domino_rubro', r); } catch (e) {} };
  // Primera vez en este navegador (por ejemplo, el portal del cliente): se consulta la ficha pública del negocio, sin iniciar sesión.
  if (!guardado && !porUrl) {
    fetch('https://firestore.googleapis.com/v1/projects/' + PROYECTO + '/databases/(default)/documents/config/publico').then((r) => r.ok ? r.json() : null).then((j) => {
      const r = j && j.fields && j.fields.rubro && j.fields.rubro.stringValue;
      try { localStorage.setItem('domino_rubro', r && PERFILES[r] ? r : RUBRO); } catch (e) {}
      if (r && PERFILES[r] && r !== elegido) location.reload();
    }).catch(() => { try { localStorage.setItem('domino_rubro', RUBRO); } catch (e) {} });
  }
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
  const aplicarSelects = () => {
    Object.entries(P.selects || {}).forEach(([id, lista]) => {
      const sel = document.getElementById(id); if (!sel) return;
      const fijas = [...sel.options].filter((o) => o.value === '' || o.value === 'todas' || o.value === 'todos');
      sel.innerHTML = '';
      fijas.forEach((o) => sel.appendChild(o));
      lista.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; sel.appendChild(o); });
    });
  };
  const aplicarTodo = () => { aplicarDom(); aplicarSelects(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicarTodo); else aplicarTodo();
  setTimeout(aplicarTodo, 800);
})();
