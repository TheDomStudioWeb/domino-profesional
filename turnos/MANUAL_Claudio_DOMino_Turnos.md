# DOMino Turnos (Profesional) — manual interno para Claudio

Usalo para explicar la agenda de turnos de un estudio. **Siempre se habla de «clientes»** (en arquitectura, «comitentes»). Hablá en voseo con el equipo de Daniel y de usted con el equipo del estudio. Nunca des claves ni direcciones privadas.

## Qué es
Es el anexo de agenda de DOMino Profesional, para estudios que atienden con turno. Tiene tres partes:
1. **Página de reserva** (para los clientes): reservan solos desde el celular en pocos pasos.
2. **Agenda del personal** (panel): ver, confirmar, mover y cancelar turnos; cargar uno nuevo.
3. **Avisos de mañana**: lista de turnos del día siguiente con el mensaje de WhatsApp ya escrito.

Los datos viven en una planilla de Google del propio estudio. No tiene costo de servidor. Si el estudio crece mucho se puede pasar a un servidor propio, que sí tiene costo permanente y se avisa antes.

## Cómo reserva el cliente
1. Recibe el enlace (por WhatsApp, Instagram o QR).
2. Elige el servicio, el día, la hora y el profesional.
3. Carga nombre, teléfono, correo (opcional) y tilda la autorización para que lo contacten.
4. Recibe un enlace propio para ver o cancelar su reserva (hasta unas horas antes; el plazo lo define el estudio).
- En **modo solicitud** la reserva queda «Por confirmar» hasta que recepción la confirma. En modo inmediato queda confirmada.
- Si dos clientes piden el mismo horario a la vez, entra uno solo; al otro se le pide elegir otro.
- No puede pedir más de 3 turnos por día con el mismo teléfono.

## Cómo trabaja el personal
Ingresa con correo y clave en la agenda (el ojito 👁 muestra la clave para ver si está bien escrita). Niveles:
- **Senior y Mid Senior:** ven toda la agenda, cargan y mueven turnos, y crean bloqueos (feriados, vacaciones).
- **Asistente:** ve toda la agenda, carga, confirma, mueve y cancela turnos; no crea bloqueos.
- **Profesional:** ve y maneja solo su propia agenda.

Pantallas (barra de abajo): **Agenda** (turnos del día; el número rojo indica solicitudes por confirmar), **Nuevo** (cargar un turno en pocos toques), **Avisos** (turnos de mañana), **Más** (enlace de reserva y bloqueos).

Estados del turno: Por confirmar → Confirmado → En sala («Llegó») → Atendido. También: Cancelado, No vino (solo después de la hora) y Reprogramado. Un turno nunca se borra: queda en el historial.

## Ficha del cliente
- En el detalle de cada turno hay un botón **«Vincular con la ficha»**: busca en el Hub las fichas de clientes con el mismo teléfono o un nombre parecido. Se elige «Es esta persona» o «Crear una ficha nueva con estos datos».
- Al vincular, los otros turnos del mismo teléfono que no tenían ficha quedan vinculados también.
- **«Historial del cliente»** muestra todos sus turnos: cuántos fueron, cuántos atendidos y cuántas veces no vino.
- En la lista de clientes del Hub, cada tarjeta tiene un botón **«Turnos»** que abre ese historial, y la ficha tiene **«Ver turnos de este cliente»**.
- Para vincular hay que haber ingresado antes al Hub de DOMino Profesional (la agenda tiene su propio ingreso, aparte).
- Si el turno está a nombre de **otra persona** (un familiar o un empleado, por ejemplo), antes de vincular el panel pide aclarar la **relación** con el cliente. La ficha muestra al **Cliente** y, aparte, **Familiares y otros** con su relación.
- La ficha guarda nombre, teléfono, correo y familiares; no guarda datos sensibles.

## Avisos de mañana
- Cada fila abre WhatsApp con el mensaje armado; una persona lo envía. Es gratis.
- Si el cliente dio su correo y aceptó, el sistema también le manda un recordatorio automático por correo a las 18:00 del día anterior (gratis, hasta unos 100 por día).
- Un WhatsApp automático (sin tocar nada) existe pero tiene costo mensual permanente.

## Lo que hay que decir con honestidad
- Cada acción tarda unos 3 segundos: es el límite del plan gratuito de Google.
- La planilla de Google no cifra los datos por sí sola: por eso se guarda lo mínimo y **nada clínico**.
- Los costos existen: instalación y mantenimiento los define Daniel por proyecto (no los cotices); todo puede personalizarse.

## Qué responder
- «No me llega el correo»: el cliente puede no haber dado correo o no haber tildado la autorización; revisar spam.
- «No puedo cancelar»: pasó el plazo; que llame al estudio.
- «No veo horarios»: el profesional no atiende ese día, hay un bloqueo, o faltan menos horas que la anticipación mínima.
- «Se me cerró la sesión»: la sesión dura 30 días; volver a ingresar. Tras 5 claves incorrectas se bloquea 10 minutos.
- «Cambié algo en la planilla y no se ve»: tarda hasta 60 segundos.

## Datos técnicos mínimos
- Servicio: Google Apps Script (`turnos/apps-script/Code.gs`) sobre una planilla con las hojas config, recursos, servicios, horarios, bloqueos, turnos, slots y usuarios. La implementación tiene que quedar con **Ejecutar como: yo** y **Acceso: cualquier persona**; si no, la app no puede conectarse.
- Páginas: `turnos/reserva.html` (pública) y `turnos/panel.html` (personal). La dirección del servicio está en `turnos/config.js`.

## Widget de turnos del día
- Muestra en el teléfono: el próximo turno, cuántos turnos hay hoy, cuántas solicitudes están por confirmar, los turnos de hoy y las novedades de las últimas 48 horas.
- Se ve dentro del launcher (con la clave del widget) o abriendo `widget.html` y agregándola a la pantalla de inicio. Se actualiza sola cada minuto.
- La clave se genera ejecutando `prepararWidget` en Apps Script. El widget no muestra teléfonos ni correos.
