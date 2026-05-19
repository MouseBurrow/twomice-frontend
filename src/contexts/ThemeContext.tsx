import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme =
    | "fieldmouse"
    | "midnight"
    | "urban-rat"
    | "pinewood"
    | "stark-light"
    | "stark-dark"
    | "goldenrod";

export type Mode = "light" | "mid" | "dark";

// These themes ignore mode — only data-theme is set on <html>
const SINGLE_MODE_THEMES: Theme[] = ["stark-light", "stark-dark", "goldenrod"];

type ThemeContextValue = {
    theme: Theme;
    mode: Mode;
    setTheme: (t: Theme) => void;
    setMode: (m: Mode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem("twomice_theme") as Theme) ?? "fieldmouse"
    );
    const [mode, setModeState] = useState<Mode>(
        () => (localStorage.getItem("twomice_mode") as Mode) ?? "light"
    );

    function setTheme(t: Theme) {
        setThemeState(t);
        localStorage.setItem("twomice_theme", t);
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
