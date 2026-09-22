/* ============================================================
   ANZA Residencial — main.js
   Vanilla JS, sin dependencias externas.
   ============================================================ */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "51920076796"; // GEMC Contratistas / ANZA Residencial — número oficial publicado

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------------------------------------------------------
     Conversion tracking (Meta Pixel / GA4) — stub seguro.
     No inventa IDs de píxel ni envía datos personales: solo
     dispara el evento si el sitio ya cargó fbq/gtag en otro
     lugar (por ejemplo, un snippet que tú agregues en <head>).
     Ver README para los eventos disponibles.
  --------------------------------------------------------- */
  function trackEvent(eventName, params) {
    try {
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", eventName, params || {});
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params || {});
      }
    } catch (e) { /* no-op: el tracking nunca debe romper la página */ }
  }

  /* ---------- Wire up every .js-whatsapp link ---------- */
  function initWhatsAppLinks() {
    var links = document.querySelectorAll(".js-whatsapp");
    links.forEach(function (link) {
      var msg = link.getAttribute("data-msg") || "Hola, quiero más información sobre ANZA Residencial.";
      link.setAttribute("href", buildWhatsAppUrl(msg));
      link.addEventListener("click", function () {
        trackEvent(link.getAttribute("data-event") || "whatsapp_click", { label: msg });
      });
    });
  }

  /* ---------- Navbar scroll state ---------- */
  function initNavbarScroll() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initHamburger() {
    var btn = document.getElementById("hamburger");
    var navbar = document.getElementById("navbar");
    if (!btn || !navbar) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      navbar.classList.toggle("menu-open");
      btn.setAttribute("aria-label", expanded ? "Abrir menú" : "Cerrar menú");
    });

    navbar.querySelectorAll(".nav-links a, .navbar__cta a").forEach(function (a) {
      a.addEventListener("click", function () {
        navbar.classList.remove("menu-open");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 6) * 60);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     Contadores — accesibles y progresivos.
     El HTML ya trae el valor real como texto (por si JS falla
     o el usuario prefiere movimiento reducido). Si el motion
     está permitido, animamos desde 0 solo visualmente.
  --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return; // deja el valor real estático (ej. "2027")
    if (prefersReducedMotion) return; // respeta la preferencia; ya muestra el valor real

    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".num[data-count]");
    if (!counters.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Lightbox (con distinción real/referencial vía data-caption) ---------- */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxCaption = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    if (!lightbox || !lightboxImg) return;
    var lastFocused = null;

    function open(src, alt, caption) {
      lastFocused = document.activeElement;
      lightboxImg.setAttribute("src", src);
      lightboxImg.setAttribute("alt", alt || "");
      lightboxCaption.textContent = caption || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lightboxImg.setAttribute("src", "");
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll(".js-lightbox").forEach(function (item) {
      item.addEventListener("click", function () {
        var full = item.getAttribute("data-full");
        var img = item.querySelector("img");
        var caption = item.getAttribute("data-caption") || (img ? img.getAttribute("alt") : "");
        open(full, img ? img.getAttribute("alt") : "", caption);
      });
    });

    closeBtn && closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    function onScroll() {
      if (window.scrollY > 600) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Plan viewer: zoom + pan (scroll nativo) ---------- */
  function initPlanViewer() {
    var viewer = document.getElementById("planViewer");
    if (!viewer) return;
    var inner = document.getElementById("planViewerInner");
    var scrollEl = viewer.querySelector(".plan-viewer__scroll");
    var label = document.getElementById("planZoomLabel");
    var btnIn = document.getElementById("planZoomIn");
    var btnOut = document.getElementById("planZoomOut");
    var btnReset = document.getElementById("planZoomReset");
    var zoom = 1;
    var MIN = 1, MAX = 3, STEP = 0.4;

    function apply() {
      inner.style.setProperty("--plan-zoom", zoom);
      label.textContent = Math.round(zoom * 100) + "%";
      btnOut.disabled = zoom <= MIN;
      btnIn.disabled = zoom >= MAX;
    }
    btnIn.addEventListener("click", function () {
      zoom = Math.min(MAX, +(zoom + STEP).toFixed(2));
      apply();
    });
    btnOut.addEventListener("click", function () {
      zoom = Math.max(MIN, +(zoom - STEP).toFixed(2));
      apply();
      if (zoom === MIN) { scrollEl.scrollLeft = 0; scrollEl.scrollTop = 0; }
    });
    btnReset.addEventListener("click", function () {
      zoom = 1;
      apply();
      scrollEl.scrollLeft = 0;
      scrollEl.scrollTop = 0;
    });
    apply();
  }

  /* ---------- Booking form -> WhatsApp (validación reforzada) ---------- */
  function initBookingForm() {
    var form = document.getElementById("bookingForm");
    var note = document.getElementById("formNote");
    if (!form) return;

    var fNombre = form.nombre;
    var fWhatsapp = form.whatsapp;
    var fFecha = form.fecha;

    // La fecha mínima seleccionable es hoy.
    var today = new Date();
    var isoToday = today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");
    fFecha.setAttribute("min", isoToday);

    function showError(input, errorId, show) {
      var span = document.getElementById(errorId);
      input.setAttribute("aria-invalid", show ? "true" : "false");
      if (span) span.hidden = !show;
    }

    function formatDate(value) {
      if (!value) return "";
      var parts = value.split("-");
      if (parts.length !== 3) return value;
      var months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10) - 1;
      var d = parseInt(parts[2], 10);
      if (!months[m]) return value;
      return d + " de " + months[m] + " de " + y;
    }

    [fNombre, fWhatsapp, fFecha].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          input.removeAttribute("aria-invalid");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = fNombre.value.trim().replace(/\s+/g, " ");
      var whatsappRaw = fWhatsapp.value.trim();
      var whatsappDigits = whatsappRaw.replace(/\D/g, "");
      var fecha = fFecha.value;
      var horario = form.horario.value;
      var interes = form.interes.value;
      var mensaje = form.mensaje.value.trim().slice(0, 500);

      var valid = true;

      if (!nombre || nombre.length < 2) {
        showError(fNombre, "err-nombre", true);
        valid = false;
      } else {
        showError(fNombre, "err-nombre", false);
      }

      if (whatsappDigits.length < 6) {
        showError(fWhatsapp, "err-whatsapp", true);
        valid = false;
      } else {
        showError(fWhatsapp, "err-whatsapp", false);
      }

      if (fecha) {
        var chosen = new Date(fecha + "T00:00:00");
        var minDate = new Date(isoToday + "T00:00:00");
        if (isNaN(chosen.getTime()) || chosen < minDate) {
          showError(fFecha, "err-fecha", true);
          valid = false;
        } else {
          showError(fFecha, "err-fecha", false);
        }
      }

      if (!valid) {
        note.textContent = "Revisa los campos marcados antes de continuar.";
        note.style.color = "#A3402E";
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var lines = [
        "Hola, soy " + nombre + ".",
        "Quiero *agendar una visita* a ANZA Residencial."
      ];
      if (fecha) lines.push("📅 Fecha preferida: " + formatDate(fecha));
      lines.push("🕐 Horario: " + horario);
      lines.push("💰 Plan de interés: " + interes);
      lines.push("📱 Mi WhatsApp: " + whatsappRaw);
      if (mensaje) lines.push("📝 Mensaje: " + mensaje);

      var url = buildWhatsAppUrl(lines.join("\n"));

      note.textContent = "¡Listo! Te estamos redirigiendo a WhatsApp para confirmar tu cita.";
      note.style.color = "#3A4A34";

      trackEvent("form_submit_visita", { horario: horario, interes: interes });
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initWhatsAppLinks();
    initNavbarScroll();
    initHamburger();
    initReveal();
    initCounters();
    initLightbox();
    initBackToTop();
    initPlanViewer();
    initBookingForm();
    initYear();
  });
})();
