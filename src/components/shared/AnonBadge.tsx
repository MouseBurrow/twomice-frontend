function hashHue(token: string): number {
    let h = 0;
    for (const c of token) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return Math.abs(h) % 360;
}

type Props = { token: string; isOp?: boolean; isMe?: boolean; sm?: boolean };

export default function AnonBadge({ token, isOp, isMe, sm }: Props) {
    const hue = hashHue(token);
    const dot = `oklch(52% 0.22 ${hue})`;
    const shortId = token.slice(0, 6);

    return (
        <span
            className={`anon-badge${sm ? " anon-badge--sm" : ""}`}
            style={{
                borderColor: dot,
                background: `color-mix(in srgb, ${dot} 18%, var(--bg-surface))`,
                color: `color-mix(in srgb, ${dot} 65%, var(--text-primary))`,
            }}
        >
            <span className="anon-badge-dot" style={{ background: dot }} />
            {shortId}
            {isOp && <span className="anon-badge-tag anon-badge-tag--op">OP</span>}
            {isMe && <span className="anon-badge-tag anon-badge-tag--me">YOU</span>}
        </span>
    );
}
