/* ==========================================================================
   Navigation — Backpack Inventory, Scroll-Aware, Hamburger, Smooth Links
   "Hasbi's Adventure Journal"
   ========================================================================== */

import { debounce, scrollToSection } from './utilities.js';

/**
 * @class Navigation
 * Manages the backpack-style nav bar: scroll effects, hamburger toggle,
 * active link highlight, keyboard accessibility.
 */
export class Navigation {
  /** @param {string} navSelector - CSS selector for the <nav> element */
  constructor(navSelector = '.nav') {
    this.nav = document.querySelector(navSelector);
    if (!this.nav) return;

    this.menu     = this.nav.querySelector('.backpack');
    this.links    = this.nav.querySelectorAll('.backpack__slot');
    this.hamburger = this.nav.querySelector('.hamburger');

    this.sections = [];
    this.isOpen = false;
    this._currentActiveId = '';

    this._init();
  }

  /* ── Initialise ────────────────────────────────────────────────────── */
  _init() {
    this._collectSections();
    this._handleScroll();
    this._handleLinkClicks();
    this._setupHamburger();
    this._handleResize();

    this._setActiveFromHash();

    // Listen for scroll (debounced)
    window.addEventListener('scroll', debounce(() => this._handleScroll(), 50), { passive: true });
    window.addEventListener('hashchange', () => this._setActiveFromHash());
  }

  /* ── Set active link from URL hash on page load ────────────────────── */
  _setActiveFromHash() {
    const hash = window.location.hash || '#hero';
    const activeLink = this.nav.querySelector(`.backpack__slot[href="${hash}"]`);
    if (activeLink) {
      this.links.forEach(l => l.classList.remove('nav__link--active'));
      activeLink.classList.add('nav__link--active');
      this._currentActiveId = hash.slice(1);
    }
  }

  /* ── Handle resize — close menu on desktop ─────────────────────────── */
  _handleResize() {
    const closeOnDesktop = () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this._closeMenu();
      }
    };
    window.addEventListener('resize', debounce(closeOnDesktop, 150));
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

    // If we're past the last section, keep the last one active
    if (!currentId && this.sections.length > 0) {
      const last = this.sections[this.sections.length - 1];
      const lastBottom = last.el.offsetTop + last.el.offsetHeight - offset;
      if (scrollY >= lastBottom) {
        currentId = last.id;
      }
    }

    if (currentId && currentId !== this._currentActiveId) {
      this.links.forEach(link => link.classList.remove('nav__link--active'));
      const activeLink = this.nav.querySelector(`.backpack__slot[href="#${currentId}"]`);
      if (activeLink) {
        activeLink.classList.add('nav__link--active');
        this._currentActiveId = currentId;
      }
    }

    // Also handle when user is at the very top
    if (scrollY < offset) {
      this.links.forEach(link => link.classList.remove('nav__link--active'));
      const homeLink = this.nav.querySelector(`.backpack__slot[href="#hero"]`);
      if (homeLink) {
        homeLink.classList.add('nav__link--active');
        this._currentActiveId = 'hero';
      }
    }
  }

  /* ── Link Click → Smooth Scroll + Close Menu ────────────────────────── */
  _handleLinkClicks() {
    // Event delegation on the menu element — more performant
    this.menu?.addEventListener('click', e => {
      const link = e.target.closest('.backpack__slot');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        // Update active state immediately
        this.links.forEach(l => l.classList.remove('nav__link--active'));
        link.classList.add('nav__link--active');
        this._currentActiveId = href.slice(1);

        // Smooth scroll
        scrollToSection(href);

        // Close mobile menu
        this._closeMenu();
      }
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
        this.hamburger?.focus();
      }
    });

    // Trap focus inside menu when open
    this.menu?.addEventListener('keydown', e => {
      if (e.key === 'Tab' && this.isOpen) {
        const focusable = this.menu.querySelectorAll('.backpack__slot');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });
  }

  _openMenu() {
    this.isOpen = true;
    this.menu?.classList.add('backpack--open');
    this.hamburger?.classList.add('hamburger--active');
    this.hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first menu item
    const firstLink = this.menu?.querySelector('.backpack__slot');
    setTimeout(() => firstLink?.focus(), 100);
  }

  _closeMenu() {
    this.isOpen = false;
    this.menu?.classList.remove('backpack--open');
    this.hamburger?.classList.remove('hamburger--active');
    this.hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
