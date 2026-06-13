import type { CommentData } from "../../types";
import CommentCard from "./CommentCard";
import "../../assets/components.scss";

type Props = { topic: string; post: string; comments: CommentData[]; opToken?: string; bc: string };

const NC = [
    '0 1rem 1rem 1rem', '1rem 0 1rem 1rem',
    '1rem 1rem 0 1rem', '1rem 1rem 1rem 0',
];
const ROTS = [-0.28, 0.20, -0.32, 0.24, -0.18, 0.28];

export default function CommentGrid({ topic, post, comments, opToken, bc }: Props) {
    return (
        <div className="comment-grid">
            {comments.map((c, i) => {
                const rot = ROTS[i % ROTS.length];
                return (
                    <div key={c.hash} className="cmt-tilt-wrap"
                        style={{
                            '--comment-corners': NC[i % 4],
                            transform: `rotate(${rot}deg)`,
                            boxShadow: `${rot > 0 ? '-3' : '3'}px 5px 14px rgba(0,0,0,.07)`,
                        } as React.CSSProperties}
                    >
                        <CommentCard topic={topic} post={post} comment={c} opToken={opToken} bc={bc} />
                    </div>
                );
            })}
        </div>
    );
}
