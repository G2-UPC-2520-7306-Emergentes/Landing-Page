# FoodChain — Landing Page

Este repositorio contiene una landing page de una sola pantalla, lista para ejecutarse localmente con `python -m http.server` o desplegarse en GitHub Pages.

## 🚀 Estructura del Proyecto

Toda la aplicación vive ahora en la raíz del repositorio para simplificar las rutas relativas:

- **`index.html`**: Documento principal con todas las secciones (Header, Hero, Segmentos, Contacto, Footer, etc.).
- **`/css`**: Hojas de estilo.
  - **`utilities.css`**: Fundamentos visuales (variables, tipografía, espaciado, utilidades).
  - **`styles-index.css`**: Layout, componentes y microinteracciones específicos de la landing.
- **`/js`**: Lógica interactiva.
  - **`script.js`**: Gestión de tema, tabs, acordeón, formularios, internacionalización y demás interacciones.
- **`/i18n`**: Diccionarios JSON por idioma (`es.json`, `en.json`).

## � Internacionalización

La landing incluye un selector de idioma (ES/EN) en la navegación principal y en el menú móvil. Los textos se resuelven desde `i18n/{lang}.json` y la preferencia queda guardada en `localStorage` (`foodchain-lang`).

Para añadir un nuevo idioma:

1. Duplica `i18n/en.json` y nombra el archivo con el código ISO deseado (por ejemplo, `pt.json`).
2. Traduce cada cadena sin modificar las claves.
3. Actualiza el toggle en `index.html` si necesitas mostrar el nuevo idioma en la UI.
4. Recarga la página; el loader detectará automáticamente el nuevo archivo.

## �🎯 FoodChain: Trazabilidad Alimentaria

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
3. Si quieres usar `/docs` como raíz histórica, mantenla con `404.html` y `.nojekyll`; de lo contrario, apunta a la raíz del repositorio.
4. Guarda los cambios y tu landing page estará online.

- **[ ] Reemplazar logos**: Añadir los logos de las empresas que confían en FoodChain.
- **[ ] Validar diseño**: Asegurar el contraste de colores y la correcta visualización en dispositivos móviles.
- **[ ] Probar funcionalidad**: Verificar que el formulario, las tabs y el CTA funcionen correctamente.
- **[ ] Activar GitHub Pages**: Realizar el despliegue y verificar la URL.
- **[ ] Validar i18n**: Cambiar de idioma en escritorio y móvil, y confirmar que todos los textos se traduzcan correctamente.
