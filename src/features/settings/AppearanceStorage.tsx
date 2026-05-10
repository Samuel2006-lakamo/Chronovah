import { useDarkMode } from "../../hooks/useDarkMode";
import { Database, Moon, Sun, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useStorage } from "../../hooks/useStorage";
import ProgressInput from "./ProgressInput";
import { THEMES, getStoredTheme, setTheme, getThemeColor, type Theme } from "../../lib/theme";
import { HEADING_FONTS, BODY_FONTS, FONT_PRESETS, getStoredFont, setFont, type HeadingFont, type BodyFont } from "../../lib/font";
import { SURFACES, getStoredSurface, setSurface, type Surface } from "../../lib/surface";

export default function AppearanceStorage() {
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const { storageUsed, usedValue, max } = useStorage();
  const [currentTheme, setCurrentTheme] = useState<Theme>('ocean');
  const [currentSurface, setCurrentSurface] = useState<Surface>('cool');
  const [currentHeadingFont, setCurrentHeadingFont] = useState<HeadingFont>('manrope');
  const [currentBodyFont, setCurrentBodyFont] = useState<BodyFont>('inter');

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
    setCurrentSurface(getStoredSurface());
    const font = getStoredFont();
    setCurrentHeadingFont(font.heading);
    setCurrentBodyFont(font.body);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  const handleHeadingFontChange = (font: HeadingFont) => {
    setCurrentHeadingFont(font);
    setFont(font, currentBodyFont);
  };

  const handleBodyFontChange = (font: BodyFont) => {
    setCurrentBodyFont(font);
    setFont(currentHeadingFont, font);
  };

  return (
    <div className="bg-default mb-4 rounded-2xl p-5 shadow space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-primary">
        Appearance & Storage
      </h2>

      {/* Dark/Light Mode Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="text-sm sm:text-base text-muted">
            Mode: {isDarkMode ? "Dark" : "Light"}
          </span>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-card text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline">Toggle</span>
          </button>
        </div>
      </div>

      {/* Surface Style */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-primary">Surface Style</h3>
          <p className="text-xs text-muted mt-0.5">Controls background and card colors in both light and dark mode.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SURFACES.map((s) => {
            const isActive = currentSurface === s.name;
            // Preview swatches: [bg, card, border]
            const swatches = s.name === 'cool'
              ? ['#f9fafb', '#ffffff', '#e5e7eb']
              : ['#F7F4F0', '#FFFFFF', '#D8D3CB'];
            return (
              <button
                key={s.name}
                onClick={() => { setCurrentSurface(s.name); setSurface(s.name); }}
                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                  isActive ? 'border-primary-500 bg-primary-500/5' : 'border-default hover:border-primary-500/40'
                }`}
              >
                {/* Mini preview */}
                <div className="flex gap-1 mb-2">
                  {swatches.map((color, i) => (
                    <div
                      key={i}
                      className="h-5 flex-1 rounded"
                      style={{ backgroundColor: color, border: `1px solid ${swatches[2]}` }}
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-primary">{s.label}</p>
                <p className="text-xs text-muted">{s.description}</p>
                {isActive && (
                  <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-0.5">
                    <Check size={10} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary">Theme</h3>        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme.name)}
              className={`relative p-2 sm:p-3 rounded-lg border-2 transition-all ${
                currentTheme === theme.name
                  ? 'border-primary bg-primary/5'
                  : 'border-default hover:border-primary/50'
              }`}
            >
              {/* Color swatch */}
              <div
                className="w-full h-8 sm:h-10 rounded-md mb-1.5 sm:mb-2 shadow-sm"
                style={{ backgroundColor: getThemeColor(theme.name) }}
              />
              
              {/* Theme name */}
              <p className="text-xs font-medium text-primary text-center">{theme.label}</p>
              <p className="text-xs text-muted text-center hidden sm:block">{theme.description}</p>

              {/* Checkmark for active theme */}
              {currentTheme === theme.name && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-primary text-white rounded-full p-0.5 sm:p-1">
                  <Check size={12} className="sm:w-3.5 sm:h-3.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Fonts</h3>
        
        {/* Font Presets */}
        <div className="space-y-2">
          <label className="text-xs text-muted">Quick Presets</label>
          <select
            value={`${currentHeadingFont}-${currentBodyFont}`}
            onChange={(e) => {
              const [heading, body] = e.target.value.split('-') as [HeadingFont, BodyFont];
              setCurrentHeadingFont(heading);
              setCurrentBodyFont(body);
              setFont(heading, body);
            }}
            className="w-full px-3 py-2 bg-card border border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
          >
            {FONT_PRESETS.map((preset) => (
              <option key={`${preset.heading}-${preset.body}`} value={`${preset.heading}-${preset.body}`}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Heading Font */}
        <div className="space-y-2">
          <label className="text-xs text-muted">Heading Font</label>
          <select
            value={currentHeadingFont}
            onChange={(e) => handleHeadingFontChange(e.target.value as HeadingFont)}
            className="w-full px-3 py-2 bg-card border border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
          >
            {HEADING_FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Body Font */}
        <div className="space-y-2">
          <label className="text-xs text-muted">Body Font</label>
          <select
            value={currentBodyFont}
            onChange={(e) => handleBodyFontChange(e.target.value as BodyFont)}
            className="w-full px-3 py-2 bg-card border border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
          >
            {BODY_FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Preview */}
        <div className="bg-card border border-default rounded-lg p-3 space-y-2">
          <p style={{ fontFamily: `var(--font-heading-${currentHeadingFont})` }} className="text-sm font-bold">
            This is your heading font
          </p>
          <p style={{ fontFamily: `var(--font-body-${currentBodyFont})` }} className="text-xs">
            This is your body font. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>

      {/* Storage Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Database size={16} className="text-muted shrink-0" />
          <span className="text-muted">Storage Used</span>
          <span className="ml-auto font-medium text-primary">{storageUsed}</span>
        </div>
        <ProgressInput min={0} max={max} value={usedValue} onChange={() => {}} />
      </div>
    </div>
  );
}


