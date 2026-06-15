import { hashColor } from "../../utils/hash";

type Props = { token: string; isOp?: boolean; isMe?: boolean };

export default function AnonBadge({ token, isOp, isMe }: Props) {
    const shortId = token.slice(0, 6);

    return (
        <span className="anon-badge" style={{ '--badge-clr': hashColor(shortId).dot } as React.CSSProperties}>
            <span className="anon-badge-dot" />
            {shortId}
            {isOp && !isMe && <span className="anon-badge-tag">OP</span>}
            {isMe && <span className="anon-badge-tag">YOU</span>}
        </span>
    );
}
