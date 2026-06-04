import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

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
const TWO_MODE_THEMES: Theme[] = [];

/** Available modes for a given theme (empty = single-mode, no selector) */
// eslint-disable-next-line react-refresh/only-export-components
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

function migrateMode(theme: Theme, rawMode: string | null): Mode {
    const avail = availableModesFor(theme);
    if (avail.length === 0) return "light";
    const m = rawMode as Mode;
    return avail.includes(m) ? m : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => migrateTheme(localStorage.getItem("twomice_theme"))
    );
    const [mode, setModeState] = useState<Mode>(
        () => migrateMode(
            migrateTheme(localStorage.getItem("twomice_theme")),
            localStorage.getItem("twomice_mode")
        )
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

    const transitioning = useRef(false);

    useEffect(() => {
        const el = document.documentElement;
        const update = () => {
            el.dataset.theme = theme;
            if (SINGLE_MODE_THEMES.includes(theme)) {
                delete el.dataset.mode;
            } else {
                el.dataset.mode = mode;
            }
        };
        if (transitioning.current || !("startViewTransition" in document)) {
            update();
            return;
        }
        transitioning.current = true;
        try {
            const vt = document.startViewTransition(() => update());
            vt.finished.then(
                () => { transitioning.current = false; },
                () => { transitioning.current = false; }
            );
        } catch {
            transitioning.current = false;
            update();
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
