// DOMino Profesional · Perfil por rubro.
// Cada copia de DOMino (una por cliente) trabaja con UN rubro. Para cambiarlo, modificar RUBRO.
// El perfil decide qué grupos y herramientas muestra el Hub, cómo se llaman las cosas y qué módulos opcionales trae.
// OJO: el rubro ordena lo que se ve; NO da ni quita permisos (eso lo controlan los roles y las reglas de Firestore).
(function () {
  const RUBRO = 'veterinaria';
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
    // Veterinaria: dueños y mascotas, agenda de turnos, libreta sanitaria. Sin portal de documentos ni herramientas fiscales.
    veterinaria: {
      nombre: 'Veterinaria',
      modulos: { turnos: true },
      ocultar: ['portal', 'pendientes', 'cuit', 'iva'],
      orden: ['Agenda y turnos', 'Gestión del estudio', 'Plazos y equipo', 'Documentos', 'Herramientas'],
      etiquetas: {
        expedientes: { t: 'Dueños y mascotas', d: 'Fichas de dueños, mascotas, libretas sanitarias y turnos. Desde acá también se da de alta o baja a un dueño.' },
        kanban: { t: 'Seguimientos', d: 'Todos los seguimientos y tareas, por estado.' },
        tareas: { t: 'Mis seguimientos', d: 'Lo que tenés asignado, por estado.' },
        buzon: { t: 'Documentos del dueño', d: 'Cargar certificados, estudios y recetas, o enviarlos al dueño.' },
        calendario: { t: 'Calendario', d: 'Vencimientos y controles del mes, día por día.' }
      },
      textos: {
        gestion: 'Gestión de la veterinaria', clientes: 'Dueños y mascotas', cartera_activos: 'Dueños activos', cartera_inactivos: 'Dueños inactivos',
        expedientes: 'Dueños y mascotas', ayuda_expediente: 'Elegí el dueño para ver sus mascotas, turnos y seguimientos.', procesos: 'Seguimientos activos'
      }
    }
  };

  // Vista previa de otro rubro sin tocar la copia: ?rubro=contador (solo cambia lo que se ve en ese navegador).
  let elegido = RUBRO;
  try { const q = new URLSearchParams(location.search).get('rubro'); if (q && PERFILES[q]) elegido = q; } catch (e) {}
  const P = PERFILES[elegido];
  window.DOMINO_RUBRO = elegido;
  window.DOMINO_PERFIL = P;
  window.DOMINO_MODULOS = Object.assign({ turnos: false }, P.modulos);
  window.DOMINO_FUNC = { documentos: DOCUMENTOS };
  window.DOMINO_T = (k, porDefecto) => (P.textos && P.textos[k]) || porDefecto;
})();
