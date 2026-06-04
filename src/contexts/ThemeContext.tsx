import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme =
    | "fieldmouse"
    | "midnight"
    | "urban-rat"
    | "forest"
    | "slate"
    | "rosewood"
    | "stark-light"
    | "stark-dark"
    | "goldenrod";

export type Mode = "light" | "mid" | "dark";

/** Themes that have no data-mode attribute — CSS targets data-theme only */
const SINGLE_MODE_THEMES: Theme[] = ["stark-light", "stark-dark", "goldenrod"];

/** Themes that support only light + dark (no mid) */
const TWO_MODE_THEMES: Theme[] = ["rosewood"];

/** Available modes for a given theme (empty = single-mode, no selector) */
export function availableModesFor(t: Theme): Mode[] {
    if (SINGLE_MODE_THEMES.includes(t)) return [];
    if (TWO_MODE_THEMES.includes(t)) return ["light", "dark"];
    return ["light", "mid", "dark"];
}

type ThemeContextValue = {
    theme: Theme;
    mode: Mode;
    setTheme: (t: Theme) => void;
    setMode: (m: Mode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function migrateTheme(raw: string | null): Theme {
    if (raw === "pinewood") return "forest"; // renamed in v2
    const valid: Theme[] = [
        "fieldmouse","midnight","urban-rat","forest","slate","rosewood",
        "stark-light","stark-dark","goldenrod",
    ];
    return valid.includes(raw as Theme) ? (raw as Theme) : "fieldmouse";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => migrateTheme(localStorage.getItem("twomice_theme"))
    );
    const [mode, setModeState] = useState<Mode>(
        () => (localStorage.getItem("twomice_mode") as Mode) ?? "light"
    );

    function setTheme(t: Theme) {
        setThemeState(t);
        localStorage.setItem("twomice_theme", t);
        // Clamp mode if new theme doesn't support it
        const avail = availableModesFor(t);
        if (avail.length > 0 && !avail.includes(mode)) {
            setModeState("light");
            localStorage.setItem("twomice_mode", "light");
        }
    }

    function setMode(m: Mode) {
        setModeState(m);
        localStorage.setItem("twomice_mode", m);
    }

    useEffect(() => {
        const el = document.documentElement;
        el.dataset.theme = theme;
        if (SINGLE_MODE_THEMES.includes(theme)) {
            delete el.dataset.mode;
        } else {
            el.dataset.mode = mode;
        }
    }, [theme, mode]);

    return (
        <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}
