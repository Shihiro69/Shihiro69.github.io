/* ==========================================================================
   Navigation — Scroll-Aware Nav, Hamburger, Smooth Links
   "Hasbi's Adventure Journal"
   ========================================================================== */

import { debounce, scrollToSection } from './utilities.js';

/**
 * @class Navigation
 * Manages the fixed nav bar: scroll effects, hamburger toggle, active links.
 */
export class Navigation {
  /** @param {string} navSelector - CSS selector for the <nav> element */
  constructor(navSelector = '.nav') {
    this.nav = document.querySelector(navSelector);
    if (!this.nav) return;

    this.menu  = this.nav.querySelector('.nav__menu');
    this.links = this.nav.querySelectorAll('.nav__link');
    this.hamburger = this.nav.querySelector('.hamburger');

    this.sections = [];
    this.isOpen = false;

    this._init();
  }

  /* ── Initialise ────────────────────────────────────────────────────── */
  _init() {
    this._collectSections();
    this._handleScroll();
    this._handleLinkClicks();
    this._setupHamburger();

    // Listen for scroll (debounced)
    window.addEventListener('scroll', debounce(() => this._handleScroll(), 50), { passive: true });
    window.addEventListener('resize', debounce(() => this._handleScroll(), 100));
  }

  /* ── Collect sections for active-link tracking ──────────────────────── */
  _collectSections() {
    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          this.sections.push({ id: href.slice(1), el: section, link });
        }
      }
    });
  }

  /* ── Scroll Handler ──────────────────────────────────────────────────── */
  _handleScroll() {
    const scrollY = window.scrollY;

    // Toggle .nav--scrolled
    if (scrollY > 60) {
      this.nav.classList.add('nav--scrolled');
    } else {
      this.nav.classList.remove('nav--scrolled');
    }

    // Active link highlight
    this._updateActiveLink(scrollY);
  }

  /* ── Update Active Nav Link ──────────────────────────────────────────── */
  _updateActiveLink(scrollY) {
    const offset = 120;
    let currentId = '';

    for (const s of this.sections) {
      if (!s.el) continue;
      const top = s.el.offsetTop - offset;
      const bottom = top + s.el.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = s.id;
        break;
      }
    }

    this.links.forEach(link => link.classList.remove('nav__link--active'));
    if (currentId) {
      const activeLink = this.nav.querySelector(`a[href="#${currentId}"]`);
      if (activeLink) activeLink.classList.add('nav__link--active');
    }
  }

  /* ── Link Click → Smooth Scroll + Close Menu ────────────────────────── */
  _handleLinkClicks() {
    this.links.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          scrollToSection(href);
          this._closeMenu();
        }
      });
    });
  }

  /* ── Hamburger Menu ──────────────────────────────────────────────────── */
  _setupHamburger() {
    if (!this.hamburger) return;
    this.hamburger.addEventListener('click', () => {
      this.isOpen ? this._closeMenu() : this._openMenu();
    });

    // Close on overlay click (outer area tap)
    document.addEventListener('click', e => {
      if (this.isOpen && !this.nav.contains(e.target)) {
        this._closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this._closeMenu();
      }
    });
  }

  _openMenu() {
    this.isOpen = true;
    this.menu?.classList.add('nav__menu--open');
    this.hamburger?.classList.add('hamburger--active');
    document.body.style.overflow = 'hidden';
  }

  _closeMenu() {
    this.isOpen = false;
    this.menu?.classList.remove('nav__menu--open');
    this.hamburger?.classList.remove('hamburger--active');
    document.body.style.overflow = '';
  }
}
