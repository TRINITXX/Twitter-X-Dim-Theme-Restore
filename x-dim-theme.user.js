// ==UserScript==
// @name         X.com Dim Theme Restore
// @namespace    x-dim-theme
// @version      3.0
// @description  Restore the blue "Dim" theme on X.com (data-theme + RN Web overrides)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Dim theme colors
  const DIM_BG = '#15202B';
  const DIM_BORDER = '#38444D';
  const DIM_PRIMARY_TEXT = '#F7F9F9';
  const DIM_SECONDARY_TEXT = '#8B98A5';

  const DARK_SELECTOR = 'html[data-theme="dim"]';

  const css = `
    /* ===== Body ===== */
    ${DARK_SELECTOR} body {
      background-color: ${DIM_BG} !important;
      scrollbar-color: ${DIM_BORDER} ${DIM_BG} !important;
    }

    /* ===== RN Web: black background class ===== */
    ${DARK_SELECTOR} .r-kemksi {
      background-color: ${DIM_BG} !important;
    }

    /* ===== Inline black backgrounds ===== */
    ${DARK_SELECTOR} div[style*="background-color: rgb(0, 0, 0)"] {
      background-color: ${DIM_BG} !important;
    }

    /* ===== Sticky header: semi-transparent black → semi-transparent dim ===== */
    ${DARK_SELECTOR} .r-5zmot {
      background-color: rgba(21, 32, 43, 0.65) !important;
    }

    /* ===== PRIMARY TEXT: Lights Out #E7E9EA → Dim #F7F9F9 ===== */
    ${DARK_SELECTOR} .r-1nao33i {
      color: ${DIM_PRIMARY_TEXT} !important;
    }
    ${DARK_SELECTOR} [style*="color: rgb(231, 233, 234)"] {
      color: ${DIM_PRIMARY_TEXT} !important;
    }

    /* ===== SECONDARY TEXT: Lights Out #71767B → Dim #8B98A5 ===== */
    ${DARK_SELECTOR} .r-1bwzh9t {
      color: ${DIM_SECONDARY_TEXT} !important;
    }
    ${DARK_SELECTOR} [style*="color: rgb(113, 118, 123)"] {
      color: ${DIM_SECONDARY_TEXT} !important;
    }

    /* ===== BORDERS: Lights Out #2F3336 → Dim #38444D ===== */
    ${DARK_SELECTOR} .r-1kqtdi0 {
      border-color: ${DIM_BORDER} !important;
    }
    ${DARK_SELECTOR} [style*="border-color: rgb(47, 51, 54)"] {
      border-color: ${DIM_BORDER} !important;
    }
    ${DARK_SELECTOR} [style*="border-bottom-color: rgb(47, 51, 54)"] {
      border-bottom-color: ${DIM_BORDER} !important;
    }
    ${DARK_SELECTOR} [style*="border-top-color: rgb(47, 51, 54)"] {
      border-top-color: ${DIM_BORDER} !important;
    }

    /* ===== Scrollbar (Webkit) ===== */
    ${DARK_SELECTOR} ::-webkit-scrollbar-track {
      background: ${DIM_BG} !important;
    }
    ${DARK_SELECTOR} ::-webkit-scrollbar-thumb {
      background-color: ${DIM_BORDER} !important;
    }
  `;

  function applyDimTheme() {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'dark') {
      html.setAttribute('data-theme', 'dim');
    }
    html.style.backgroundColor = DIM_BG;
  }

  function injectStyle() {
    if (document.getElementById('x-dim-theme-restore')) return;
    const style = document.createElement('style');
    style.id = 'x-dim-theme-restore';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function fixBodyBackground() {
    if (document.body) {
      document.body.style.backgroundColor = DIM_BG;
      document.body.style.scrollbarColor = `${DIM_BORDER} ${DIM_BG}`;
    }
  }

  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'attributes') continue;
        const el = mutation.target;

        if (el === document.documentElement && mutation.attributeName === 'data-theme') {
          if (el.getAttribute('data-theme') === 'dark') {
            el.setAttribute('data-theme', 'dim');
          }
        }

        if (el === document.body && mutation.attributeName === 'style') {
          const style = el.getAttribute('style') || '';
          if (style.includes('background-color: rgb(0, 0, 0)')) {
            el.style.backgroundColor = DIM_BG;
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
      });
      fixBodyBackground();
    } else {
      const bodyWatcher = new MutationObserver(() => {
        if (document.body) {
          bodyWatcher.disconnect();
          observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
          });
          fixBodyBackground();
        }
      });
      bodyWatcher.observe(document.documentElement, { childList: true });
    }
  }

  // Run at document-start
  applyDimTheme();
  injectStyle();
  observeChanges();
})();
