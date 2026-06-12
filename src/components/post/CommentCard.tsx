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
import ReplyList from "./ReplyList";
import ReplyRow from "./ReplyRow";
import { formatDate } from "../../utils/date";
import { hashColor } from "../../utils/hash";
import { useAuth } from "../../contexts/AuthContext";
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
    const [col, setCol] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [replyOffset, setReplyOffset] = useState(0);
    const [replyTotal, setReplyTotal] = useState(0);
    const loadingMoreRef = useRef(false);

    const REPLY_LIMIT = 10;
    const replyHasMore = replyOffset + REPLY_LIMIT < replyTotal;

    const isAdmin = auth.status === "admin";

    async function loadReplies(cancelled?: () => boolean) {
        try {
            setLoading(true);
            setError(undefined);
            const res = await api.getReplies(topic, post, comment.hash, REPLY_LIMIT, 0);
            if (cancelled?.()) return;
            setReplies(res.data);
            setReplyOffset(0);
            setReplyTotal(res.total);
        } catch (e) {
            if (!cancelled?.()) setError(e as ApiError);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }

    async function loadMoreReplies() {
        if (loadingMoreRef.current || !replyHasMore) return;
        loadingMoreRef.current = true;
        try {
            const nextOffset = replyOffset + REPLY_LIMIT;
            const res = await api.getReplies(topic, post, comment.hash, REPLY_LIMIT, nextOffset);
            const existing = new Set(replies.map(r => r.hash));
            const fresh = res.data.filter(r => !existing.has(r.hash));
            if (fresh.length > 0) {
                setReplies(prev => [...prev, ...fresh]);
                setReplyOffset(nextOffset);
            } else {
                setReplyOffset(replyTotal);
            }
        } catch { /* ignore */ } finally {
            loadingMoreRef.current = false;
        }
    }

    useEffect(() => {
        let cancelled = false;
        loadReplies(() => cancelled);
        return () => { cancelled = true; };
    }, []);

    if (removed || comment.deleted) {
        return (
            <div className="comment-outer">
                <div className="comment-card comment-removed">
                    <div className="comment-header">
                        <span className="comment-id">#{comment.hash.slice(0, 7)}</span>
                        <div className="comment-header-end">
                            <ModActions show={isAdmin} type="comment" onRemove={() => setRemoved(true)} />
                        </div>
                    </div>
                    <div className="comment-body">
                        <em>[removed]</em>
                    </div>
                </div>
            </div>
        );
    }

    const isOp = !!(opToken && comment.anon_token === opToken);
    const isMe = !!(comment.is_mine);

    const commentColor = comment.anon_token
        ? hashColor(comment.anon_token).dot
        : undefined;

    return (
        <div className="comment-outer">
            <div className="comment-card">
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
                            await loadReplies();
                            if (mountRef.current) setCol(true);
                        }}
                    />
                )}
            </div>

            {loading && <p className="comment-loading">Loading replies…</p>}

            {!col && replies.length > 0 && (
                <div className="comment-replies">
                    <ReplyList hasMore={replyHasMore} onLoadMore={loadMoreReplies}>
                        {replies.map((r, i) => (
                            <ReplyRow
                                key={r.hash}
                                reply={r}
                                topic={topic}
                                post={post}
                                commentHash={comment.hash}
                                bc={bc}
                                connectorColor={commentColor}
                                depth={0}
                                isFirst={i === 0}
                                hasMoreSiblings={i < replies.length - 1 || replyHasMore}
                                onUpdated={() => loadReplies()}
                            />
                        ))}
                    </ReplyList>
                </div>
            )}

            <ErrorMessage error={error} />
        </div>
    );
}
