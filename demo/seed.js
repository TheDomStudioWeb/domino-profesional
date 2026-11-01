// Datos inventados de la demostración de DOMino Profesional (estudio contable ficticio).
const dia = 86400000, ahora = Date.now();
const iso = (n) => new Date(ahora + n * dia).toISOString().split('T')[0];
const es = (n) => new Date(ahora + n * dia).toLocaleDateString('es-ES');
const ts = (n) => ({ __t: ahora + n * dia });
const C = (id, nombre, cuit, mail) => ['clients/' + id, { nombre_empresa: nombre, cuit, estado: 'activo', fecha_creacion: new Date(ahora - 90 * dia).toISOString(), usuario_id: mail }];
const T = (id, cli, titulo, venc, resp, est) => ['tasks/' + id, { cliente_id: cli, titulo, vencimiento: iso(venc), responsable: resp, estado: est }];
const D = (id, cli, cat, arch, f, est) => ['documents/' + id, { cliente_id: cli, categoria: cat, nombre_archivo: arch, fecha_subida: es(f), estado: est, url_descarga: '#' }];
const lista = [
  ['config/negocio', { nombre: 'Estudio Altamira', rubro: 'contador', equipo: { senior: 1, midsenior: 1, asistente: 2 }, logo: '', creado: ts(-60) }],
  ['config/publico', { nombre: 'Estudio Altamira', rubro: 'contador' }],
  ['users/direccion@demo.com', { email: 'direccion@demo.com', nombre_display: 'Laura Altamira', rol_jerarquia: 'senior', activo: true }],
  ['users/profesional@demo.com', { email: 'profesional@demo.com', nombre_display: 'Marcos Ferreyra', rol_jerarquia: 'midsenior', activo: true }],
  ['users/asistente@demo.com', { email: 'asistente@demo.com', nombre_display: 'Asistente 1', rol_jerarquia: 'asistente', activo: true }],
  C('c1', 'Panadería La Espiga S.R.L.', '30-71234567-8', 'laespiga@demo.com'),
  C('c2', 'Distribuidora Cuyo Norte S.A.', '30-70987654-3', 'cuyonorte@demo.com'),
  C('c3', 'Taller Mecánico Ruiz', '20-28456123-5', ''),
  C('c4', 'Bodega Los Álamos', '30-71555888-1', ''),
  C('c5', 'Clínica Dental Sonrisa', '30-70222333-9', ''),
  C('c6', 'Ferretería El Tornillo', '20-30111222-4', ''),
  T('t1', 'c1', 'IVA mensual', 0, 'Asistente 1', 'Pendiente de Procesar'),
  T('t2', 'c2', 'Liquidación de sueldos', 0, 'Asistente 2', 'En Proceso'),
  T('t3', 'c3', 'Monotributo: recategorización', 3, 'Asistente 1', 'Pendiente de Procesar'),
  T('t4', 'c4', 'Balance anual', 12, 'Profesional', 'En Proceso'),
  T('t5', 'c5', 'Ingresos Brutos', 1, 'Asistente 1', 'En Revisión'),
  T('t6', 'c6', 'Declaración de Ganancias', 20, 'Profesional', 'Pendiente de Procesar'),
  T('t7', 'c1', 'Alta de empleado', -2, 'Asistente 2', 'Proceso Completo/Finalizado'),
  T('t8', 'c2', 'Presentación F.931', -4, 'Asistente 1', 'Proceso Completo/Finalizado'),
  D('d1', 'c1', 'Impuestos', 'Facturas_compras_octubre.pdf', 0, 'Pendiente de Procesar'),
  D('d2', 'c2', 'RRHH', 'Alta_empleado_Gomez.pdf', -1, 'Pendiente de Procesar'),
  D('d3', 'c3', 'Impuestos', 'Constancia_monotributo.pdf', -2, 'En Revisión'),
  D('d4', 'c4', 'Contabilidad', 'Libro_diario_septiembre.xlsx', -3, 'En Proceso'),
  D('d5', 'c5', 'Legal', 'Contrato_alquiler_consultorio.pdf', -5, 'Proceso Completo/Finalizado'),
  ['mensajes/m1', { texto: 'Buen día equipo. Hoy vence el IVA de La Espiga, lo tomo yo.', autor_uid: 'demo-asistente@demo.com', nombre_display: 'Asistente 1', rol: 'asistente', fecha_timestamp: ts(-0.1) }],
  ['mensajes/m2', { texto: 'Perfecto. Cuando termines, avisame y lo reviso antes de presentar.', autor_uid: 'demo-profesional@demo.com', nombre_display: 'Marcos Ferreyra', rol: 'midsenior', fecha_timestamp: ts(-0.08) }],
  ['entregas/e1', { cliente_id: 'c1', categoria: 'Balance', nombre_archivo: 'Balance_2025_LaEspiga.pdf', fecha_envio: es(-6), url_descarga: '#', enviado_por: 'Profesional', fecha_timestamp: ts(-6) }],
  ['accesos_portal/laespiga@demo.com__c1', { email: 'laespiga@demo.com', cliente_id: 'c1', enviar_documentos: true, ver_entregas: true }]
];
export const SEED = {
  id: 'profesional',
  users: [
    { email: 'direccion@demo.com', nombre_display: 'Laura Altamira' },
    { email: 'profesional@demo.com', nombre_display: 'Marcos Ferreyra' },
    { email: 'asistente@demo.com', nombre_display: 'Asistente 1' }
  ],
  docs: Object.fromEntries(lista)
};
