/**
 * Surface Style System
 * Controls the background/card/border color palette independently of dark mode.
 *
 * cool (default) — blue-tinted neutrals, matches the current deployed app
 * warm           — warm off-white/near-black neutrals
 *
 * Works in all 4 combinations:
 *   cool + light, cool + dark, warm + light, warm + dark
 */

export type Surface = 'cool' | 'warm';

const SURFACE_KEY = 'chronovah-surface';

export const SURFACES: { name: Surface; label: string; description: string }[] = [
  { name: 'cool', label: 'Cool',  description: 'Blue-tinted neutrals' },
  { name: 'warm', label: 'Warm',  description: 'Warm off-white tones' },
];

export function getStoredSurface(): Surface {
  try {
    const v = localStorage.getItem(SURFACE_KEY);
    if (v === 'cool' || v === 'warm') return v;
  } catch {
    // ignore
  }
  return 'cool'; // default — matches current deployed app
}

/**
 * Apply surface by toggling a single class on <html>.
 * cool = no class (default CSS values)
 * warm = surface-warm class
 */
export function applySurface(surface: Surface): void {
  const root = document.documentElement;
  if (surface === 'warm') {
    root.classList.add('surface-warm');
  } else {
    root.classList.remove('surface-warm');
  }
}

export function setSurface(surface: Surface): void {
  try {
    localStorage.setItem(SURFACE_KEY, surface);
  } catch {
    // ignore
  }
  applySurface(surface);
}

export function initializeSurface(): void {
  applySurface(getStoredSurface());
}
