# ANZA Residencial — Landing Page

Landing page oficial del proyecto inmobiliario **ANZA Residencial**: lotes para casa de campo desde 144 m² en Otuzco, La Libertad (Perú), desarrollado por **GEMC Contratistas** (RUC 20607907812).

🔗 **Sitio en vivo:** se publica con GitHub Pages desde este mismo repositorio (ver sección [Deploy](#deploy--github-pages)).

## Contenido de la página

- **Hero** de impacto con llamado a la acción directo a WhatsApp y a "Agenda tu visita".
- **Sobre el proyecto** — propuesta de valor y etiquetas temáticas.
- **Ubicación estratégica** con mapa embebido y datos clave (distancia a la Plaza de Armas, al nuevo hospital, inversión pública en la zona, entrega prevista).
- **5 razones para elegir ANZA** (lote listo para construir, seguridad jurídica, plusvalía, diseño + construcción, rentabilización).
- **Plan maestro** del proyecto.
- **Referencias arquitectónicas**.
- **Avance de obra real** (fotografías del proyecto en ejecución) con galería y lightbox.
- **Comunidad ANZA** — estadísticas animadas (lotes vendidos, metraje, frentes).
- **Inversión** — mensaje de preventa.
- **Opciones de compra** — 3 planes de pago (contado y dos financiamientos) + beneficio de planos de arquitectura gratis.
- **Agenda tu visita** — formulario de reserva de cita que arma un mensaje y lo envía directo a WhatsApp, más tarjetas de contacto directo.
- Botón flotante de WhatsApp, botón "volver arriba", animaciones al hacer scroll y diseño 100% responsive.

## Contacto integrado a WhatsApp

Todos los botones de contacto (hero, precios, banner de beneficio, formulario de reserva de cita, botón flotante) abren WhatsApp (`https://wa.me/51920076796`) con un mensaje pre-armado según el contexto — sin necesidad de backend ni servicios de terceros.

El número de WhatsApp está centralizado en una sola constante en [`assets/js/main.js`](assets/js/main.js):

```js
var WHATSAPP_NUMBER = "51920076796";
```

Para cambiarlo, edita solo esa línea.

## Stack técnico

HTML5 + CSS3 + JavaScript vanilla — sin frameworks ni build step. Pensado para desplegarse tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting estático.

```
anza-residencial/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/          (fotos e imágenes optimizadas del proyecto)
└── README.md
```

- Tipografías: [Fraunces](https://fonts.google.com/specimen/Fraunces) (títulos) + [Inter](https://fonts.google.com/specimen/Inter) (texto), vía Google Fonts.
- Sin dependencias externas de JS (animaciones, contador de estadísticas, lightbox y menú móvil son código propio en `main.js`).
- Imágenes optimizadas (comprimidas y redimensionadas) a partir del brochure oficial del proyecto.

## Desarrollo local

No requiere instalación. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático:

```bash
python -m http.server 8080
```

y visitar `http://localhost:8080`.

## Deploy — GitHub Pages

1. Settings → Pages → Source: **Deploy from a branch**.
2. Branch: `main`, carpeta `/ (root)`.
3. Guardar. El sitio queda publicado en `https://<usuario>.github.io/<repositorio>/`.

## Editar contenido

- **Textos y precios:** directamente en `index.html` (cada sección tiene un comentario `<!-- ===== -->` que la identifica).
- **Imágenes:** reemplaza los archivos en `assets/img/` manteniendo el mismo nombre, o actualiza la ruta en el HTML.
- **Colores de marca:** variables CSS en la parte superior de `assets/css/style.css` (`:root { --gold, --green-900, ... }`).
- **Número de WhatsApp:** constante `WHATSAPP_NUMBER` en `assets/js/main.js`.

## Aviso legal

Los precios, áreas, tiempos de entrega y condiciones mostrados están sujetos a confirmación, disponibilidad y a las condiciones comerciales vigentes del proyecto al momento de la consulta. Las imágenes son referenciales.

---

© ANZA Residencial · GEMC Contratistas. Todos los derechos reservados.
