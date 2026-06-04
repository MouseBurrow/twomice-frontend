function hashHue(token: string): number {
    let h = 0;
    for (const c of token) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return Math.abs(h) % 360;
}

type Props = {
    /** Opaque server-computed token — never a raw user ID */
    token: string;
    isOp?: boolean;
    isMe?: boolean;
    sm?: boolean;
};

export default function AnonBadge({ token, isOp, isMe, sm }: Props) {
    const hue = hashHue(token);
    const bg   = `oklch(72% 0.10 ${hue} / 0.25)`;
    const text = `oklch(32% 0.14 ${hue})`;
    const dot  = `oklch(52% 0.22 ${hue})`;
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            padding: sm ? "2px 7px" : "3px 10px",
            borderRadius: "0 6px 6px 6px",
            border: `1.5px solid ${dot}`,
            backgroundColor: bg,
            color: text,
            fontSize: sm ? "9px" : "10px",
            flexShrink: 0,
        }}>
            <span style={{
                width: sm ? 4 : 5,
                height: sm ? 4 : 5,
                borderRadius: "50%",
                background: dot,
                display: "inline-block",
                flexShrink: 0,
            }} />
            anon:{token}
            {isOp && (
                <span style={{ marginLeft: 3, fontWeight: 900, color: "var(--accent)", fontSize: "8px", letterSpacing: ".04em" }}>
                    OP
                </span>
            )}
            {isMe && (
                <span style={{ marginLeft: 3, fontWeight: 900, color: "var(--accent2)", fontSize: "8px", letterSpacing: ".04em" }}>
                    YOU
                </span>
            )}
        </span>
    );
}
