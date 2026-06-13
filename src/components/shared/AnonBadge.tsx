import { hashColor } from "../../utils/hash";

type Props = { token: string; isOp?: boolean; isMe?: boolean; sm?: boolean };

export default function AnonBadge({ token, isOp, isMe, sm }: Props) {
    const shortId = token.slice(0, 6);
    const c = hashColor(shortId);

    return (
        <span
            className={`anon-badge${sm ? " anon-badge--sm" : ""}`}
            style={{
                borderColor: c.dot,
                background: `color-mix(in srgb, ${c.dot} 18%, var(--bg-surface))`,
                color: `color-mix(in srgb, ${c.dot} 65%, var(--text-primary))`,
            }}
        >
            <span className="anon-badge-dot" style={{ background: c.dot }} />
            {shortId}
            {isOp && !isMe && <span className="anon-badge-tag anon-badge-tag--op">OP</span>}
            {isMe && <span className="anon-badge-tag anon-badge-tag--me" style={{ color: c.dot }}>YOU</span>}
        </span>
    );
}
