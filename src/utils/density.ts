import { type Density } from "../contexts/DensityContext";

function toRem(px: number): string {
    const v = px / 16;
    if (v === Math.floor(v)) return `${v}rem`;
    const s = v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return `${s}rem`;
}

/** Density-aware value picker: returns compact or comfortable value.
 *  Numeric inputs are treated as px and converted to rem strings. */
export function dv(density: Density, compact: number | string, comfortable: number | string, spacious?: number | string): string {
    const d = density as string;
    const v = d === "compact" ? compact : d === "spacious" && spacious !== undefined ? spacious : comfortable;
    return typeof v === "number" ? toRem(v) : v;
}
