# FoodChain — Landing Page para GitHub Pages

Este repositorio contiene una landing page de una sola pantalla, optimizada para ser desplegada en GitHub Pages desde la carpeta `docs/`.

## 🚀 Estructura del Proyecto

El proyecto está organizado de la siguiente manera para simplificar el despliegue y el mantenimiento:

- **`/docs`**: Carpeta raíz para GitHub Pages.
  - **`.nojekyll`**: Asegura que GitHub Pages sirva los archivos sin procesarlos con Jekyll.
  - **`404.html`**: Redirige todas las rutas no encontradas a la página principal, evitando errores 404.
  - **`index.html`**: Contiene la estructura principal de la landing page, dividida en las siguientes secciones:
    - `Header`
    - `Hero`
    - `Confían en nosotros`
    - `3 Features`
    - `CTA/Contacto`
    - `Footer`
  - **`/css`**: Hojas de estilo.
    - **`utilities.css`**: Define el sistema visual (variables, tipografía, colores, espaciado) y clases de utilidad (`.container`, `.grid`, `.card`, `.btn`).
    - **`styles-index.css`**: Aplica los estilos específicos del layout (header fijo, grilla del hero, etc.).
  - **`/js`**: Lógica de la aplicación.
    - **`script.js`**: Maneja el selector de idioma y otros eventos básicos.
  - **`/i18n`**: Archivos de internacionalización.
    - **`es.json` / `en.json`**: Contienen las traducciones para todos los textos de la interfaz.
  - **`/images`**: Carpeta para imágenes.
    - **`.keep`**: Permite que la carpeta vacía sea versionada en Git.

## 🎯 FoodChain: Trazabilidad Alimentaria

**FoodChain** es una solución de **trazabilidad auditable** para la industria alimentaria. Permite verificar el origen y la cadena de custodia por lote, registrar hitos con evidencias (fotos, documentos), emitir **códigos QR** públicos y ofrecer un panel de auditoría.

### ⭐ Propuesta de Valor

- **Cumplimiento simple**: Simplifica las auditorías y el cumplimiento normativo.
- **Menor riesgo**: Reduce los riesgos operativos y de reputación.
- **Transparencia total**: Ofrece transparencia a consumidores y reguladores.

### 👥 Público Objetivo

- Productores
- Empresas de procesamiento
- Retailers
- Marcas con obligaciones de auditoría

## ⚙️ Despliegue en GitHub Pages

1. Ve a la configuración de tu repositorio en GitHub.
2. En la sección **Pages**, selecciona la rama `main`.
3. Elige la carpeta `/docs` como fuente de despliegue.
4. Guarda los cambios y tu landing page estará online.

## 📝 Checklist de Contenido y Desarrollo

- **[ ] Completar traducciones**: Rellenar `es.json` y `en.json`.
- **[ ] Reemplazar logos**: Añadir los logos de las empresas que confían en FoodChain.
- **[ ] Validar diseño**: Asegurar el contraste de colores y la correcta visualización en dispositivos móviles.
- **[ ] Probar funcionalidad**: Verificar que el selector de idioma y el CTA funcionen correctamente.
- **[ ] Activar GitHub Pages**: Realizar el despliegue y verificar la URL.
