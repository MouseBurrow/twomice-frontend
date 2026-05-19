import { useState } from "react";
import { type Mode, type Theme, useTheme } from "../contexts/ThemeContext";
import "../assets/Settings.scss";

const THEMES: { value: Theme; label: string }[] = [
    { value: "fieldmouse", label: "Fieldmouse" },
    { value: "midnight",   label: "Midnight" },
    { value: "urban-rat",  label: "Urban Rat" },
    { value: "pinewood",   label: "Pinewood" },
    { value: "stark-light",label: "Stark Light" },
    { value: "stark-dark", label: "Stark Dark" },
    { value: "goldenrod",  label: "Goldenrod" },
];

const MODES: { value: Mode; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "mid",   label: "Mid" },
    { value: "dark",  label: "Dark" },
];

const SINGLE_MODE: Theme[] = ["stark-light", "stark-dark", "goldenrod"];

function loadPinned(): string[] {
    try {
        const raw = localStorage.getItem("twomice_pinned");
        const parsed = JSON.parse(raw ?? "[]");
        return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
    } catch {
        return [];
    }
}

export default function Settings() {
    const { theme, mode, setTheme, setMode } = useTheme();

    const [handle, setHandle] = useState(
        () => localStorage.getItem("twomice_handle") ?? ""
    );

    const [pinInput, setPinInput] = useState("");
    const [pinned, setPinned] = useState<string[]>(loadPinned);

    function saveHandle() {
        localStorage.setItem("twomice_handle", handle.trim());
    }

    function addPin() {
        const board = pinInput.trim().replace(/^b\//, "");
        if (!board || pinned.includes(board)) return;
        const next = [...pinned, board];
        setPinned(next);
        localStorage.setItem("twomice_pinned", JSON.stringify(next));
        setPinInput("");
    }

    function removePin(board: string) {
        const next = pinned.filter(b => b !== board);
        setPinned(next);
        localStorage.setItem("twomice_pinned", JSON.stringify(next));
    }

    return (
        <div className="settings-page">
            <div className="settings-board">
                <div className="settings-header">
                    <h1>Settings</h1>
                </div>

                {/* Theme */}
                <section className="settings-section">
                    <h2>Appearance</h2>
                    <div className="settings-row">
                        <label htmlFor="settings-theme">Theme</label>
                        <select
                            id="settings-theme"
                            className="settings-select"
                            value={theme}
                            onChange={e => setTheme(e.target.value as Theme)}
                        >
                            {THEMES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    {!SINGLE_MODE.includes(theme) && (
                        <div className="settings-row">
                            <label htmlFor="settings-mode">Mode</label>
                            <select
                                id="settings-mode"
                                className="settings-select"
                                value={mode}
                                onChange={e => setMode(e.target.value as Mode)}
                            >
                                {MODES.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                    <button type="button" className="settings-save" onClick={saveHandle}>Save</button>
                </section>

                {/* Pinned boards */}
                <section className="settings-section">
                    <h2>Pinned boards</h2>
                    <div className="settings-chip-row">
                        {pinned.map(b => (
                            <span key={b} className="settings-chip">
                                b/{b}
                                <button type="button" onClick={() => removePin(b)} aria-label={`Unpin ${b}`}>✕</button>
                            </span>
                        ))}
                    </div>
                    <div className="settings-pin-input">
                        <input
                            aria-label="Board name to pin"
                            placeholder="board name"
                            value={pinInput}
                            onChange={e => setPinInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addPin()}
                        />
                        <button type="button" onClick={addPin} aria-label="Pin board">Pin</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
