import { useState } from "react";
import { useTheme, availableModesFor, type Theme } from "../../contexts/ThemeContext";
import { useDensity, type Density } from "../../contexts/DensityContext";

const THEMES: { value: Theme; label: string; preview: [string, string, string] }[] = [
  { value: "fieldmouse", label: "Fieldmouse", preview: ["#faf5ee", "#8b4513", "#c8761a"] },
  { value: "midnight",   label: "Midnight",   preview: ["#f0eeff", "#7c6fcf", "#a090ef"] },
  { value: "urban-rat",  label: "Urban Rat",  preview: ["#f5f5f5", "#6b7280", "#9ca3af"] },
  { value: "forest",     label: "Forest",     preview: ["#f2f7f0", "#2d6a4f", "#52a878"] },
  { value: "slate",      label: "Slate",      preview: ["#f0f2f8", "#3d5a8a", "#5a7aaa"] },
  { value: "rosewood",   label: "Rosewood",   preview: ["#fdf4f4", "#8b2252", "#c45482"] },
  { value: "stark-light",label: "Stark Light",preview: ["#ffffff", "#000000", "#333333"] },
  { value: "stark-dark", label: "Stark Dark", preview: ["#000000", "#ffffff", "#cccccc"] },
  { value: "goldenrod",  label: "Goldenrod",  preview: ["#1a1200", "#ffd700", "#ffaa00"] },
];

const DENSITY_OPTIONS: { value: Density; label: string; desc: string }[] = [
  { value: "compact",     label: "Compact",     desc: "Reduced spacing"},
  { value: "comfortable", label: "Comfortable", desc: "Balanced (default)" },
  { value: "spacious",    label: "Spacious",    desc: "Extra breathing room"},
];

const FONT_OPTIONS: { id: string; label: string; desc: string }[] = [
  { id: "Inter",                 label: "Inter",                 desc: "Default — clean & modern"},
  { id: "Space Grotesk",         label: "Space Grotesk",         desc: "Geometric & technical"},
  { id: "Atkinson Hyperlegible", label: "Atkinson Hyperlegible", desc: "Optimised for readability"},
  { id: "OpenDyslexic",          label: "OpenDyslexic",          desc: "Dyslexia-friendly"},
];

interface Props { onClose: () => void; }

export default function SettingsDrawer({ onClose }: Props) {
  const { theme, mode, setTheme, setMode } = useTheme();
  const { density, setDensity } = useDensity();

  const [font, setFontState] = useState(() => localStorage.getItem("twomice_font") ?? "Inter");

  function setFont(f: string) {
    setFontState(f);
    localStorage.setItem("twomice_font", f);
    const fontValue = `'${f}', sans-serif`;
    document.body.style.fontFamily = fontValue;
    document.documentElement.style.setProperty("--font-body", fontValue);
  }

  const availModes = availableModesFor(theme);

  return (
    <div className="drawer-overlay">
      <div className="drawer-scrim" onClick={onClose} />
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-stripe" />
        <div className="drawer-header">
          <div className="drawer-title">Settings</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {/* Density */}
          <div className="set-group">
            <div className="settings-section-title">Density</div>
            <div className="set-btn-row">
              {DENSITY_OPTIONS.map(d => (
                <button key={d.value} className={`set-btn${density === d.value ? " set-btn--active" : ""}`}
                  onClick={() => setDensity(d.value)}>{d.label}</button>
              ))}
            </div>
            <div className="set-desc">{DENSITY_OPTIONS.find(d => d.value === density)?.desc}</div>
          </div>

          {/* Theme */}
          <div className="set-group">
            <div className="settings-section-title">Theme</div>
            <div className="set-swatch-grid">
              {THEMES.map(t => (
                <button key={t.value} className={`set-swatch${theme === t.value ? " set-swatch--active" : ""}`}
                  onClick={() => setTheme(t.value)}>
                  <div className="set-swatch-dots">
                    {t.preview.map((c, i) => <span key={i} className="set-swatch-dot" style={{ background: c }} />)}
                  </div>
                  <div className="set-swatch-label">{t.label}</div>
                </button>
              ))}
            </div>
            {availModes.length > 0 && (
              <>
                <div className="settings-section-title" style={{ marginBottom: "0.5rem" }}>Mode</div>
                <div className="set-btn-row">
                  {availModes.map(m => (
                    <button key={m} className={`set-btn${mode === m ? " set-btn--active" : ""}`}
                      onClick={() => setMode(m)}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reading Font */}
          <div className="set-group">
            <div className="settings-section-title">Reading Font</div>
            <div className="set-font-list">
              {FONT_OPTIONS.map(f => (
                <button key={f.id} className={`set-font-option${font === f.id ? " set-font-option--active" : ""}`}
                  onClick={() => setFont(f.id)}>
                  <span className="set-font-preview" style={{ fontFamily: `'${f.id}', sans-serif` }}>The quick brown fox</span>
                  <div style={{ flex: 1 }} />
                  <div style={{ textAlign: "right" }}>
                    <div className="set-font-label">{f.label}</div>
                    <div className="set-font-desc">{f.desc}</div>
                  </div>
                  {font === f.id && <span className="set-font-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Content toggles */}
          <div>
            <div className="settings-section-title">Content</div>
            {["Notifications", "Mark posts as read", "Autoplay GIFs"].map((label, idx) => (
              <div key={idx} className="set-toggle-row" style={idx === 2 ? { borderBottom: "none" } : undefined}>
                <span className="set-toggle-label">{label}</span>
                <div className="set-toggle-track"><div className="set-toggle-thumb" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
