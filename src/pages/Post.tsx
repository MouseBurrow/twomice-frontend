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
import { formatDate } from "../utils/date";
import { boardColorFromName } from "../utils/hash";
import { dv } from "../utils/density";
import "../assets/Post.scss";

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
    const [reloadVersion, setReloadVersion] = useState(0);
    const [locked, setLocked] = useState(false);
    const [commentSort, setCommentSort] = useState<"hot" | "new" | "top">("hot");

    const isAdmin = auth.status === "admin";

    useEffect(() => {
        if (postData) setLocked(postData.is_locked ?? false);
    }, [postData]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(undefined);
            try {
                const [postResult, commentList, boardPosts] = await Promise.all([
                    api.getPost(board!, post!),
                    api.getAllComments(board!, post!),
                    api.getAllPosts(board!)
                ]);
                if (cancelled) return;
                setPostData(postResult);
                setComments(commentList.filter(x => !x.deleted));
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

    const formattedTime = postData?.created_at
        ? formatDate(postData.created_at)
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
        } else if (commentSort === "top") {
            sorted.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
        } else {
            sorted.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
        }
        return sorted;
    }, [comments, commentSort]);

    const COMMENT_SORT_LABELS: Record<string, string> = { hot: "Hot", new: "Fresh", top: "Buried" };
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
                <div className="post-back" style={{ justifyContent: 'center', paddingTop: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, marginBottom: 8 }}>Post not found</div>
                        <button className="btn-ghost" onClick={() => navigate(`/b/${board}`)}>← Back to board</button>
                    </div>
                </div>
            </div>
        );
    }

    const tagStyle = {
        fontSize: 9,
        fontFamily: "'Space Grotesk',sans-serif",
        fontWeight: 700,
        color: bc,
        background: `color-mix(in srgb,${bc} 12%,transparent)`,
        border: `1px solid color-mix(in srgb,${bc} 28%,transparent)`,
        borderRadius: '0 4px 4px 4px',
        padding: '2px 7px',
    };

    return (
        <div className="post-page" data-density={density}>
            <div style={{
                maxWidth: 1120,
                margin: '0 auto',
                padding: `var(--page-pad)`,
                display: 'flex',
                gap: panelGap,
                alignItems: 'start',
            }}>
                {/* ─── LEFT — sticky context panel ─── */}
                <div style={{
                    width: leftW,
                    flexShrink: 0,
                    position: 'sticky',
                    top: 'var(--sidebar-top)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: dv(density, '0.625rem', '0.875rem', '1.125rem'),
                }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                            className="btn-ghost"
                            style={{ padding: dv(density, '3px 8px', '4px 10px', '5px 12px'), fontSize: dv(density, 11, 12, 13) }}
                            onClick={() => navigate(`/b/${board}`)}>
                            ← {board}
                        </button>
                        {locked && <span className="locked-badge">🔒 locked</span>}
                    </div>

                    {/* ── OP card, tilted with PushPin ── */}
                    <div style={{ position: 'relative', marginTop: dv(density, 16, 20, 24) }}>
                        <PushPin color={bc} glow={!!postData.is_hot} />
                        <div className="post-detail" style={{
                            borderTop: `3px solid ${bc}`,
                            borderRadius: '0 1rem 1rem 1rem',
                            transform: 'rotate(0.8deg)',
                            transformOrigin: '50% 0',
                            boxShadow: '-3px 8px 20px rgba(0,0,0,.10)',
                            marginBottom: 0,
                        }}>
                            <div className="post-detail-inner" style={{ padding: cardPad }}>
                                {/* meta row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: dv(density, 8, 10, 12), flexWrap: 'wrap' }}>
                                    {postData.anon_token && (
                                        <AnonBadge token={postData.anon_token} isOp isMe={postData.is_mine} />
                                    )}
                                    <span className="post-detail-time">OP · {formattedTime}</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {board && <BoardChip boardName={board} />}
                                        <span className="post-detail-slug">#{postData.slug}</span>
                                        <ModActions show={isAdmin} type="post" locked={locked}
                                            onLock={() => setLocked(p => !p)}
                                            onRemove={() => navigate(`/b/${board}`)} />
                                    </div>
                                </div>

                                {/* title */}
                                <div className="post-detail-title" style={{ fontSize: dv(density, 16, 20, 24), marginBottom: dv(density, 8, 10, 12) }}>
                                    {postData.title}
                                </div>

                                {/* body */}
                                <div className="post-detail-content" style={{ fontSize: dv(density, 12, 13, 14) }}>
                                    {postData.content}
                                </div>

                                {/* footer */}
                                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 8, marginTop: dv(density, 8, 10, 12), display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <VoteButtons votes={postData.vote_count ?? 0} disabled={isGuest} bc={bc} replies={comments.length} />
                                    {postData.tags?.map(t => <span key={t} style={tagStyle}>#{t}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Board info widget ── */}
                    <div style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '0 0.75rem 0.75rem 0.75rem',
                        overflow: 'hidden',
                        transition: 'background-color .2s,border-color .2s',
                    }}>
                        <div style={{ padding: widgetHd, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: bc, display: 'inline-block', flexShrink: 0, border: '1.5px solid rgba(0,0,0,0.10)', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
                            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: dv(density, 12, 14, 15), color: 'var(--accent2)' }}>b/{board}</span>
                        </div>
                        <div style={{ padding: infoPad }}>
                            {postData.tags && postData.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                    {postData.tags.map(tag => <span key={tag} style={tagStyle}>#{tag}</span>)}
                                </div>
                            )}

                            {relatedPosts.length > 0 && (
                                <div>
                                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: dv(density, 5, 7, 8) }}>
                                        More in b/{board}
                                    </div>
                                    {relatedPosts.map((rp, i) => (
                                        <div key={rp.slug}
                                            onClick={() => navigate(`/b/${board}/nib/${rp.slug}`)}
                                            style={{ padding: `${dv(density, 5, 7, 8)}px 0`, borderBottom: i < relatedPosts.length - 1 ? '1px solid var(--border-soft)' : 'none', cursor: 'pointer' }}
                                        >
                                            <div style={{ fontSize: dv(density, 11, 12, 12), color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {rp.title}
                                            </div>
                                            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: 'var(--text-faint)', display: 'flex', gap: 8 }}>
                                                <span>▲ {rp.vote_count ?? 0}</span>
                                                <span>💬 {rp.reply_count ?? 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Reply box ── */}
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
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: dv(density, 8, 10, 12), marginBottom: dv(density, 12, 16, 20) }}>
                        <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: dv(density, 14, 16, 18), color: 'var(--text-primary)' }}>
                            {comments.length} squeaks
                        </span>
                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.625rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--text-faint)', marginLeft: 'auto' }}>
                            Sort
                        </span>
                        {(["hot", "new", "top"] as const).map(s => (
                            <MiniBtn key={s} active={commentSort === s} onClick={() => setCommentSort(s)}>
                                {COMMENT_SORT_LABELS[s]}
                            </MiniBtn>
                        ))}
                    </div>

                    <CommentGrid topic={board!} post={post!} comments={sortedComments} opToken={opToken} bc={bc} />

                    {comments.length > 5 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: dv(density, 16, 24, 32), paddingBottom: dv(density, 20, 32, 40) }}>
                            <button className="btn-ghost">
                                {comments.length - 5} more squeaks…
                            </button>
                        </div>
                    )}

                    {error && <p className="post-error">Failed to load comments.</p>}
                </div>
            </div>
        </div>
    );
}
