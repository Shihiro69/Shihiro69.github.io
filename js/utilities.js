/* ==========================================================================
   Utilities — Helpers & Constants
   "Hasbi's Adventure Journal"
   ========================================================================== */

/**
 * Debounce a function call by a delay.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function — ensures it runs at most once per interval.
 * @param {Function} fn
 * @param {number} interval - milliseconds
 * @returns {Function}
 */
export function throttle(fn, interval = 100) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

/**
 * Check if an element is in the viewport.
 * @param {HTMLElement} el
 * @param {number} offset - px from edge to trigger early
 * @returns {boolean}
 */
export function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  const winH = window.innerHeight;
  return rect.top < winH - offset && rect.bottom > offset;
}

/**
 * Create a DOM element with attributes and children.
 * @param {string} tag
 * @param {object} attrs - key-value attributes & properties
 * @param  {...(string|HTMLElement)} children
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'html') {
      el.innerHTML = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      el.appendChild(child);
    }
  }
  return el;
}

/**
 * Smooth scroll to an element by selector.
 * @param {string} selector
 */
export function scrollToSection(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Load JSON data from a URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} — ${res.status}`);
  return res.json();
}

/**
 * Random number in a range.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Current year helper (for footer copyright).
 * @returns {number}
 */
export function currentYear() {
  return new Date().getFullYear();
}
