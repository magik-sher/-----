(() => {
  "use strict";

  const loader = document.getElementById("intro-loader");
  const root = document.documentElement;
  const lockedElements = [...document.querySelectorAll("[data-intro-locked]")];
  if (!loader) {
    root.classList.remove("intro-loading");
    lockedElements.forEach((element) => { element.inert = false; });
    return;
  }

  let finished = false;
  const unlockSite = () => {
    if (finished) return;
    finished = true;
    root.classList.remove("intro-loading");
    lockedElements.forEach((element) => { element.inert = false; });
    loader.remove();
  };

  window.setTimeout(() => {
    loader.classList.add("is-fading");
    const fadeDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 750;
    window.setTimeout(unlockSite, fadeDuration);
  }, 3000);
})();
