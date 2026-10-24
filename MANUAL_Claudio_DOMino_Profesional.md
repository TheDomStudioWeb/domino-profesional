# Manual interno · DOMino Profesional (Hub de gestión)

Para que Claudio pueda explicar la app. Marca: DOMino (producto de The DOM Studio Web). Trato con el equipo del estudio: voseo.

## Qué es
DOMino Profesional es el Hub de gestión de un estudio profesional (contable, jurídico, notarial): ordena clientes, procesos, documentos, plazos y equipo en una sola aplicación que se instala en el celular o la PC. Al entrar, la primera pantalla es **Inicio**: resume lo urgente y da acceso a cada función en un toque.

## Niveles de usuario
- **Profesional Senior:** ve todo, incluido Equipo.
- **Profesional Mid Senior:** ve todo menos Equipo.
- **Asistente:** ve Inicio, Mis Tareas, Calendario, Herramientas y Chat. Solo trabaja con las tareas que tiene asignadas.
- **Cliente:** entra por el Portal del cliente (otra pantalla de ingreso). Envía documentos al estudio y descarga lo que el estudio le envía.

## Pantalla de Inicio
- Saludo y fecha.
- Cuatro cifras: vencidas, vencen hoy, en proceso y documentos por procesar (tocar una lleva a su detalle).
- «Para hoy y los próximos días»: hasta 8 tareas abiertas ordenadas por fecha, con la etiqueta Vencida, Hoy o Próxima.
- **Buscador de empresa** (arriba): escribir 3 letras del nombre o CUIT y tocar «Expediente» o «Buzón» en el resultado. Con Enter abre el expediente de la primera coincidencia. Es el camino más corto para llegar a una empresa.
- Menú lateral de 5 entradas: Inicio, Clientes, Tareas, Calendario y Chat (el asistente ve Mis Tareas en lugar de Clientes y Tareas).
- Accesos agrupados: Gestión del estudio, Documentos, Plazos y equipo, Herramientas.

## Cada función y cómo llegar
| Función | Para qué sirve | Cómo se llega |
|---|---|---|
| Indicadores y prioridades | Las cifras y la lista de Inicio reemplazan al antiguo Centro de Comando. Tocar «Documentos pendientes» abre la lista para descargar y pasar a revisión. | Inicio |
| Mi Cartera | Alta de clientes (nombre, CUIT, correo del cliente), activar y desactivar. Filtro: activas, inactivas o todas. | Clientes > Administrar cartera |
| Expedientes | Elegir una empresa (con buscador por nombre o CUIT) y ver sus procesos. Muestra cuántos procesos abiertos y documentos por procesar tiene cada una. | Menú > Clientes |
| Expediente de una empresa | Procesos activos; «+ Asignar Tarea» (descripción, vencimiento, área); cambiar el estado de cada tarea; ver documentos de la tarea. | Expedientes > empresa |
| Buzón documental | Cargar documentos recibidos por otros medios (se guarda el archivo), enviar documentación al cliente (VEP, balance, recibo, comunicación) y ver el historial con filtros por fecha, área, estado y asignación. Se puede asignar cada documento a una tarea. | Inicio > Buzón documental, o desde el expediente |
| Bandeja Táctica | Todas las tareas del estudio en columnas por estado. | Menú > Tareas |
| Mis Tareas | Lo asignado a cada asistente, por estado. | Inicio > Mis Tareas |
| Calendario | Vencimientos del mes, día por día; tocar un día muestra sus tareas. | Menú > Calendario |
| Chat interno | Mensajes del equipo con menciones (@nombre). El Senior puede limpiar el historial. | Inicio > Chat interno |
| Equipo | Lista de personas con acceso y su nivel (solo Senior). | Inicio > Equipo |
| Portal del cliente | Pantalla del cliente para subir documentos y descargar lo que le envió el estudio. | Inicio > Portal del cliente |

## Flujo de estados de una tarea
Pendiente de Procesar → En Revisión o Solicitar Información → En Proceso → Procesado/Liquidado → Proceso Completo/Finalizado.
Al pasar a «En Proceso» se elige a quién se asigna y el vencimiento.

## Herramientas del estudio
Funcionan en el dispositivo; no guardan ni envían lo que se carga.
1. **Validador de CUIT / CUIL:** controla el dígito verificador y dice qué tipo de persona indica el prefijo. No confirma que la persona esté inscripta.
2. **Calculadora de IVA:** de neto a total o de total a neto, con 21 %, 10,5 %, 27 % o exento.
3. **Hoja unificada A4:** pone frente y dorso de un documento en una sola hoja; se guarda como imagen o se imprime.

## Qué responder ante dudas frecuentes
- «No veo Mi Cartera»: depende del nivel; los asistentes no la ven.
- «Un documento no se descarga»: puede haberse cargado antes de esta versión sin archivo adjunto (aparece «Sin archivo adjunto»). Hay que volver a subirlo.
- «El cliente no ve su empresa»: el correo con el que entra tiene que coincidir con el que se cargó al dar de alta la empresa.

## Datos técnicos mínimos
- Conexión: Firebase (ingreso, base de datos y archivos). Si no hay conexión, la app muestra la última versión guardada de las pantallas, pero los datos requieren internet.
- Firma de pie: Desarrollado por The DOM Studio Web · WhatsApp 261-3431216 · thedomstudioweb@gmail.com.

## Pendiente de confirmar
- Reglas de seguridad de Firebase: se deben revisar en la consola (la configuración del cliente es pública por diseño; lo que protege los datos son esas reglas).


## Equipo: sumar personas y cambiar niveles (solo Profesional Senior)
- Se entra desde Inicio > Plazos y equipo > Equipo.
- **Agregar una persona:** completar nombre, correo y nivel, y tocar «Agregar y enviar acceso». La persona recibe un correo y elige su propia primera clave. Nadie más conoce esa clave.
- **Cambiar el nivel** de alguien: elegir otro nivel en la lista. Se aplica la próxima vez que entre. No se puede cambiar el propio nivel, y siempre tiene que quedar un Profesional Senior.
- **Reenviar acceso:** si la persona no recibió el correo o olvidó su clave.
- **Dar de baja / Reactivar:** quien está de baja no puede entrar, pero su historial se conserva.
- **Clientes:** en Clientes > Administrar cartera, cada cliente con correo tiene el botón «Enviar acceso», que le manda el correo para crear su clave del portal.
- Si el correo no llega, revisar la carpeta de no deseados.
