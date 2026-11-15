(() => {
  "use strict";

  const track = document.querySelector("#top.hero-portal-scroll");
  const pin = document.querySelector("#hero-portal-pin");
  const stage = document.querySelector("#portal-stage");
  const curtains = stage?.querySelector(".portal-scene--curtains");
  const rabbit = stage?.querySelector(".portal-scene--rabbit");
  const magician = stage?.querySelector(".portal-scene--magician");
  const blackout = document.querySelector("#portal-blackout");
  const counter = document.querySelector("#portal-stage-counter");
  const status = document.querySelector("#portal-status");
  const cue = pin?.querySelector(".scroll-cue");
  const heroInner = pin?.querySelector(".hero-inner");
  const socialRail = pin?.querySelector(".social-rail");
  const frameIndex = document.querySelector("#hero-frame-index");
  const topbar = document.querySelector(".topbar");
  const frameInfos = [...(pin?.querySelectorAll("[data-frame-info]") || [])];
  if (!track || !pin || !stage || !curtains || !rabbit || !magician || !blackout || !counter || !status || frameInfos.length !== 3) return;

  const labels = ["театральные кулисы", "кролик в цилиндре", "иллюзионист на сцене"];
  const frameProgress = [0, 0.54, 1];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const queuedSteps = [];
  let renderFrame = 0;
  let transitionFrame = 0;
  let announcedScene = -1;
  let settledFrame = 0;
  let visualProgress = 0;
  let portalLocked = false;
  let isNavigating = false;
  let touchOrigin = null;
  let touchDistance = 0;
  let touchCaptured = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const smooth = (value) => {
    const amount = reduceMotion ? Number(value >= 0.5) : value;
    return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
  };
  const mix = (from, to, amount) => from + (to - from) * amount;

  function getScrollMetrics() {
    const viewportHeight = pin.getBoundingClientRect().height;
    const travel = Math.max(1, track.offsetHeight - viewportHeight);
    const top = track.getBoundingClientRect().top;
    const progress = clamp(-top / travel);
    return { travel, progress, startY: window.scrollY + top };
  }

  function isStoryActive() {
    const rect = track.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function nearestFrame(progress) {
    return frameProgress.reduce((best, value, index) =>
      Math.abs(value - progress) < Math.abs(frameProgress[best] - progress) ? index : best, 0);
  }

  function movePageToAnchor(anchor) {
    const { travel, startY } = getScrollMetrics();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    (document.scrollingElement || root).scrollTop = startY + (anchor === "end" ? travel : 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }

  function beginPortalLock(frame, direction) {
    portalLocked = true;
    settledFrame = frame;
    visualProgress = frameProgress[frame];
    movePageToAnchor(direction > 0 ? "start" : "end");
    scheduleRender();
  }

  function releasePortalLock(anchor) {
    if (!portalLocked) return;
    movePageToAnchor(anchor);
    portalLocked = false;
    scheduleRender();
  }

  function animateToFrame(targetFrame) {
    const from = visualProgress;
    const to = frameProgress[targetFrame];
    const started = performance.now();
    const duration = reduceMotion ? 0 : 2000;
    isNavigating = true;

    function tick(now) {
      const amount = duration ? clamp((now - started) / duration) : 1;
      const eased = amount * amount * amount * (amount * (amount * 6 - 15) + 10);
      visualProgress = from + (to - from) * eased;
      scheduleRender();
      if (amount < 1) {
        transitionFrame = window.requestAnimationFrame(tick);
        return;
      }

      visualProgress = to;
      settledFrame = targetFrame;
      isNavigating = false;
      transitionFrame = 0;
      scheduleRender();
      flushQueuedSteps();
    }

    transitionFrame = window.requestAnimationFrame(tick);
  }

  function requestFrameStep(direction) {
    if (isNavigating) {
      if (queuedSteps.length < 4) queuedSteps.push(direction);
      return;
    }

    const current = settledFrame;
    const next = clamp(current + direction, 0, frameProgress.length - 1);
    if (next === current) return;
    if (!portalLocked) beginPortalLock(current, direction);
    animateToFrame(next);
  }

  function flushQueuedSteps() {
    if (isNavigating || !portalLocked) return;
    while (queuedSteps.length) {
      const direction = queuedSteps.shift();
      const next = clamp(settledFrame + direction, 0, frameProgress.length - 1);
      if (next === settledFrame) continue;
      animateToFrame(next);
      return;
    }
  }

  function handleWheel(event) {
    if (document.documentElement.classList.contains("intro-loading")) {
      event.preventDefault();
      return;
    }
    if (!portalLocked && !isStoryActive()) return;
    const delta = event.deltaY || (event.wheelDelta ? -event.wheelDelta : 0);
    const direction = Math.sign(delta);
    if (!direction) return;

    if (portalLocked && isNavigating) {
      event.preventDefault();
      requestFrameStep(direction);
      return;
    }

    if (direction < 0 && settledFrame === 0) {
      if (portalLocked) releasePortalLock("start");
      return;
    }
    if (direction > 0 && settledFrame === frameProgress.length - 1) {
      if (portalLocked) releasePortalLock("end");
      return;
    }

    event.preventDefault();
    if (!portalLocked) beginPortalLock(settledFrame, direction);
    requestFrameStep(direction);
  }

  function handleKeydown(event) {
    if (document.documentElement.classList.contains("intro-loading")) {
      if (["ArrowDown", "PageDown", "End", " ", "ArrowUp", "PageUp", "Home"].includes(event.key)) event.preventDefault();
      return;
    }
    if ((!portalLocked && !isStoryActive()) || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    let direction = 0;
    if (["ArrowDown", "PageDown", "End"].includes(event.key) || (event.key === " " && !event.shiftKey)) direction = 1;
    if (["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey)) direction = -1;
    if (!direction) return;

    if (direction < 0 && settledFrame === 0) {
      if (portalLocked) releasePortalLock("start");
      return;
    }
    if (direction > 0 && settledFrame === frameProgress.length - 1) {
      if (portalLocked) releasePortalLock("end");
      return;
    }

    event.preventDefault();
    if (!portalLocked) beginPortalLock(settledFrame, direction);
    requestFrameStep(direction);
  }

  function handleInternalLink(event) {
    if (!portalLocked || !(event.target instanceof Element)) return;
    const link = event.target.closest("a[href^='#']");
    if (!link || link.hash === "#top") return;
    if (settledFrame === frameProgress.length - 1 && !isNavigating) {
      releasePortalLock("end");
      return;
    }
    event.preventDefault();
  }

  function handleTouchStart(event) {
    if (document.documentElement.classList.contains("intro-loading")) return;
    if ((!portalLocked && !isStoryActive()) || event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchOrigin = { x: touch.clientX, y: touch.clientY };
    touchDistance = 0;
    touchCaptured = false;
  }

  function handleTouchMove(event) {
    if (document.documentElement.classList.contains("intro-loading")) {
      event.preventDefault();
      return;
    }
    if (!touchOrigin || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touchOrigin.x - touch.clientX;
    const deltaY = touchOrigin.y - touch.clientY;
    if (Math.abs(deltaY) <= 8 || Math.abs(deltaY) <= Math.abs(deltaX)) return;

    const direction = Math.sign(deltaY);
    const atBoundary = !isNavigating && ((direction < 0 && settledFrame === 0)
      || (direction > 0 && settledFrame === frameProgress.length - 1));
    if (atBoundary) {
      if (portalLocked) releasePortalLock(direction > 0 ? "end" : "start");
      return;
    }

    event.preventDefault();
    touchCaptured = true;
    touchDistance = deltaY;
  }

  function handleTouchEnd() {
    if (touchCaptured && Math.abs(touchDistance) > 35) {
      const direction = Math.sign(touchDistance);
      if (!portalLocked) beginPortalLock(settledFrame, direction);
      requestFrameStep(direction);
    }
    touchOrigin = null;
    touchDistance = 0;
    touchCaptured = false;
  }

  function screenFocalPoint(image, sourceX, sourceY) {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!image.naturalWidth || !image.naturalHeight || !width || !height) return { x: sourceX, y: sourceY };
    const coverScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * coverScale;
    const renderedHeight = image.naturalHeight * coverScale;
    const offsetX = (width - renderedWidth) / 2;
    const offsetY = (height - renderedHeight) / 2;
    return {
      x: (sourceX * renderedWidth + offsetX) / width,
      y: (sourceY * renderedHeight + offsetY) / height,
    };
  }

  function placeFocus(image, sourcePoint, zoom, opacity, brightness, blur = 0) {
    const focus = screenFocalPoint(image, sourcePoint.x, sourcePoint.y);
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const shiftX = (0.5 - focus.x) * (zoom - 1) * width;
    const shiftY = (0.5 - focus.y) * (zoom - 1) * height;
    image.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0) scale(${zoom.toFixed(3)})`;
    image.style.opacity = clamp(opacity).toFixed(3);
    image.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
  }

  function pulse(value, start, peak, end) {
    if (value <= start || value >= end) return 0;
    return value < peak ? smooth(range(value, start, peak)) : 1 - smooth(range(value, peak, end));
  }

  function updateInformation(sceneIndex) {
    if (sceneIndex === announcedScene) return;
    announcedScene = sceneIndex;
    const formattedIndex = String(sceneIndex + 1).padStart(2, "0");
    counter.textContent = `${formattedIndex} / 03`;
    if (frameIndex) frameIndex.textContent = formattedIndex;
    status.textContent = `Сцена ${sceneIndex + 1}: ${labels[sceneIndex]}`;
    stage.dataset.scene = String(sceneIndex + 1);

    frameInfos.forEach((info, index) => {
      const active = index === sceneIndex;
      info.classList.toggle("is-active", active);
      info.setAttribute("aria-hidden", String(!active));
      info.inert = !active;
    });
    stage.querySelectorAll(".portal-scene").forEach((scene, index) => {
      scene.classList.toggle("is-active", index === sceneIndex);
    });
  }

  function render() {
    renderFrame = 0;
    const progress = portalLocked ? visualProgress : frameProgress[settledFrame];

    const curtainMove = smooth(range(progress, 0.13, 0.31));
    const curtainOpacity = 1 - smooth(range(progress, 0.25, 0.315));
    placeFocus(curtains, { x: 0.5, y: 0.52 }, mix(1, 3.2, curtainMove), curtainOpacity,
      mix(1, 0.12, curtainMove), mix(0, 2.2, curtainMove));

    const rabbitReveal = smooth(range(progress, 0.29, 0.53));
    const secondEyeZoom = smooth(range(progress, 0.58, 0.82));
    const rabbitZoom = mix(118, 1, rabbitReveal) * mix(1, 118, secondEyeZoom);
    const rabbitOpacity = smooth(range(progress, 0.265, 0.315)) * (1 - smooth(range(progress, 0.785, 0.835)));
    const rabbitBrightness = mix(mix(0.16, 1, rabbitReveal), 0.12, secondEyeZoom);
    const rabbitBlur = mix(1.4, 0, rabbitReveal) + secondEyeZoom * 1.1;
    const rabbitFocus = { x: 0.456, y: 0.402 };
    const currentEye = { x: mix(rabbitFocus.x, 0.548, secondEyeZoom), y: mix(rabbitFocus.y, 0.401, secondEyeZoom) };
    placeFocus(rabbit, currentEye, rabbitZoom, rabbitOpacity, rabbitBrightness, rabbitBlur);

    const magicianReveal = smooth(range(progress, 0.79, 0.99));
    const magicianOpacity = smooth(range(progress, 0.765, 0.815));
    placeFocus(magician, { x: 0.5, y: 0.43 }, mix(118, 1, magicianReveal), magicianOpacity,
      mix(0.1, 1, magicianReveal));

    const blackoutOpacity = Math.max(
      pulse(progress, 0.265, 0.305, 0.35) * 0.3,
      pulse(progress, 0.75, 0.805, 0.855) * 0.42,
    );
    blackout.style.opacity = blackoutOpacity.toFixed(3);
    const passageDarkness = Math.max(pulse(progress, 0.265, 0.305, 0.35), pulse(progress, 0.75, 0.805, 0.855));
    const interfaceOpacity = (1 - passageDarkness).toFixed(3);
    if (heroInner) heroInner.style.opacity = interfaceOpacity;
    if (socialRail) socialRail.style.opacity = interfaceOpacity;
    if (topbar) topbar.style.opacity = interfaceOpacity;
    counter.style.opacity = interfaceOpacity;

    const sceneIndex = progress < 0.30 ? 0 : progress < 0.81 ? 1 : 2;
    updateInformation(sceneIndex);
    cue?.classList.toggle("is-scrolling", progress > 0.025);
  }

  function scheduleRender() {
    if (renderFrame) return;
    renderFrame = window.requestAnimationFrame(render);
  }

  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("resize", scheduleRender, { passive: true });
  window.addEventListener("pageshow", scheduleRender);
  window.addEventListener("load", scheduleRender, { once: true });
  window.addEventListener("orientationchange", scheduleRender, { passive: true });
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleInternalLink);
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
  scheduleRender();
})();
