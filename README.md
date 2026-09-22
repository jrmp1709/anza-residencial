# ANZA Residencial — Landing Page

Landing page oficial del proyecto inmobiliario **ANZA Residencial**: lotes para casa de campo desde 144 m² en Otuzco, La Libertad (Perú), desarrollado por **GEMC Contratistas** (RUC 20607907812).

🔗 **Sitio en vivo:** https://jrmp1709.github.io/anza-residencial/

## Dirección de arte

Lujo contemporáneo, arquitectura + naturaleza. Paleta marfil / verde oliva profundo / gris piedra, con un acento cálido discreto (terracota mate) — sin degradados dorados ni animaciones invasivas. Tipografía editorial: [Fraunces](https://fonts.google.com/specimen/Fraunces) para títulos y cifras, [Inter](https://fonts.google.com/specimen/Inter) para texto. Los números de estadísticas usan `.num` (serif, peso 700, tabular) para que resalten frente al resto del contenido.

## Recorrido comercial de la página

1. **Hero** — impacto visual + barra de datos verificados (ubicación, área desde, etapa, entrega).
2. **Entorno y ubicación** — propuesta de valor + mapa + cifras de ubicación estratégica.
3. **Por qué elegir ANZA** — 5 razones, sin repetir cifras ya mostradas.
4. **Evidencia real** — galería de fotos reales de campo (no renders) + plan maestro con visor de zoom/pan.
5. **Inspiración arquitectónica** — referencias de **otros proyectos**, claramente separadas y etiquetadas para no confundirse con construcciones de ANZA.
6. **Confianza** — seguridad jurídica y los 5 pasos del proceso de compra.
7. **Precios y financiamiento** — 3 planes con el total transparente de cada uno.
8. **Agenda tu visita** — formulario que arma un mensaje y lo envía por WhatsApp, más contacto directo.

## Autenticidad de las imágenes — importante

El código distingue tres categorías, y cada imagen lo indica en su `alt`, su `figcaption` o una nota de sección:

| Categoría | Dónde | Ejemplos |
|---|---|---|
| **Reales** (tomadas en el proyecto) | Sección "Evidencia real" | Fotos de carreteras, movimiento de tierras, equipo en campo, trazado de lotes, plano maestro |
| **Referenciales / conceptuales** (no son el proyecto construido) | Hero, ilustración de "planos gratis" | Foto de portada, isométrico de casa |
| **Referencias de otros proyectos** | Sección "Inspiración arquitectónica" | AIRE (Simbal), Condominio Monte (Lima), condominio internacional — la 4ª imagen es un render conceptual del propio ANZA |

**Si vas a reemplazar imágenes:** no pongas una foto de stock o generada por IA como si fuera una fotografía real del terreno. Si aún no tienes la foto real de algo, es preferible dejar la sección con una imagen referencial *claramente etiquetada como tal* antes que presentar algo falso como auténtico.

### Imágenes pendientes de material gráfico real (opcional, mejora futura)

Si en algún momento tienes disponibles estas fotos reales, reemplazan con ventaja a las referenciales actuales:
- Foto real de un lote entregado / hito de construcción más reciente que las actuales.
- Foto real de alguna casa ya construida en el proyecto (cuando exista).
- Documento o certificado real para la sección "Confianza", si el proyecto autoriza publicarlo.

## Números y contadores — accesibilidad

Los valores reales (144, 50, 10, 2, 150, 2027…) están escritos directamente en el HTML como texto, **no dependen de JavaScript para mostrarse**. Si JS está disponible y el visitante no activó "reducir movimiento" en su sistema operativo, el número se anima desde 0 solo visualmente; en cualquier otro caso (JS desactivado, `prefers-reduced-motion: reduce`, o un error), el valor correcto ya está visible. Ver `animateCount()` / `initCounters()` en `assets/js/main.js`.

## Contacto integrado a WhatsApp

Todos los botones de contacto abren `https://wa.me/51920076796` con un mensaje pre-armado distinto según la intención (información general, un plan de precio específico, un lote puntual, el beneficio de planos gratis, o la reserva de visita con los datos del formulario). El número está centralizado en una sola constante:

```js
// assets/js/main.js
var WHATSAPP_NUMBER = "51920076796";
```

## Seguimiento de conversiones (Meta Ads / GA4)

El sitio **no incluye ningún píxel todavía** — no se inventó ningún ID. Lo que sí incluye es un *stub* seguro (`trackEvent()` en `main.js`) que dispara el evento solo si `fbq` o `gtag` ya existen en la página (por ejemplo, porque tú agregaste el snippet oficial de Meta Pixel o Google tag en el `<head>`). Mientras no agregues ningún snippet, estas llamadas no hacen nada y no se envía ningún dato.

**Para activarlo:**
1. Pega el snippet oficial de Meta Pixel (o `gtag.js`) en el `<head>` de `index.html`, con tu propio Pixel ID / Measurement ID.
2. Los siguientes eventos ya están conectados y se dispararán automáticamente:

| Evento | Cuándo se dispara |
|---|---|
| `whatsapp_click_hero` | CTA "Agenda tu visita" del hero |
| `whatsapp_click_nav` | Botón WhatsApp de la barra de navegación |
| `whatsapp_click_razones` | CTA dentro de "Por qué elegir ANZA" |
| `whatsapp_click_lote_especifico` | CTA de disponibilidad junto al plan maestro |
| `whatsapp_click_precio_contado` / `_financiamiento_01` / `_financiamiento_02` | CTA de cada tarjeta de precio |
| `whatsapp_click_beneficio` | CTA del beneficio de planos gratis |
| `whatsapp_click_contacto` / `_footer` / `_float` | Tarjeta de contacto, pie de página y botón flotante |
| `form_submit_visita` | Envío del formulario de "Agenda tu visita" (incluye horario e interés elegidos, sin datos personales) |

No se envía nombre, teléfono ni ningún dato personal en los eventos — solo la categoría de la acción.

## Stack técnico

HTML5 + CSS3 + JavaScript vanilla — sin frameworks ni build step. Imágenes con `<picture>` (WebP + JPG de respaldo), `width`/`height` explícitos para evitar saltos de layout (CLS), `loading="lazy"` en todo lo que no es above-the-fold y `fetchpriority="high"` en la imagen del hero (LCP). Respeta `prefers-reduced-motion`.

```
anza-residencial/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/
│       ├── brand/          (logo real: versiones horizontal/vertical, negro/blanco)
│       └── *.jpg + *.webp  (fotos reales, referenciales y de referencia arquitectónica)
└── README.md
```

## Desarrollo local

```bash
python -m http.server 8080
```

y visita `http://localhost:8080`.

## Editar contenido

- **Textos, precios y totales:** directamente en `index.html` (cada sección tiene un comentario `<!-- ===== -->`).
- **Colores de marca:** variables CSS en `assets/css/style.css` (`:root { --ivory, --olive-950, --clay, ... }`).
- **Logo:** `assets/img/brand/` — usa la versión `-black` sobre fondos claros y `-white` sobre fondos oscuros.
- **Número de WhatsApp:** constante `WHATSAPP_NUMBER` en `assets/js/main.js`.
- **Disponibilidad de lotes por manzana/número:** aún no está en la web porque no hay datos individualizados verificados. Si en algún momento tienes ese listado (lote, área, estado: disponible/reservado/vendido), se puede construir un selector interactivo sobre el plan maestro — pídemelo y lo implemento con esos datos reales.

## Deploy — GitHub Pages

Ya está activo: Settings → Pages → Deploy from a branch → `main` / `/ (root)`. Cualquier cambio subido a `main` se publica solo en menos de un minuto.

## Aviso legal

Los precios, áreas, tiempos de entrega y condiciones mostrados están sujetos a confirmación, disponibilidad y a las condiciones comerciales vigentes del proyecto al momento de la consulta.

---

© ANZA Residencial · GEMC Contratistas. Todos los derechos reservados.
