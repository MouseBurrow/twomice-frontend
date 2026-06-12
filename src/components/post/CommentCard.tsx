import { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { CommentData, ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import ModActions from "../shared/ModActions";
import CreateReplyCard from "./CreateReplyCard";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/date";
import { hashColor } from "../../utils/hash";
import "../../assets/components.scss";

type Props = {
    topic: string;
    post: string;
    comment: CommentData;
    opToken?: string;
    bc?: string;
};

function ReplyRow({ reply, topic, post, commentHash, bc, onUpdated }: {
    reply: ReplyData;
    topic: string;
    post: string;
    commentHash: string;
    bc?: string;
    onUpdated: () => void;
}) {
    const mountRef = useRef(true);
    const [nested, setNested] = useState<ReplyData[]>([]);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedLoading, setNestedLoading] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyBusy, setReplyBusy] = useState(false);
    const [replyError, setReplyError] = useState<ApiError>();
    const [showNested, setShowNested] = useState(false);

    useEffect(() => {
        return () => { mountRef.current = false; };
    }, []);

    async function loadNested() {
        setNestedLoading(true);
        try {
            const data = await api.getReplies(topic, post, reply.hash);
            if (!mountRef.current) return;
            setNested(data.filter(r => !r.deleted));
            setNestedOpen(true);
        } catch { /* ignore */ } finally {
            if (mountRef.current) setNestedLoading(false);
        }
    }

    async function submitReply() {
        if (!replyContent.trim() || replyBusy) return;
        setReplyBusy(true);
        setReplyError(undefined);
        try {
            await api.createReply(topic, post, commentHash, { content: replyContent, reply_hash: reply.hash });
            setReplyContent("");
            setReplyOpen(false);
            await loadNested();
            onUpdated();
        } catch (e) {
            setReplyError(e as ApiError);
        } finally {
            setReplyBusy(false);
        }
    }

    const threadColor = reply.anon_token
        ? hashColor(reply.anon_token).dot
        : undefined;
    const lineColor = threadColor
        ? `color-mix(in srgb, ${threadColor} 38%, var(--text-faint))`
        : 'var(--text-faint)';
    const circFill = threadColor
        ? `color-mix(in srgb, ${threadColor} 10%, var(--bg-elevated))`
        : 'var(--bg-elevated)';
    const circSize = 9;
    const circR = circSize / 2;
    const circCenter = 21;
    const circTop = Math.round(circCenter - circR);
    const circBottom = circTop + circSize;
    const lineX = Math.round(circR) - 1;

    return (
        <div style={{ position: 'relative', paddingLeft: circSize + 10, marginTop: 4 }}>
            <div className="thread-dot"
                style={{ top: circTop, width: circSize, height: circSize, background: circFill, border: `2px solid ${lineColor}` }}
            />
            <div className="reply-card-inline">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    {reply.anon_token && <AnonBadge token={reply.anon_token} sm />}
                    <span className="reply-card-inline-meta">{formatDate(reply.created_at)}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        {nested.length > 0 && (
                            <button className="comment-collapse" onClick={() => setShowNested(!showNested)}>
                                {showNested ? '[–]' : `[+${nested.length}]`}
                            </button>
                        )}
                    </div>
                </div>
                <div className="reply-card-inline-content">
                    <GreenText text={reply.content} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
                    <VoteButtons votes={reply.vote_count ?? 0} disabled={false} bc={bc} />
                    <button className="reply-chip" onClick={() => setReplyOpen(!replyOpen)}>
                        ↩ squeak back
                    </button>
                </div>

                {replyOpen && (
                    <div style={{ marginTop: '0.375rem' }}>
                        <textarea
                            style={{ width: '100%', padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0 0.375rem 0.375rem 0.375rem', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-body)', resize: 'vertical', minHeight: '2.5rem', marginBottom: '0.375rem' }}
                            placeholder="Echo back…"
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                            <button
                                style={{ padding: '0.25rem 0.75rem', background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: '6.1875rem', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer' }}
                                disabled={!replyContent.trim() || replyBusy}
                                onClick={submitReply}
                            >
                                {replyBusy ? "…" : "Echo"}
                            </button>
                            <button
                                style={{ background: 'none', border: 'none', fontSize: '0.6875rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                                onClick={() => { setReplyOpen(false); setReplyError(undefined); }}
                            >
                                Cancel
                            </button>
                        </div>
                        <ErrorMessage error={replyError} />
                    </div>
                )}

                {nestedLoading && <p className="comment-loading">Loading…</p>}

                {showNested && nested.length > 0 && (
                    <div style={{ marginTop: '0.5rem', borderLeft: '1px solid var(--border-soft)', paddingLeft: '0.75rem' }}>
                        {nested.map(nr => (
                            <ReplyRow key={nr.hash} reply={nr} topic={topic} post={post} commentHash={commentHash} bc={bc} onUpdated={onUpdated} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentCard({ topic, post, comment, opToken, bc }: Props) {
    const { auth } = useAuth();
    const mountRef = useRef(true);
    const [col, setCol] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);
    const [removed, setRemoved] = useState(false);

    const isAdmin = auth.status === "admin";

    if (removed) {
        return (
            <div className="comment-removed">
                [removed by moderator]
            </div>
        );
    }

    async function loadReplies(signal?: { cancelled: boolean }) {
        try {
            setLoading(true);
            setError(undefined);
            const data = await api.getReplies(topic, post, comment.hash);
            if (!signal?.cancelled) {
                setReplies(data.filter(r => !r.deleted));
            }
        } catch (e) {
            if (!signal?.cancelled) setError(e as ApiError);
        } finally {
            if (!signal?.cancelled) setLoading(false);
        }
    }

    useEffect(() => {
        return () => { mountRef.current = false; };
    }, []);

    useEffect(() => {
        loadReplies({ cancelled: !mountRef.current });
    }, []);

    const isOp = !!(opToken && comment.anon_token === opToken);
    const isMe = !!(comment.is_mine);

    const threadColor = comment.anon_token
        ? hashColor(comment.anon_token).dot
        : undefined;

    return (
        <div className="comment-outer">
            <div className="comment-row">
                <div className="comment-header">
                    {comment.anon_token && (
                        <AnonBadge token={comment.anon_token} isOp={isOp} isMe={isMe} sm />
                    )}
                    <span className="comment-time">{formatDate(comment.created_at)}</span>
                    <span className="comment-id">#{comment.hash.slice(0, 7)}</span>
                    <div className="comment-header-end">
                        <ModActions show={isAdmin} type="comment" onRemove={() => setRemoved(true)} />
                        {replies.length > 0 && (
                            <button className="comment-collapse" onClick={() => setCol(!col)}>
                                {col ? `[+${replies.length}]` : '[–]'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="comment-body">
                    <GreenText text={comment.content} />
                </div>

                <div className="comment-footer">
                    <VoteButtons votes={comment.vote_count ?? 0} disabled={false} bc={bc} />
                    {!replyOpen && !col && (
                        <button className="reply-chip" onClick={() => setReplyOpen(true)}>
                            ↩ squeak back
                        </button>
                    )}
                </div>

                {replyOpen && (
                    <CreateReplyCard
                        topic={topic}
                        post={post}
                        commentHash={comment.hash}
                        myToken={comment.is_mine ? comment.anon_token : undefined}
                        onCreated={async () => {
                            setReplyOpen(false);
                            await loadReplies({ cancelled: !mountRef.current });
                            if (mountRef.current) setCol(true);
                        }}
                    />
                )}

                {loading && <p className="comment-loading">Loading replies…</p>}

                {!col && replies.length > 0 && (
                    <div className="comment-replies">
                        {replies.map((r, i, arr) => {
                            const isLast = i === arr.length - 1;
                            const lineColor = threadColor
                                ? `color-mix(in srgb, ${threadColor} 38%, var(--text-faint))`
                                : 'var(--text-faint)';
                            const circFill = threadColor
                                ? `color-mix(in srgb, ${threadColor} 10%, var(--bg-elevated))`
                                : 'var(--bg-elevated)';
                            const circSize = 9;
                            const circR = circSize / 2;
                            const circCenter = 21;
                            const circTop = Math.round(circCenter - circR);
                            const circBottom = circTop + circSize;
                            const lineX = Math.round(circR) - 1;

                            return (
                                <div key={r.hash} style={{ position: 'relative' }}>
                                    {i === 0 && (
                                        <div className="thread-line"
                                            style={{ left: lineX, top: 0, height: circTop, borderColor: lineColor }}
                                        />
                                    )}

                                    <div className="thread-dot"
                                        style={{ top: circTop, width: circSize, height: circSize, background: circFill, border: `2px solid ${lineColor}` }}
                                    />

                                    {!isLast && (
                                        <div className="thread-line"
                                            style={{ left: lineX, top: circBottom, bottom: -circTop, borderColor: lineColor }}
                                        />
                                    )}

                                    <ReplyRow
                                        reply={r}
                                        topic={topic}
                                        post={post}
                                        commentHash={comment.hash}
                                        bc={bc}
                                        onUpdated={() => loadReplies({ cancelled: !mountRef.current })}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <ErrorMessage error={error} />
            </div>
        </div>
    );
}
