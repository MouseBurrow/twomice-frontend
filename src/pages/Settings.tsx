import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { availableModesFor } from "../utils/themes";
import { useDensity } from "../contexts/DensityContext";
import { THEMES, DENSITY_OPTIONS, FONT_OPTIONS, DEFAULT_FONT, applyFont } from "../constants/settings";
import MiniBtn from "../components/shared/MiniBtn";
import "../assets/Settings.scss";

export default function Settings() {
    const { theme, mode, setTheme, setMode } = useTheme();
    const { density, setDensity } = useDensity();

    const [font, setFontState] = useState(
        () => localStorage.getItem("twomice_font") ?? DEFAULT_FONT
    );

    function setFont(f: string) {
        setFontState(f);
        applyFont(f);
    }

    const availModes = availableModesFor(theme);

    return (
        <div className="settings-page">
            <div className="settings-board">
                <div className="settings-header">
                    <h1>Settings</h1>
                </div>

                {/* Appearance */}
                <section className="settings-section">
                    <h2>Appearance</h2>
                    <p className="settings-sub">Theme</p>
                    <div className="settings-swatch-grid">
                        {THEMES.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                className={`settings-swatch${theme === t.value ? " active" : ""}`}
                                onClick={() => setTheme(t.value)}
                                title={t.label}
                            >
                                <span className="swatch-dots">
                                    {t.preview.map((c, i) => (
                                        <span key={i} className="swatch-dot" style={{ background: c }} />
                                    ))}
                                </span>
                                <span className="swatch-label">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {availModes.length > 0 && (
                        <>
                            <p className="settings-sub">Mode</p>
                            <div className="settings-btn-group">
                                {availModes.map(m => (
                                    <MiniBtn key={m} active={mode === m} onClick={() => setMode(m)}>{m.charAt(0).toUpperCase() + m.slice(1)}</MiniBtn>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Density */}
                <section className="settings-section">
                    <h2>Density</h2>
                    <div className="settings-btn-group">
                        {DENSITY_OPTIONS.map(d => (
                            <MiniBtn key={d.value} active={density === d.value} onClick={() => setDensity(d.value)}>{d.label}</MiniBtn>
                        ))}
                    </div>
                </section>

                {/* Reading font */}
                <section className="settings-section">
                    <h2>Reading font</h2>
                    <div className="settings-font-list">
                        {FONT_OPTIONS.map(f => (
                            <button
                                key={f.id}
                                type="button"
                                className={`settings-font-option${font === f.id ? " active" : ""}`}
                                onClick={() => setFont(f.id)}
                            >
                                <span className="font-preview" style={{ fontFamily: `'${f.id}', sans-serif` }}>
                                    The quick brown fox
                                </span>
                                <span className="font-meta">
                                    <span className="font-label">{f.label}</span>
                                    <span className="font-desc">{f.desc}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
