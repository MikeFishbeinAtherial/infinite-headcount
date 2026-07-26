// presenter.js — auto-loom page-side library
// Injected by render.mjs via page.addScriptTag() before every beat.
// render.mjs dispatches actions with window.VCEPresent.exec({fn, sel, opts}).

(function () {
  'use strict';

  const STYLE_ID = 'vn-highlight-styles';

  function rectFor(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .vn-hl {
        outline: 3px solid #85FF0A !important;
        outline-offset: 4px;
        border-radius: 6px;
        position: relative;
        z-index: 9998;
      }
      @keyframes vn-pulse {
        0%   { box-shadow: 0 0 0 0   rgba(133,255,10,0.55); }
        60%  { box-shadow: 0 0 0 14px rgba(133,255,10,0); }
        100% { box-shadow: 0 0 0 0   rgba(133,255,10,0); }
      }
      .vn-hl-pulse {
        animation: vn-pulse 0.7s ease-out;
      }
    `;
    document.head.appendChild(s);
  }

  function resolve(sel) {
    if (!sel) return null;
    if (sel instanceof Element) return sel;
    return document.querySelector(sel);
  }

  function resolveAll(sel) {
    if (!sel) return [];
    if (sel instanceof Element) return [sel];
    return [...document.querySelectorAll(sel)];
  }

  const VCEPresent = {
    scrollToEl(sel, opts = {}) {
      const el = resolve(sel);
      if (!el) { console.warn('[vn] scrollToEl: not found', sel); return null; }
      el.scrollIntoView({ behavior: opts.instant ? 'instant' : 'smooth', block: 'center' });
      return rectFor(el);
    },

    hl(sel) {
      const els = Array.isArray(sel)
        ? sel.flatMap(s => resolveAll(s))
        : resolveAll(sel);
      if (!els.length) { console.warn('[vn] hl: not found', sel); return null; }
      ensureStyles();
      els.forEach(el => {
        el.classList.remove('vn-hl', 'vn-hl-pulse');
        void el.offsetWidth;
        el.classList.add('vn-hl', 'vn-hl-pulse');
      });
      return rectFor(els[0]);
    },

    unhl(sel) {
      const targets = sel ? resolveAll(sel) : document.querySelectorAll('.vn-hl');
      [...targets].forEach(el => el.classList.remove('vn-hl', 'vn-hl-pulse'));
    },

    expand(sel) {
      const el = resolve(sel);
      if (!el) { console.warn('[vn] expand: not found', sel); return; }
      if (!el.classList.contains('open')) el.classList.add('open');
      el.click();
    },

    clickEl(sel) {
      const el = resolve(sel);
      if (!el) { console.warn('[vn] clickEl: not found', sel); return null; }
      el.click();
      return rectFor(el);
    },

    nodeByText(pattern) {
      const re = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
      return [...document.querySelectorAll('*')].find(
        el => el.children.length === 0 && re.test(el.textContent)
      ) ?? null;
    },

    // Dispatch an action object — called by render.mjs via page.evaluate()
    exec({ fn, sel, opts } = {}) {
      if (typeof this[fn] === 'function') return this[fn](sel, opts ?? undefined);
      console.warn('[vn] unknown action fn:', fn);
    },

    // Single-page renderRun for non-multi-page use cases
    async renderRun(durations = []) {
      const beats = this._beats;
      if (!beats) { console.warn('[vn] No beats. Call VideoNote.mount(BEATS) first.'); return; }
      for (let i = 0; i < beats.length; i++) {
        const beat = beats[i];
        const ms = (durations[i] ?? 5) * 1000;
        if (typeof beat.enter === 'function') beat.enter();
        await new Promise(r => setTimeout(r, ms));
        if (typeof beat.exit === 'function') beat.exit();
      }
    },

    _beats: null,
    _durations: null,
  };

  window.VCEPresent = VCEPresent;

  window.VideoNote = {
    mount(beats, opts = {}) {
      VCEPresent._beats = beats;
      if (opts.durations) VCEPresent._durations = opts.durations;
      console.log('[vn] mounted', beats.length, 'beats');
      return VCEPresent;
    },
  };
})();
