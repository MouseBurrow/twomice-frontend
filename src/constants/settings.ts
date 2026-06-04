import { type Theme } from "../contexts/ThemeContext";
import { type Density } from "../contexts/DensityContext";

export const THEMES: { value: Theme; label: string; preview: [string, string, string] }[] = [
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

export const DENSITY_OPTIONS: { value: Density; label: string; desc: string }[] = [
    { value: "compact",     label: "Compact",     desc: "Reduced spacing" },
    { value: "comfortable", label: "Comfortable", desc: "Balanced (default)" },
    { value: "spacious",    label: "Spacious",    desc: "Extra breathing room" },
];

export const FONT_OPTIONS: { id: string; label: string; desc: string }[] = [
    { id: "Inter",                 label: "Inter",                 desc: "Default — clean & modern" },
    { id: "Space Grotesk",         label: "Space Grotesk",         desc: "Geometric & technical" },
    { id: "Atkinson Hyperlegible", label: "Atkinson Hyperlegible", desc: "Optimised for readability" },
    { id: "OpenDyslexic",          label: "OpenDyslexic",          desc: "Dyslexia-friendly" },
];

export function applyFont(font: string) {
    localStorage.setItem("twomice_font", font);
    const fontValue = `'${font}', sans-serif`;
    document.body.style.fontFamily = fontValue;
    document.documentElement.style.setProperty("--font-body", fontValue);
}
