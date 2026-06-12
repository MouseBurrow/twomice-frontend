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
import MiniBtn from "../components/shared/MiniBtn";
import ModActions from "../components/shared/ModActions";
import GuestBanner from "../components/shared/GuestBanner";
import PushPin from "../components/shared/PushPin";
import SkeletonPostHeader from "../components/skeleton/SkeletonPostHeader";
import SkeletonReplyCard from "../components/skeleton/SkeletonReplyCard";
import type { CommentData, PostData } from "../types";
import { formatRelativeTime } from "../utils/date";
import { boardColorFromName } from "../utils/hash";
import { dv } from "../utils/density";
import "../assets/Post.scss";
import "../assets/components.scss";

export default function Post() {
    const { board, post } = useParams<{ board: string; post: string }>();
    const navigate = useNavigate();
    const { auth, isGuest } = useAuth();
    const { density } = useDensity();

    const [postData, setPostData] = useState<PostData>();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sortLoading, setSortLoading] = useState(false);
    const [reloadVersion, setReloadVersion] = useState(0);
    const [locked, setLocked] = useState(false);
    const [commentSort, setCommentSort] = useState<"hot" | "new" | "top">("hot");
    const [commentOffset, setCommentOffset] = useState(0);
    const [commentTotal, setCommentTotal] = useState(0);
    const COMMENT_LIMIT = 25;

    const isAdmin = auth.status === "admin";

    useEffect(() => {
        if (postData) setLocked(postData.is_locked ?? false);
    }, [postData]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setCommentOffset(0);
            setError(undefined);
            try {
                const [postResult, commentRes, boardPosts] = await Promise.all([
                    api.getPost(board!, post!),
                    api.getAllComments(board!, post!, COMMENT_LIMIT, 0, commentSort),
                    api.getAllPosts(board!)
                ]);
                if (cancelled) return;
                setPostData(postResult);
                setComments(commentRes.data.filter(x => !x.deleted));
                setCommentOffset(commentRes.offset);
                setCommentTotal(commentRes.total);
                setRelatedPosts(
                    boardPosts
                        .filter(p => p.slug !== post && !p.deleted)
                        .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
                        .slice(0, 3)
                );
                setLoading(false);
            } catch (e) {
                if (cancelled) return;
                setError(e as ApiError);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [board, post, reloadVersion]);

    useEffect(() => {
        if (!postData) return;
        let cancelled = false;
        (async () => {
            setSortLoading(true);
            setCommentOffset(0);
            try {
                const res = await api.getAllComments(board!, post!, COMMENT_LIMIT, 0, commentSort);
                if (cancelled) return;
                setComments(res.data.filter(x => !x.deleted));
                setCommentOffset(res.offset);
                setCommentTotal(res.total);
            } catch { /* ignore */ } finally {
                if (!cancelled) setSortLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [commentSort]);

    async function loadMoreComments() {
        const nextOffset = commentOffset + COMMENT_LIMIT;
        if (loadingMore || nextOffset >= commentTotal) return;
        setLoadingMore(true);
        try {
            const res = await api.getAllComments(board!, post!, COMMENT_LIMIT, nextOffset, commentSort);
            setComments(prev => [...prev, ...res.data.filter(x => !x.deleted)]);
            setCommentOffset(res.offset);
        } catch { /* ignore */ } finally {
            setLoadingMore(false);
        }
    }

    const formattedTime = postData?.created_at
        ? formatRelativeTime(postData.created_at)
        : "";

    const opToken = postData?.anon_token;

    const myAnonToken = useMemo(() => {
        if (postData?.is_mine && postData.anon_token) return postData.anon_token;
        return comments.find(c => c.is_mine)?.anon_token;
    }, [postData, comments]);

    const bc = board ? boardColorFromName(board) : 'var(--accent)';

    const sortedComments = useMemo(() => {
        const sorted = [...comments];
        if (commentSort === "new") {
            sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else {
            sorted.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
        }
        return sorted;
    }, [comments, commentSort]);

    const COMMENT_SORT_LABELS: Record<string, string> = { hot: "Hot", new: "Fresh", top: "Buried" };
    const sidebarTop = dv(density, '3.625rem', '4.5rem', '5.5rem');
    const pagePad = dv(density, '1rem 1rem 2.5rem', '1.5rem 1rem 3.75rem', '2rem 1rem 5rem');
    const leftW = dv(density, '18.75rem', '23.75rem', '27.5rem');
    const panelGap = dv(density, '0.875rem', '1.25rem', '1.75rem');
    const cardPad = dv(density, '0.75rem 0.875rem', '1.125rem 1.25rem', '1.375rem 1.625rem');
    const infoPad = dv(density, '0.5rem 0.625rem 0.375rem', '0.625rem 0.875rem 0.5rem', '0.75rem 1rem 0.625rem');
    const widgetHd = dv(density, '0.4375rem 0.625rem', '0.5625rem 0.875rem', '0.6875rem 1rem');

    if (loading) {
        return (
            <div className="post-page" data-density={density}>
                <SkeletonPostHeader />
                <div className="comment-list">
                    {Array.from({ length: 4 }, (_, i) => <SkeletonReplyCard key={i} />)}
                </div>
            </div>
        );
    }

    if (!postData) {
        return (
            <div className="post-page" data-density={density}>
                <div className="post-breadcrumb" style={{ justifyContent: 'center', paddingTop: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, marginBottom: 8 }}>Post not found</div>
                        <button className="btn-ghost" onClick={() => navigate(`/b/${board}`)}>← Back to board</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="post-page" data-density={density}>
            <div className="post-dblend" style={{ padding: pagePad, gap: panelGap }}>
                {/* ─── LEFT — sticky context panel ─── */}
                <div className="post-dblend-left"
                    style={{ width: leftW, top: sidebarTop, gap: dv(density, '0.625rem', '0.875rem', '1.125rem') }}
                >
                    <div className="post-breadcrumb">
                        <button className="btn-ghost"
                            style={{ padding: dv(density, '3px 8px', '4px 10px', '5px 12px'), fontSize: dv(density, 11, 12, 13) }}
                            onClick={() => navigate(`/b/${board}`)}>
                            ← {board}
                        </button>
                        {locked && <span className="locked-badge">🔒 locked</span>}
                    </div>

                    <div className="post-op-wrap" style={{ marginTop: dv(density, 16, 20, 24) }}>
                        <PushPin color={bc} glow={!!postData.is_hot} />
                        <div className="post-op-card" style={{ '--bc': bc } as React.CSSProperties}>
                            <div className="post-detail-inner" style={{ padding: cardPad }}>
                                <div className="post-op-meta" style={{ marginBottom: dv(density, 8, 10, 12) }}>
                                    {postData.anon_token && (
                                        <AnonBadge token={postData.anon_token} isOp isMe={postData.is_mine} />
                                    )}
                                    <span className="post-detail-time">OP · {formattedTime}</span>
                                    <div className="post-op-meta-end">
                                        {board && <BoardChip boardName={board} />}
                                        <span className="post-detail-slug">#{postData.slug}</span>
                                        <ModActions show={isAdmin} type="post" locked={locked}
                                            onLock={() => setLocked(p => !p)}
                                            onRemove={() => navigate(`/b/${board}`)} />
                                    </div>
                                </div>

                                <div className="post-op-title" style={{ fontSize: dv(density, 16, 20, 24), marginBottom: dv(density, 8, 10, 12) }}>
                                    {postData.title}
                                </div>

                                <div className="post-op-body" style={{ fontSize: dv(density, 12, 13, 14) }}>
                                    {postData.content}
                                </div>

                                <div className="post-op-footer" style={{ paddingTop: 8, marginTop: dv(density, 8, 10, 12) }}>
                                    <VoteButtons votes={postData.vote_count ?? 0} disabled={isGuest} bc={bc} replies={comments.length} />
                                    {postData.tags?.map(t => <span key={t} className="bc-tag" style={{
                                        color: bc,
                                        background: `color-mix(in srgb,${bc} 12%,transparent)`,
                                        border: `1px solid color-mix(in srgb,${bc} 28%,transparent)`,
                                    }}>#{t}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="post-board-widget">
                        <div className="post-board-widget-header" style={{ padding: widgetHd }}>
                            <span className="post-board-dot" style={{ background: bc }} />
                            <span className="post-board-name" style={{ fontSize: dv(density, 12, 14, 15) }}>b/{board}</span>
                        </div>
                        <div className="post-board-widget-body" style={{ padding: infoPad }}>
                            {postData.tags && postData.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                    {postData.tags.map(tag => <span key={tag} className="bc-tag" style={{
                                        color: bc,
                                        background: `color-mix(in srgb,${bc} 12%,transparent)`,
                                        border: `1px solid color-mix(in srgb,${bc} 28%,transparent)`,
                                    }}>#{tag}</span>)}
                                </div>
                            )}

                            {relatedPosts.length > 0 && (
                                <div>
                                    <div className="related-header" style={{ marginBottom: dv(density, 5, 7, 8) }}>
                                        More in b/{board}
                                    </div>
                                    {relatedPosts.map(rp => (
                                        <div key={rp.slug} className="related-item"
                                            onClick={() => navigate(`/b/${board}/nib/${rp.slug}`)}
                                            style={{ padding: `${dv(density, 8, 10, 12)}px 0` }}
                                        >
                                            <div className="related-title" style={{ fontSize: dv(density, 11, 12, 12) }}>
                                                {rp.title}
                                            </div>
                                            <div className="related-stats" style={{ marginTop: 2 }}>
                                                <span>▲ {rp.vote_count ?? 0}</span>
                                                <span>💬 {rp.reply_count ?? 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {!isGuest && !locked ? (
                        <div className="post-reply-box" style={{ padding: dv(density, '0.625rem 0.75rem', '0.75rem 1rem', '0.875rem 1.125rem') }}>
                            <CreateCommentCard topic={board!} post={post!} myToken={myAnonToken} onCreated={async () => { setReloadVersion(v => v + 1); }} />
                        </div>
                    ) : isGuest ? (
                        <GuestBanner onLogin={() => navigate("/auth")} />
                    ) : (
                        <div className="locked-notice">🔒 This burrow is locked.</div>
                    )}
                </div>

                {/* ─── RIGHT — comment feed ─── */}
                <div className="post-dblend-right">
                    <div className="comment-feed-header" style={{ gap: dv(density, 8, 10, 12), marginBottom: dv(density, 12, 16, 20) }}>
                        <span className="comment-feed-count" style={{ fontSize: dv(density, 14, 16, 18) }}>
                            {comments.length} squeaks
                        </span>
                        <span className="comment-feed-sort-label">Sort</span>
                        {(["hot", "new", "top"] as const).map(s => (
                            <MiniBtn key={s} active={commentSort === s} onClick={() => setCommentSort(s)}>
                                {COMMENT_SORT_LABELS[s]}
                            </MiniBtn>
                        ))}
                    </div>

                    <CommentGrid topic={board!} post={post!} comments={sortedComments} opToken={opToken} bc={bc} />

                    {commentOffset + COMMENT_LIMIT < commentTotal && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: dv(density, 16, 24, 32), paddingBottom: dv(density, 20, 32, 40) }}>
                            <button className="btn-ghost" onClick={loadMoreComments} disabled={loadingMore}>
                                {loadingMore ? "Loading…" : `Load more (${comments.length}/${commentTotal})`}
                            </button>
                        </div>
                    )}

                    {error && <p className="post-error">Failed to load comments.</p>}
                </div>
            </div>
        </div>
    );
}
