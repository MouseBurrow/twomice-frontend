import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import type { ApiError } from "../apiError";
import CommentGrid from "../components/post/CommentGrid";
import CreateCommentCard from "../components/post/CreateCommentCard";
import AnonBadge from "../components/shared/AnonBadge";
import VoteButtons from "../components/shared/VoteButtons";
import BoardChip from "../components/shared/BoardChip";
import GuestBanner from "../components/shared/GuestBanner";
import SkeletonPostHeader from "../components/skeleton/SkeletonPostHeader";
import SkeletonReplyCard from "../components/skeleton/SkeletonReplyCard";
import type { CommentData, PostData } from "../types";
import "../assets/Post.scss";

export default function Post() {
    const { board, post } = useParams<{ board: string; post: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { density } = useDensity();
    const isGuest = auth.status === "guest" || auth.status === "unknown";

    const [postData, setPostData] = useState<PostData>();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const [p, c] = await Promise.all([
                api.getPost(board!, post!),
                api.getAllComments(board!, post!)
            ]);
            if (cancelled?.()) return;
            setPostData(p);
            setComments(c.filter(x => !x.deleted));
            setLoading(false);
        } catch (e) {
            if (cancelled?.()) return;
            setError(e as ApiError);
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        load(() => cancelled);
        return () => { cancelled = true; };
    }, [board, post]);

    const formattedTime = postData?.created_at
        ? new Date(postData.created_at).toLocaleDateString()
        : "";

    const opToken = postData?.anon_token;

    const myAnonToken = useMemo(() => {
        if (postData?.is_mine && postData.anon_token) return postData.anon_token;
        return comments.find(c => c.is_mine)?.anon_token;
    }, [postData, comments]);

    return (
        <div className="post-page" data-density={density}>
            {loading ? (
                <>
                    <SkeletonPostHeader />
                    <div className="comment-list">
                        {Array.from({ length: 4 }, (_, i) => <SkeletonReplyCard key={i} />)}
                    </div>
                </>
            ) : (
                <>
                    <div className="post-back">
                        <button
                            className="btn-ghost"
                            onClick={() => navigate(`/b/${board}`)}
                            style={{ padding: "0.3125rem 0.75rem" }}
                        >
                            ← {board}
                        </button>
                    </div>

                    <div className="post-detail">
                        <div className="post-detail-inner">
                            <div className="post-detail-meta">
                                {postData?.anon_token && (
                                    <AnonBadge token={postData.anon_token} isOp={true} isMe={postData.is_mine} />
                                )}
                                <span className="post-detail-time">OP · {formattedTime}</span>
                                {board && <BoardChip boardName={board} />}
                                <span className="post-detail-slug">#{postData?.slug}</span>
                            </div>

                            <div className="post-detail-title">{postData?.title}</div>

                            <div className="post-detail-content">{postData?.content}</div>

                            <div className="post-detail-footer">
                                <VoteButtons votes={postData?.vote_count ?? 0} disabled={isGuest} />
                                <span className="post-detail-reply-count">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ verticalAlign: "middle", marginRight: "0.25rem" }}>
                                        <path d="M1.5 2h9v6.5H7L5.5 10 4 8.5H1.5V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                                    </svg>
                                    {comments.length} comments
                                </span>
                                {postData?.tags && postData.tags.map(t => (
                                    <span key={t} className="tag-chip">#{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isGuest ? (
                        <div className="post-guest-banner-wrap">
                            <GuestBanner onLogin={() => navigate("/auth")} />
                        </div>
                    ) : (
                        <div className="post-reply-box">
                            <CreateCommentCard topic={board!} post={post!} myToken={myAnonToken} onCreated={load} />
                        </div>
                    )}

                    <div className="post-comment-section">
                        <div className="post-comment-header">
                            <span className="post-comment-header-title">{comments.length} comments</span>
                            <span className="post-comment-header-sub">sorted by top</span>
                        </div>
                        <CommentGrid topic={board!} post={post!} comments={comments} opToken={opToken} />
                    </div>

                    {error && <p className="post-error">Failed to load comments.</p>}
                </>
            )}
        </div>
    );
}
