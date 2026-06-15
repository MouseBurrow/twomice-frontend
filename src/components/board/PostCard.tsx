import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PostData } from "../../types";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import BoardChip from "../board/BoardChip";
import ModActions from "../shared/ModActions";
import PushPin from "../shared/PushPin";
import BoardTag from "../shared/BoardTag";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";
import { useFormatRelativeTime } from "../../utils/date";
import { hashPostId, SCRAP_ROTS, NEST_CORNERS, boardColorFromName } from "../../utils/hash";
import "../../assets/components.scss";

type Props = {
    board?: string;
    post: PostData;
};

export default function PostCard({ board, post }: Props) {
    const navigate = useNavigate();
    const { auth, isGuest } = useAuth();
    const { density } = useDensity();
    const resolvedBoard = board ?? post.board_id;
    const canNavigate = !!resolvedBoard;
    const isCompact = density === "compact";

    const [locked, setLocked] = useState(post.is_locked ?? false);
    const [removed, setRemoved] = useState(false);

    const relTime = useFormatRelativeTime(post.created_at);

    const isAdmin = auth.status === "admin";

    if (removed) return null;

    const handleClick = () => {
        if (canNavigate) navigate(`/b/${resolvedBoard}/nib/${post.slug}`);
    };

    const h = hashPostId(post.slug);
    const scrap = !isCompact;
    const rot = scrap ? SCRAP_ROTS[h % SCRAP_ROTS.length] : 0;
    const radius = scrap ? NEST_CORNERS[h % 4] : '8px';
    const shadowX = rot > 0 ? -5 : 5;
    const boxShadow = scrap
        ? `${shadowX}px 8px 20px var(--shadow), 0 1px 4px var(--shadow)`
        : 'none';
    const bc = post.board_id ? boardColorFromName(post.board_id) : 'var(--accent)';

    return (
        <div className={`pcard-wrap${scrap ? ' scrap' : ''}`}>
            {scrap && <PushPin color={bc} glow={!!post.is_hot} />}

            <article
                className={`post-card${canNavigate ? "" : " post-card--nonav"}`}
                data-density={density}
                onClick={canNavigate ? handleClick : undefined}
                style={{
                    '--card-rot': `${rot}deg`,
                    '--bc': bc,
                    borderRadius: radius,
                    boxShadow,
                } as React.CSSProperties}
            >
                <div className="post-card-inner">
                    <div className="post-card-meta-row">
                        {!board && post.board_id && (
                            <div className="post-card-board-chip">
                                <span className="board-dot-sm" style={{ '--dot-clr': bc } as React.CSSProperties} />
                                <BoardChip
                                    boardName={post.board_id}
                                    onClick={() => navigate(`/b/${post.board_id}`)}
                                />
                            </div>
                        )}
                        {post.is_hot && <span className="post-card-hot-badge">🔥</span>}
                        {post.anon_token && (
                            <AnonBadge token={post.anon_token} isMe={post.is_mine} />
                        )}
                        {locked && (
                            <span className="locked-badge">🔒 locked</span>
                        )}
                        <span className="meta-time">{relTime}</span>
                    </div>

                    <div className="post-card-title">{post.title}</div>

                    {!isCompact && (
                        <p className="post-card-preview">
                            {(post.content ?? "").slice(0, 160)}{(post.content ?? "").length > 160 ? "…" : ""}
                        </p>
                    )}

                    <div className="pcard-footer">
                        <VoteButtons
                            votes={post.vote_count ?? 0}
                            disabled={isGuest}
                            bc={bc}
                            replies={post.reply_count}
                        />

                        <div className="pcard-footer-spacer" />

                        {post.tags && post.tags.slice(0, 1).map(tag => (
                            <BoardTag key={tag} tag={tag} bc={bc} />
                        ))}

                        <div className="pcard-footer-end">
                            <ModActions
                                show={isAdmin}
                                type="post"
                                locked={locked}
                                onLock={() => setLocked(l => !l)}
                                onRemove={() => setRemoved(true)}
                            />
                            {canNavigate && (
                                <span className="pcard-peek" style={{ '--peek-clr': bc } as React.CSSProperties}>
                                    peek in →
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
