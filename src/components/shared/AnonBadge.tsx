function hashHue(token: string): number {
    let h = 0;
    for (const c of token) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return Math.abs(h) % 360;
}

type Props = { token: string; isOp?: boolean; isMe?: boolean; sm?: boolean };

export default function AnonBadge({ token, isOp, isMe, sm }: Props) {
    const hue = hashHue(token);
    const bg   = `oklch(72% 0.10 ${hue} / 0.25)`;
    const text = `oklch(32% 0.14 ${hue})`;
    const dot  = `oklch(52% 0.22 ${hue})`;

    return (
        <span
            className={`anon-badge${sm ? " anon-badge--sm" : ""}`}
            style={{
                borderColor: dot,
                backgroundColor: bg,
                color: text,
            }}
        >
            <span className="anon-badge-dot" style={{ background: dot }} />
            anon:{token}
            {isOp && <span className="anon-badge-tag anon-badge-tag--op">OP</span>}
            {isMe && <span className="anon-badge-tag anon-badge-tag--me">YOU</span>}
        </span>
    );
}
