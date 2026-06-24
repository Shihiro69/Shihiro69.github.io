/* ==========================================================================
   World — Project Data, Section Rendering, Scene Management
   "Hasbi's Adventure Journal"
   ========================================================================== */

import { createElement, fetchJSON, isInViewport } from './utilities.js';

/**
 * @class World
 * Manages the portfolio world: loads project data, renders sections,
 * handles scroll-based reveals.
 */
export class World {
  /**
   * @param {object} options
   * @param {string} options.dataPath - Path to projects.json
   */
  constructor(options = {}) {
    this.dataPath = options.dataPath || './data/projects.json';
    this.projects = [];
  }

  /** Bootstrap the world — load data, render sections */
  async init() {
    try {
      this.projects = await this._loadProjects();
    } catch {
      console.warn('⚠️  Could not load projects.json — running with empty data.');
      this.projects = [];
    }

    this._renderProjects();
    this._setupRevealObserver();
  }

  /* ── Load Project Data ──────────────────────────────────────────────── */
  async _loadProjects() {
    const data = await fetchJSON(this.dataPath);
    return Array.isArray(data.projects) ? data.projects : data;
  }

  /* ── Render Projects Section ────────────────────────────────────────── */
  _renderProjects() {
    const grid = document.querySelector('#project-grid');
    if (!grid) return;

    if (this.projects.length === 0) {
      grid.innerHTML = `
        <div class="text-center" style="grid-column: 1 / -1; padding: var(--space-12)">
          <p style="color: var(--clr-text-muted); font-size: var(--text-lg);">
            🗺️  No quests completed yet — stay tuned!
          </p>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    this.projects.forEach((project, index) => {
      const card = this._createProjectCard(project, index);
      grid.appendChild(card);
    });
  }

  /* ── Single Project Card ────────────────────────────────────────────── */
  _createProjectCard(project, index) {
    const tags = (project.tags || [])
      .map(t => `<span class="badge badge--accent">${t}</span>`)
      .join(' ');

    const banner = project.image
      ? createElement('img', {
          className: 'project-card__banner',
          src: project.image,
          alt: `${project.title} preview`,
          loading: 'lazy',
        })
      : createElement('div', { className: 'project-card__banner' });

    const card = createElement('article', {
      className: `project-card reveal reveal--scale delay-${Math.min((index % 8) * 100, 700)}`,
    });

    const body = createElement('div', { className: 'project-card__body' });
    body.appendChild(createElement('h3', { className: 'project-card__title' }, project.title));
    body.appendChild(createElement('p', { className: 'project-card__description' }, project.description));

    if (tags) {
      const tagWrap = createElement('div', {
        className: 'flex flex--wrap',
        style: 'gap: var(--space-2); margin-bottom: var(--space-4);',
        html: tags,
      });
      body.appendChild(tagWrap);
    }

    if (project.url || project.github) {
      const links = createElement('div', { className: 'flex', style: 'gap: var(--space-3);' });
      if (project.url) {
        links.appendChild(createElement('a', {
          className: 'btn btn--primary',
          href: project.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          html: '🔗 Live Demo',
        }));
      }
      if (project.github) {
        links.appendChild(createElement('a', {
          className: 'btn btn--secondary',
          href: project.github,
          target: '_blank',
          rel: 'noopener noreferrer',
          html: '📂 Source',
        }));
      }
      body.appendChild(links);
    }

    card.appendChild(banner);
    card.appendChild(body);
    return card;
  }

  /* ── Intersection Observer for Scroll Reveals ───────────────────────── */
  _setupRevealObserver() {
    const els = document.querySelectorAll('.reveal');
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => observer.observe(el));
  }
}
