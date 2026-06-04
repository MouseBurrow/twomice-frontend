import { type Theme, type Mode } from "../contexts/ThemeContext";

/** Themes that have no data-mode attribute — CSS targets data-theme only */
const SINGLE_MODE_THEMES: Theme[] = ["stark-light", "stark-dark", "goldenrod"];

/** Themes that support only light + dark (no mid) */
const TWO_MODE_THEMES: Theme[] = [];

/** Available modes for a given theme (empty = single-mode, no selector) */
export function availableModesFor(t: Theme): Mode[] {
    if (SINGLE_MODE_THEMES.includes(t)) return [];
    if (TWO_MODE_THEMES.includes(t)) return ["light", "dark"];
    return ["light", "mid", "dark"];
}
