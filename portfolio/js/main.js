/* ==========================================================================
   Main Entry Point — "Hasbi's Adventure Journal"
   Bootstraps all modules & scene
   ========================================================================== */

import { Navigation } from './navigation.js';
import { Character } from './character.js';
import { World } from './world.js';
import { currentYear } from './utilities.js';

/* ── App Initialisation ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  /* Navigation */
  const nav = new Navigation('.nav');

  /* Character */
  const hero = new Character({
    container: '#character-avatar',
    name: 'Muhammad Adryan Hasbi',
    level: 22,
  });
  hero.render();

  /* World (projects) */
  const world = new World({ dataPath: './data/projects.json' });
  await world.init();

  /* Footer year */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = currentYear();
});
