import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { availableModesFor } from "../../utils/themes";
import { useDensity } from "../../contexts/DensityContext";
import { THEMES, DENSITY_OPTIONS, FONT_OPTIONS, DEFAULT_FONT, applyFont } from "../../constants/settings";

interface Props { onClose: () => void; }

export default function SettingsDrawer({ onClose }: Props) {
  const { theme, mode, setTheme, setMode } = useTheme();
  const { density, setDensity } = useDensity();

  const [font, setFontState] = useState(() => localStorage.getItem("twomice_font") ?? DEFAULT_FONT);

  function setFont(f: string) {
    setFontState(f);
    applyFont(f);
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
