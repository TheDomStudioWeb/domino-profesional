# DOMino Turnos — backend (versión 0.2, borrador de prueba)

Datos de **ejemplo** (Veterinaria Ejemplo). No es un negocio real.

## Qué hay
- `apps-script/Code.gs` y `appsscript.json`: el servicio (Google Apps Script).
- `Planilla_ejemplo_veterinaria.xlsx`: la planilla con las 8 hojas y datos de ejemplo.
- `test/`: pruebas automáticas en Node (`node test/run.js`), con una simulación de los servicios de Google.

## Puesta en marcha (una vez por negocio, ~10 minutos)
1. Subir la planilla a Google Drive y abrirla como Google Sheets.
2. Extensiones → Apps Script. Pegar `Code.gs` y, en Configuración del proyecto, activar «mostrar appsscript.json» y pegar el de esta carpeta.
3. Ejecutar `protegerClaves` (autoriza los permisos) y después `configurarDisparador` (aviso diario por correo a las 18:00).
4. Implementar → Nueva implementación → Aplicación web. Ejecutar como: **yo**. Acceso: **cualquier persona**. Copiar la dirección `/exec`.
5. Cambiar las claves de ejemplo de la hoja `usuarios` (se protegen solas al primer ingreso).

## Cómo se habla con el servicio
Todo es POST con un texto JSON (`Content-Type: text/plain`, evita el preaviso CORS). Ejemplo:
`{"accion":"horarios_libres","servicio_id":"S1","desde":"2026-10-27","dias":7}`
Acciones públicas: `config_publica`, `horarios_libres`, `reservar`, `ver_turno`, `cancelar_turno`.
Con sesión: `login`, `agenda`, `crear_turno`, `cambiar_estado`, `reprogramar`, `guardar_bloqueo`, `recordatorios_manana`, `marcar_avisado`.

## Qué está probado y qué no
- Probado en simulación (25 pruebas): disponibilidad, doble reserva, solapes de servicios largos, bloqueos, estados, reprogramación, permisos por rol, clave protegida, bloqueo por intentos, sesión vencida, correo único.
- **No probado** en Google real: la concurrencia verdadera del cerrojo (LockService), las cuotas de correo y la velocidad con muchos turnos. Es lo primero que hay que verificar al desplegar.
- Pantallas: `reserva.html` (cliente), `panel.html` (personal: agenda, nuevo turno, avisos de mañana, bloqueos) y `prueba.html` (diagnóstico). Probadas en simulación; falta probarlas con el servicio real desde el celular.
- Para mostrar el grupo «Agenda y turnos» en el Hub: `modulos.js` → `turnos: true`.
- Ficha del cliente: `fichas.js` usa la sesión del Hub (mismo sitio) para buscar, crear y vincular fichas en Firestore; el script suma las acciones `vincular_cliente` e `historial`. Sin sesión del Hub, el panel funciona igual y avisa «Falta ingresar al Hub».
- Manual para Claudio: `MANUAL_Claudio_DOMino_Turnos.md`.
