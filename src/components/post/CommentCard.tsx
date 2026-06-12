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
    const mountRef = useRef(true);
    const [col, setCol] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [replyOffset, setReplyOffset] = useState(0);
    const [replyTotal, setReplyTotal] = useState(0);

    const REPLY_LIMIT = 10;
    const replyHasMore = replyOffset + REPLY_LIMIT < replyTotal;

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
            const res = await api.getReplies(topic, post, comment.hash, REPLY_LIMIT, 0);
            if (!signal?.cancelled) {
                setReplies(res.data.filter(r => !r.deleted));
                setReplyOffset(0);
                setReplyTotal(res.total);
            }
        } catch (e) {
            if (!signal?.cancelled) setError(e as ApiError);
        } finally {
            if (!signal?.cancelled) setLoading(false);
        }
    }

    async function loadMoreReplies() {
        if (!replyHasMore) return;
        try {
            const nextOffset = replyOffset + REPLY_LIMIT;
            const res = await api.getReplies(topic, post, comment.hash, REPLY_LIMIT, nextOffset);
            setReplies(prev => [...prev, ...res.data.filter(r => !r.deleted)]);
            setReplyOffset(nextOffset);
        } catch { /* ignore */ }
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
                            await loadReplies({ cancelled: !mountRef.current });
                            if (mountRef.current) setCol(true);
                        }}
                    />
                )}
            </div>

            {loading && <p className="comment-loading">Loading replies…</p>}

            {!col && replies.length > 0 && (
                <div className="comment-replies">
                    <ReplyList color={threadColor} hasMore={replyHasMore} onLoadMore={loadMoreReplies}>
                        {replies.map(r => (
                            <ReplyRow
                                key={r.hash}
                                reply={r}
                                topic={topic}
                                post={post}
                                commentHash={comment.hash}
                                bc={bc}
                                parentColor={threadColor}
                                depth={0}
                                onUpdated={() => loadReplies({ cancelled: !mountRef.current })}
                            />
                        ))}
                    </ReplyList>
                </div>
            )}

            <ErrorMessage error={error} />
        </div>
    );
}
