import { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { CommentData, ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteColumn from "../shared/VoteColumn";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import ModActions from "../shared/ModActions";
import CreateReplyCard from "./CreateReplyCard";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";
import { dv } from "../../utils/density";
import { formatDate } from "../../utils/date";
import { hashColor } from "../../utils/hash";

type Props = {
    topic: string;
    post: string;
    comment: CommentData;
    opToken?: string;
};

export default function CommentCard({ topic, post, comment, opToken }: Props) {
    const { auth } = useAuth();
    const { density } = useDensity();
    const mountRef = useRef(true);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);
    const [removed, setRemoved] = useState(false);

    const isAdmin = auth.status === "admin";

    if (removed) {
        return (
            <article className="comment-card" style={{ padding: dv(density, "0.375rem 0.75rem", "0.5rem 1rem", "0.625rem 1.125rem") }}>
                <span className="comment-removed">[removed by moderator]</span>
            </article>
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

    const isOp = !!(opToken && comment.anon_token === opToken);
    const padding = dv(density, "0.5rem 0.75rem", "0.75rem 1rem", "1rem 1.25rem");

    /* Thread colour derived from the parent comment's anon_token */
    const threadColor = comment.anon_token
        ? hashColor(comment.anon_token).dot
        : undefined;

    return (
        <article className="comment-card" style={{ padding }}>
            <VoteColumn initialScore={comment.vote_count ?? 0} />

            <div className="comment-bubble">
                <div className="comment-author">
                    {comment.anon_token && (
                        <AnonBadge token={comment.anon_token} isOp={isOp} isMe={comment.is_mine} sm />
                    )}
                    <span className="comment-date">
                        {formatDate(comment.created_at)}
                    </span>
                    <span className="comment-hash">
                        #{comment.hash.slice(0, 7)}
                    </span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem", alignItems: "center" }}>
                        <ModActions
                            show={isAdmin}
                            type="comment"
                            onRemove={() => setRemoved(true)}
                        />
                    </div>
                </div>

                <div className="comment-content">
                    <GreenText text={comment.content} />
                </div>

                <div className="comment-meta">
                    <button
                        onClick={() => setReplyOpen(!replyOpen)}
                        className="comment-reply-btn"
                    >
                        ↩ squeak back
                    </button>
                    {open && (
                        <button
                            className="comment-replies-toggle"
                            onClick={() => { setOpen(false); setReplyOpen(false); }}
                            aria-label="Hide replies"
                        >
                            hide replies
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
                            if (mountRef.current) setOpen(true);
                        }}
                    />
                )}

                {loading && <p className="comment-loading">Loading replies…</p>}

                {/* Dot-terminus reply threading */}
                {open && replies.length > 0 && (
                    <div className="reply-thread" style={{ paddingLeft: 18 }}>
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
                            const circTop = 5;
                            const circBottom = circTop + circSize;
                            const lineX = Math.round(circR) - 1;

                            return (
                                <div key={r.hash} style={{ position: 'relative', paddingLeft: circSize + 10, marginTop: i > 0 ? 4 : 0 }}>
                                    {/* Lead line */}
                                    {i === 0 && (
                                        <div style={{
                                            position: 'absolute', left: lineX, top: 0,
                                            height: circTop, borderLeft: `2px dashed ${lineColor}`,
                                        }} />
                                    )}

                                    {/* Circle */}
                                    <div style={{
                                        position: 'absolute', left: 0, top: circTop,
                                        width: circSize, height: circSize, borderRadius: '50%',
                                        background: circFill,
                                        border: `2px solid ${lineColor}`, zIndex: 2,
                                    }} />

                                    {/* Dashed segment between circles */}
                                    {!isLast && (
                                        <div style={{
                                            position: 'absolute', left: lineX,
                                            top: circBottom, bottom: -circTop,
                                            borderLeft: `2px dashed ${lineColor}`,
                                        }} />
                                    )}

                                    <div className="reply-card-inline">
                                        <div className="reply-card-inline-content">
                                            <GreenText text={r.content} />
                                        </div>
                                        <span className="reply-card-inline-meta">
                                            {formatDate(r.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <ErrorMessage error={error} />
            </div>
        </article>
    );
}
