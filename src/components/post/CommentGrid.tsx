import type { CommentData } from "../../types";
import CommentCard from "./CommentCard";

type Props = { topic: string; post: string; comments: CommentData[]; opToken?: string; bc?: string };

const NC = [
    '0 1rem 1rem 1rem', '1rem 0 1rem 1rem',
    '1rem 1rem 0 1rem', '1rem 1rem 1rem 0',
];
const ROTS = [-0.28, 0.20, -0.32, 0.24, -0.18, 0.28];

export default function CommentGrid({ topic, post, comments, opToken, bc }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map((c, i) => {
                const rot = ROTS[i % ROTS.length];
                return (
                    <div key={c.hash} style={{
                        background: 'var(--bg-surface)',
                        border: '1.5px solid var(--border)',
                        borderRadius: NC[i % 4],
                        transform: `rotate(${rot}deg)`,
                        transformOrigin: '50% 0',
                        boxShadow: `${rot > 0 ? '-3' : '3'}px 5px 14px rgba(0,0,0,.07)`,
                        transition: 'background-color .2s,border-color .2s',
                    }}>
                        <CommentCard topic={topic} post={post} comment={c} opToken={opToken} />
                    </div>
                );
            })}
        </div>
    );
}
