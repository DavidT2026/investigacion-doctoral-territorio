# investigacion-doctoral-territorio

Tablero de seguimiento de la investigación doctoral sobre pedagogía del territorio, memoria, juventudes y experiencias de habitar en Juan Pablo II y Compartir, Ciudad Bolívar, Bogotá.

## Contenido
- `index.html`: página principal del tablero.
- `css/styles.css`: estilos adaptables.
- `js/dashboard.js`: renderizado de indicadores, tareas, tutorías, gráfica y exportación de JSON.
- `data/project.json`: fuente editable de los datos del tablero.
- `assets/`: recursos visuales adicionales.

## Privacidad y ética
Este repositorio está previsto para trabajo privado. No incluir entrevistas identificables, fotos o audios de menores, datos personales, coordenadas sensibles ni materiales comunitarios sin revisar consentimiento, autorización y riesgos éticos. Un repositorio privado no implica automáticamente que un sitio publicado sea privado. La publicación del sitio no está configurada.

## Probar localmente
Como el tablero carga `data/project.json`, no debe abrirse directamente con `file://`. Con Python instalado, desde esta carpeta ejecuta `python -m http.server 8000` y visita `http://localhost:8000`.

## Actualizar
Editar `data/project.json`. Estados permitidos: `pendiente`, `en curso`, `por verificar`, `propuesto` y `completado`. No marcar productos como completados sin evidencia comprobable ni asignar porcentajes sin una regla explícita de medición.

## Publicación
GitHub Pages no está configurado por esta versión. Antes de activarlo, revisar las condiciones de privacidad y quién podrá acceder al sitio.
