import { Link } from "react-router-dom";
import type { NibData } from "../../types";
import VoteColumn from "../shared/VoteColumn";
import AnonBadge from "../shared/AnonBadge";
import { useDensity } from "../../contexts/DensityContext";

type Props = {
    /** Board slug. Optional: falls back to post.board_id for cross-board feed. */
    board?: string;
    post: NibData;
};

export default function NibCard({ board, post }: Props) {
    const { density } = useDensity();
    const resolvedBoard = board ?? post.board_id;
    if (!resolvedBoard) return null;

    return (
        <article className="nib-card" data-density={density}>
            <Link to={`/b/${resolvedBoard}/nib/${post.slug}`}>
                <VoteColumn initialScore={post.vote_count ?? 0} />
                <div className="nib-card-body">
                    <div className="nib-card-top">
                        {post.is_hot && (
                            <span className="nib-card-hot">🔥 HOT</span>
                        )}
                        {post.board_id && !board && (
                            <span className="nib-card-board-chip">b/{post.board_id}</span>
                        )}
                    </div>
                    <p className="nib-card-title">{post.title}</p>
                    {density !== "compact" && (
                        <p className="nib-card-preview">
                            {post.content.slice(0, 160)}{post.content.length > 160 ? "…" : ""}
                        </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="nib-card-tags">
                            {post.tags.map(tag => (
                                <span key={tag} className="nib-tag-chip">{tag}</span>
                            ))}
                        </div>
                    )}
                    <div className="nib-card-meta">
                        {post.anon_token && (
                            <AnonBadge token={post.anon_token} isMe={post.is_mine} sm />
                        )}
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        {post.reply_count !== undefined && (
                            <span>{post.reply_count} replies</span>
                        )}
                        {post.view_count !== undefined && (
                            <span>{post.view_count} views</span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}
