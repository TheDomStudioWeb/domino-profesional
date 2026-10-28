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
4. **Unificador de archivos en PDF:** une fotos (JPG, PNG), PDF, Word (.docx) y Excel (.xlsx, .xls, .csv) en un solo PDF, en el orden que se elija (flechas arriba/abajo, quitar, girar fotos). También permite sacar una foto con la cámara del celular. Se arma en el dispositivo: no se sube nada. Solo para el personal del estudio (Senior, Mid Senior y Asistente), no para clientes.
   - Los PDF se copian tal cual. Las fotos se acomodan una por hoja. Word y Excel se convierten: se conservan texto, títulos, listas, tablas e imágenes; se pierden colores, encabezados, formatos especiales, fórmulas y gráficos. Los símbolos raros y emojis aparecen como «?».
   - No se pueden unir: PowerPoint, ZIP/RAR, audio, video ni Word antiguo (.doc). Se avisa por archivo y conviene exportarlos a PDF desde su programa.
   - Al terminar: Guardar (descarga) o Compartir (menú del celular). Todavía no se guarda directo en el expediente: se descarga y se sube al buzón o a la carpeta del cliente.

## Qué responder ante dudas frecuentes
- «No veo Mi Cartera»: depende del nivel; los asistentes no la ven.
- «Un documento no se descarga»: puede haberse cargado antes de esta versión sin archivo adjunto (aparece «Sin archivo adjunto»). Hay que volver a subirlo.
- «El cliente no ve su empresa»: el correo con el que entra tiene que coincidir con el que se cargó al dar de alta la empresa.

## Datos técnicos mínimos
- Conexión: Firebase (ingreso, base de datos y archivos). Si no hay conexión, la app muestra la última versión guardada de las pantallas, pero los datos requieren internet.
- Firma de pie: Desarrollado por The DOM Studio Web · WhatsApp 261-3431216 · thedomstudioweb@gmail.com.

## Pendiente de confirmar
- Reglas de seguridad de Firebase: el archivo `firestore.rules` del repositorio es la versión vigente; se publican a mano en la consola de Firebase (Firestore > Reglas > Publicar).


## Equipo: sumar personas y cambiar niveles (solo Profesional Senior)
- Se entra desde Inicio > Plazos y equipo > Equipo.
- **Agregar una persona:** completar nombre, correo y nivel, y tocar «Agregar y enviar acceso». La persona recibe un correo y elige su propia primera clave. Nadie más conoce esa clave.
- **Cambiar el nivel** de alguien: elegir otro nivel en la lista. Se aplica la próxima vez que entre. No se puede cambiar el propio nivel, y siempre tiene que quedar un Profesional Senior.
- **Reenviar acceso:** si la persona no recibió el correo o olvidó su clave.
- **Dar de baja / Reactivar:** quien está de baja no puede entrar, pero su historial se conserva.
- **Clientes:** en Clientes > Administrar cartera, cada cliente con correo tiene el botón «Enviar acceso», que le manda el correo para crear su clave del portal.
- Si el correo no llega, revisar la carpeta de no deseados.

## Accesos al portal por empresa: varias personas con permisos distintos
- Se entra desde Clientes > Administrar cartera, botón **Accesos** de cada empresa.
- **El titular** es el correo cargado en la ficha de la empresa. Siempre puede enviar documentos y ver y descargar lo que entrega el estudio.
- **Agregar una persona de la empresa:** nombre, correo y dos permisos: «Puede enviar documentos al estudio» y «Puede ver y descargar lo que entrega el estudio». Al agregarla recibe un correo para crear su propia clave.
- **Cambiar permisos:** tildar o destildar en la lista; se guarda al instante.
- **Dar de baja / Reactivar:** quien está de baja deja de entrar al portal de esa empresa.
- **Reenviar acceso:** si no le llegó el correo.
- Una misma persona puede estar en varias empresas, cada una con permisos distintos; en el portal elige la empresa arriba.
- Si el usuario no tiene un permiso, el portal oculta esa parte y le avisa que se lo pida al estudio.
- Los correos se guardan siempre en minúsculas.

## 5. Perfil por rubro
- DOMino Profesional siempre habla de **clientes**. La única excepción son los estudios de arquitectura, donde el cliente se llama **comitente**.
- Cada copia trabaja con **un rubro**, que se fija en `modulos.js` (línea `RUBRO`): `contador` (el de esta copia), `arquitecto` o `general` (base para rubros nuevos).
  - **Contador:** el Hub completo (clientes, tareas, buzón documental, documentos pendientes, portal del cliente, calendario de vencimientos, validador de CUIT, calculadora de IVA, etc.).
  - **Arquitecto:** igual que el estudio contable, pero dice **comitentes** en todas las pantallas y no muestra las herramientas fiscales (CUIT, IVA).
- Las veterinarias usan **DOMino Veterinaria** (mascotas y dueños) y los gimnasios y centros de bienestar usan **DOMino Bienestar** (socios). Son apps aparte, con su propio repositorio.
- Para **ver cómo queda otro rubro** sin cambiar nada, agregar `?rubro=arquitecto` al final de la dirección del Hub. Solo cambia la vista de ese navegador.
- El rubro **ordena lo que se ve, no da ni quita permisos**: los permisos los siguen controlando los roles (Senior, Mid Senior, Asistente) y las reglas de seguridad.
- Cada estudio tiene **su propia copia y su propia base de datos**, así que un estudio nunca ve los datos de otro.

## 6. Funciones «Próximamente»
- La **gestión de documentos** (guardar y enviar archivos: Buzón documental, documentos pendientes, portal del cliente, adjuntar certificados) todavía **no está disponible** en esta versión, porque necesita el almacenamiento en la nube (Firebase Storage).
- Mientras no esté habilitada, el Hub la muestra con la etiqueta **«Próximamente»**, avisa si se la toca y **no deja cargar archivos**. Así nadie piensa que un documento quedó guardado cuando no es así.
- Siguen funcionando las herramientas que no guardan archivos: la hoja unificada A4 y el unificador de archivos en PDF (el resultado se descarga al teléfono o a la computadora).
- Se habilita cambiando `DOCUMENTOS` a `true` en `modulos.js`, cuando el almacenamiento esté activo y probado.


## Marca del negocio y pantalla de ingreso
- La pantalla de ingreso muestra solo el logo de DOMino.
- Dentro del Hub, el menú lateral muestra el logo y el nombre del estudio que contrata, no los de DOMino. Si todavía no se cargó el logo, se ve el de DOMino.
