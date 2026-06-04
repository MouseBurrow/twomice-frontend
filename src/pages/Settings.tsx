import { useState } from "react";
import { type Mode, type Theme, useTheme, availableModesFor } from "../contexts/ThemeContext";
import { type Density, useDensity } from "../contexts/DensityContext";
import "../assets/Settings.scss";

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

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
    { value: "compact",     label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious",    label: "Spacious" },
];

const FONT_OPTIONS: { id: string; label: string; desc: string }[] = [
    { id: "Inter",                 label: "Inter",                 desc: "Default — clean & modern" },
    { id: "Space Grotesk",         label: "Space Grotesk",         desc: "Geometric & technical" },
    { id: "Atkinson Hyperlegible", label: "Atkinson Hyperlegible", desc: "Optimised for readability" },
    { id: "OpenDyslexic",          label: "OpenDyslexic",          desc: "Dyslexia-friendly" },
];

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
        localStorage.setItem("twomice_font", f);
        document.body.style.fontFamily = `'${f}', sans-serif`;
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
                                        onClick={() => setMode(m as Mode)}
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
