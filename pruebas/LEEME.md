# Pruebas de DOMino Profesional (sin conexión a Firebase)

`stubs.py` reemplaza Firebase por una base en memoria con datos de ejemplo (3 usuarios, 3 empresas, tareas, documentos, entregas y mensajes).
`t_full.py` recorre todo el Hub con el nivel Senior: indicadores, cartera, expedientes, estados, buzón con archivo, kanban, calendario, herramientas, equipo, chat y accesos del Inicio.

Uso (desde esta carpeta, con la app servida en el puerto 8801 desde la raíz del repositorio):

    python3 -m http.server 8801   # en la raíz del repositorio
    python3 t_full.py

Requiere Python con Playwright. No toca datos reales: Firebase nunca se carga.
