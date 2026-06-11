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

export default function CommentCard({ topic, post, comment, opToken, bc }: Props) {
    const { auth } = useAuth();
    const { density } = useDensity();
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
                                <div key={r.hash} style={{ position: 'relative', paddingLeft: circSize + 10, marginTop: i > 0 ? 4 : 0 }}>
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
        </div>
    );
}
