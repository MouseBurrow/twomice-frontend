import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { availableModesFor } from "../utils/themes";
import { useDensity } from "../contexts/DensityContext";
import { THEMES, DENSITY_OPTIONS, FONT_OPTIONS, applyFont } from "../constants/settings";
import "../assets/Settings.scss";

export default function Settings() {
    const { theme, mode, setTheme, setMode } = useTheme();
    const { density, setDensity } = useDensity();

    const [handle, setHandle] = useState(
        () => localStorage.getItem("twomice_handle") ?? ""
    );
    const [font, setFontState] = useState(
        () => localStorage.getItem("twomice_font") ?? "Inter"
    );

    function saveHandle() {
        localStorage.setItem("twomice_handle", handle.trim());
    }

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
                                    <button
                                        key={m}
                                        type="button"
                                        className={`settings-group-btn${mode === m ? " active" : ""}`}
                                        onClick={() => setMode(m)}
                                    >
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </button>
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
                            <button
                                key={d.value}
                                type="button"
                                className={`settings-group-btn${density === d.value ? " active" : ""}`}
                                onClick={() => setDensity(d.value)}
                            >
                                {d.label}
                            </button>
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

                {/* Handle */}
                <section className="settings-section">
                    <h2>Anonymous handle</h2>
                    <div className="settings-row">
                        <label htmlFor="settings-handle">Handle</label>
                        <input
                            id="settings-handle"
                            className="settings-input"
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            placeholder="anon_xxxx"
                            maxLength={24}
                        />
                    </div>
                    <button type="button" className="settings-save" onClick={saveHandle}>
                        Save
                    </button>
                </section>
            </div>
        </div>
    );
}
