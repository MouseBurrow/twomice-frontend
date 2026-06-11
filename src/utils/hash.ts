export function hashPostId(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
    return h;
}

export const SCRAP_ROTS = [1.8, -1.1, 2.2, -1.6, 1.3, -2.0, 1.6, -0.9, 1.9, -1.4];

export const NEST_CORNERS = [
    '4px 20px 20px 20px',
    '20px 4px 20px 20px',
    '20px 20px 4px 20px',
    '20px 20px 20px 4px',
];

export function boardColorFromName(name: string): string {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    const hue = Math.abs(h) % 360;
    return `oklch(62% 0.24 ${hue})`;
}

export function hashColor(id: string): { bg: string; text: string; dot: string } {
    let h = 0;
    for (let c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
    const hue = Math.abs(h) % 360;
    return {
        bg: `oklch(72% 0.10 ${hue})`,
        text: `oklch(32% 0.14 ${hue})`,
        dot: `oklch(62% 0.24 ${hue})`,
    };
}
