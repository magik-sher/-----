(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal sections only after they enter the viewport.
  const revealTargets = document.querySelectorAll(
    ".story-heading, .story-copy, .story-image, .closeup-photo, .closeup-copy, .closeup-wide, .booking-copy, .booking-details"
  );
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("will-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealTargets.forEach((el) => observer.observe(el));
  }

  // The site is Russian-only; apply its local text dictionary once.
  document.documentElement.lang = "ru";
  const russian = (window.SHER_TRANSLATIONS || {}).ru || {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = russian[el.dataset.i18n];
    if (typeof value === "string") el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = russian[el.dataset.i18nHtml];
    if (typeof value === "string") el.innerHTML = value;
  });

  // Card interaction is handled by effects/card-flip.js: hover/focus on
  // fine pointers and tap toggling on touch devices. Do not override data-flip.
})();
