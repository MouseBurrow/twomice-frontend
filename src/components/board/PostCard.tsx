import { useNavigate } from "react-router-dom";
import type { PostData } from "../../types";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import BoardChip from "../shared/BoardChip";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";

type Props = {
    board?: string;
    post: PostData;
};

export default function PostCard({ board, post }: Props) {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { density } = useDensity();
    const resolvedBoard = board ?? post.board_id;

    const isGuest = auth.status === "guest" || auth.status === "unknown";
    const canNavigate = !!resolvedBoard;

    const handleClick = () => {
        if (canNavigate) navigate(`/b/${resolvedBoard}/nib/${post.slug}`);
    };

    return (
        <article
            className={`post-card${canNavigate ? "" : " post-card--nonav"}`}
            data-density={density}
            onClick={canNavigate ? handleClick : undefined}
        >
            <div className="post-card-inner">
                <div className="post-card-meta-row">
                    {!board && post.board_id && (
                        <BoardChip
                            boardName={post.board_id}
                            onClick={() => navigate(`/b/${post.board_id}`)}
                        />
                    )}
                    <span className="post-card-slug">#{post.slug}</span>
                    {post.anon_token && (
                        <AnonBadge token={post.anon_token} isMe={post.is_mine} sm />
                    )}
                    {post.is_hot && (
                        <span className="post-card-hot-badge">🔥 hot</span>
                    )}
                    <span className="post-card-date">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                </div>

                <div className="post-card-title">{post.title}</div>

                {density !== "compact" && (
                    <p className="post-card-preview">
                        {(post.content ?? "").slice(0, 160)}{(post.content ?? "").length > 160 ? "…" : ""}
                    </p>
                )}

                <div className="post-card-footer">
                    <VoteButtons votes={post.vote_count ?? 0} disabled={isGuest} />
                    <span className="post-card-replies">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1.5 2h9v6.5H7L5.5 10 4 8.5H1.5V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                        {post.reply_count ?? 0}
                    </span>
                    {post.tags && post.tags.map(tag => (
                        <span key={tag} className="tag-chip">#{tag}</span>
                    ))}
                    {canNavigate && (
                        <span className="post-card-open">→ open</span>
                    )}
                </div>
            </div>
        </article>
    );
}
