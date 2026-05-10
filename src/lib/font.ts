/**
 * Font Management System
 * Manages font selection and persistence via localStorage
 * Supports multiple heading and body font combinations
 */

export type HeadingFont = 'manrope' | 'fraunces' | 'bricolage' | 'playfair' | 'space' | 'sora';
export type BodyFont = 'inter' | 'manrope' | 'dm' | 'fraunces';

export interface FontPreset {
  heading: HeadingFont;
  body: BodyFont;
  label: string;
}

const FONT_KEY = 'chronovah-font';

export const HEADING_FONTS: { value: HeadingFont; label: string }[] = [
  { value: 'fraunces', label: 'Fraunces' },
  { value: 'manrope', label: 'Manrope' },
  { value: 'bricolage', label: 'Bricolage Grotesque' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'space', label: 'Space Grotesk' },
  { value: 'sora', label: 'Sora' },
];

export const BODY_FONTS: { value: BodyFont; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'manrope', label: 'Manrope' },
  { value: 'dm', label: 'DM Sans' },
  { value: 'fraunces', label: 'Fraunces' },
];

export const FONT_PRESETS: FontPreset[] = [
  { heading: 'fraunces', body: 'inter', label: 'Fraunces + Inter (Default)' },
  { heading: 'manrope', body: 'manrope', label: 'Manrope + Manrope' },
  { heading: 'bricolage', body: 'dm', label: 'Bricolage + DM Sans' },
  { heading: 'playfair', body: 'manrope', label: 'Playfair + Manrope' },
  { heading: 'space', body: 'inter', label: 'Space Grotesk + Inter' },
  { heading: 'sora', body: 'dm', label: 'Sora + DM Sans' },
];

/**
 * Get the currently stored font preference from localStorage
 */
export function getStoredFont(): { heading: HeadingFont; body: BodyFont } {
  try {
    const stored = localStorage.getItem(FONT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isValidFont(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to read font from localStorage:', error);
  }
  return { heading: 'fraunces', body: 'inter' };
}

/**
 * Check if an object is a valid font configuration
 */
function isValidFont(value: unknown): value is { heading: HeadingFont; body: BodyFont } {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  
  const validHeadings: HeadingFont[] = ['manrope', 'fraunces', 'bricolage', 'playfair', 'space', 'sora'];
  const validBodies: BodyFont[] = ['inter', 'manrope', 'dm', 'fraunces'];
  
  return (
    typeof obj.heading === 'string' && validHeadings.includes(obj.heading as HeadingFont) &&
    typeof obj.body === 'string' && validBodies.includes(obj.body as BodyFont)
  );
}

/**
 * Apply a font by setting the appropriate classes on the document root
 */
export function applyFont(heading: HeadingFont, body: BodyFont): void {
  const root = document.documentElement;

  // Remove all font classes
  HEADING_FONTS.forEach(font => {
    root.classList.remove(`font-heading-${font.value}`);
  });
  BODY_FONTS.forEach(font => {
    root.classList.remove(`font-body-${font.value}`);
  });

  // Add the new font classes
  root.classList.add(`font-heading-${heading}`, `font-body-${body}`);
}

/**
 * Set fonts, save to localStorage, and apply them
 */
export function setFont(heading: HeadingFont, body: BodyFont): void {
  const fontConfig = { heading, body };
  try {
    localStorage.setItem(FONT_KEY, JSON.stringify(fontConfig));
    applyFont(heading, body);
  } catch (error) {
    console.error('Failed to save font to localStorage:', error);
    // Still apply the font even if localStorage fails
    applyFont(heading, body);
  }
}

/**
 * Initialize fonts from localStorage on app startup
 * Should be called once in App.tsx or main layout component
 */
export function initializeFont(): void {
  const font = getStoredFont();
  applyFont(font.heading, font.body);
}
