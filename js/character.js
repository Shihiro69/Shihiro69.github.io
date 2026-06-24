/* ==========================================================================
   Character — The Hero Avatar & Stats System
   "Hasbi's Adventure Journal"
   ========================================================================== */

import { createElement } from './utilities.js';

/**
 * @class Character
 * Manages the player character avatar with sprite animation, name & level.
 */
export class Character {
  /**
   * @param {object} config
   * @param {string} config.container - Selector for the avatar mount point
   * @param {string} config.name - Character name
   * @param {number} config.level - Current level
   * @param {string} config.spritePath - Path to sprites folder
   * @param {number} config.frameCount - Number of idle frames (default 15)
   * @param {number} config.frameInterval - ms between frames (default 150)
   */
  constructor(config = {}) {
    this.name = config.name || 'Hasbi';
    this.level = config.level || 1;
    this.spritePath = config.spritePath || './assets/sprites/idle';
    this.frameCount = config.frameCount || 15;
    this.frameInterval = config.frameInterval || 90;
    this.container = document.querySelector(config.container || '#character-avatar');

    this.currentFrame = 0;
    this.frames = [];
    this._animFrameId = null;
  }

  /** Preload all sprite frames */
  _preloadFrames() {
    this.frames = [];
    for (let i = 1; i <= this.frameCount; i++) {
      const img = new Image();
      img.src = `${this.spritePath}/Idle ${i}.png`;
      this.frames.push(img);
    }
  }

  /** Render the avatar + info into the container */
  render() {
    if (!this.container) return;

    this._preloadFrames();

    /* Sprite image element */
    this._spriteEl = createElement('img', {
      className: 'character-sprite',
      src: this.frames[0]?.src || '',
      alt: `${this.name} idle animation`,
      draggable: 'false',
    });

    const avatar = createElement('div', { className: 'character-avatar' });
    avatar.appendChild(this._spriteEl);

    /* Info */
    const nameEl = createElement('h3', { className: 'character__name' }, this.name);
    const levelEl = createElement('span', { className: 'badge badge--accent' }, `Lv. ${this.level}`);

    const info = createElement('div', { className: 'character__info' });
    info.appendChild(nameEl);
    info.appendChild(levelEl);

    this.container.innerHTML = '';
    this.container.appendChild(avatar);
    this.container.appendChild(info);

    /* Start animation */
    this._startAnimation();
  }

  /** Cycle through sprite frames */
  _startAnimation() {
    if (this._animFrameId) return;
    this.currentFrame = 0;

    const tick = () => {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      if (this._spriteEl && this.frames[this.currentFrame]) {
        this._spriteEl.src = this.frames[this.currentFrame].src;
      }
      this._animFrameId = setTimeout(tick, this.frameInterval);
    };

    tick();
  }
}
