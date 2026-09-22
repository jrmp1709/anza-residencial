/* ============================================================
   ANZA Residencial — main.js
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "51920076796"; // GEMC Contratistas / ANZA Residencial

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------- Wire up every .js-whatsapp link ---------- */
  function initWhatsAppLinks() {
    var links = document.querySelectorAll(".js-whatsapp");
    links.forEach(function (link) {
      var msg = link.getAttribute("data-msg") || "Hola, quiero más información sobre ANZA Residencial.";
      link.setAttribute("href", buildWhatsAppUrl(msg));
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

    // Close menu after tapping a nav link (mobile)
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
    if (!("IntersectionObserver" in window) || !items.length) {
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
            }, (i % 6) * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.round(target * eased);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".stat-num[data-count]");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }
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

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");
    if (!lightbox || !lightboxImg) return;

    function open(src, alt) {
      lightboxImg.setAttribute("src", src);
      lightboxImg.setAttribute("alt", alt || "");
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lightboxImg.setAttribute("src", "");
    }

    document.querySelectorAll(".js-lightbox").forEach(function (item) {
      item.addEventListener("click", function () {
        var full = item.getAttribute("data-full");
        var img = item.querySelector("img");
        open(full, img ? img.getAttribute("alt") : "");
      });
    });

    closeBtn && closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Booking form -> WhatsApp ---------- */
  function initBookingForm() {
    var form = document.getElementById("bookingForm");
    var note = document.getElementById("formNote");
    if (!form) return;

    function formatDate(value) {
      if (!value) return "sin especificar";
      var parts = value.split("-");
      if (parts.length !== 3) return value;
      var months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10) - 1;
      var d = parseInt(parts[2], 10);
      return d + " de " + months[m] + " de " + y;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = form.nombre.value.trim();
      var whatsapp = form.whatsapp.value.trim();
      var fecha = form.fecha.value;
      var horario = form.horario.value;
      var interes = form.interes.value;
      var mensaje = form.mensaje.value.trim();

      if (!nombre || !whatsapp || !fecha) {
        note.textContent = "Por favor completa tu nombre, WhatsApp y fecha preferida.";
        note.style.color = "#b3452f";
        var firstInvalid = !nombre ? form.nombre : (!whatsapp ? form.whatsapp : form.fecha);
        firstInvalid.focus();
        return;
      }

      var lines = [
        "Hola, soy " + nombre + ".",
        "Quiero *agendar una visita* a ANZA Residencial.",
        "📅 Fecha preferida: " + formatDate(fecha),
        "🕐 Horario: " + horario,
        "💰 Plan de interés: " + interes,
        "📱 Mi WhatsApp: " + whatsapp
      ];
      if (mensaje) lines.push("📝 Mensaje: " + mensaje);

      var url = buildWhatsAppUrl(lines.join("\n"));

      note.textContent = "¡Listo! Te estamos redirigiendo a WhatsApp para confirmar tu cita ✅";
      note.style.color = "#2a4133";

      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Date input: no past dates ---------- */
  function initDateMin() {
    var input = document.getElementById("f-fecha");
    if (!input) return;
    var today = new Date();
    var iso = today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");
    input.setAttribute("min", iso);
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
    initBookingForm();
    initYear();
    initDateMin();
  });
})();
