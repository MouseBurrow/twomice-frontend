import { useEffect, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { CommentData, ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import ModActions from "../shared/ModActions";
import CreateCard from "./CreateCard";
import ReplyList from "./ReplyList";
import ReplyRow from "./ReplyRow";
import { useFormatRelativeTime } from "../../utils/date";
import { hashColor } from "../../utils/hash";
import { useAuth } from "../../contexts/AuthContext";
import { useOffsetPagination } from "../../hooks/useOffsetPagination";
import "../../assets/components.scss";

const REPLY_LIMIT = 10;

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
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);
    const [removed, setRemoved] = useState(false);

    const isAdmin = auth.status === "admin";
    const replyPagination = useOffsetPagination<ReplyData>(REPLY_LIMIT);
    const commentTime = useFormatRelativeTime(comment.created_at);

    async function loadReplies() {
        try {
            setLoading(true);
            setError(undefined);
            const res = await api.getReplies(topic, post, comment.hash, REPLY_LIMIT, 0);
            replyPagination.replace(res.data, res.total, 0);
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    async function loadMoreReplies() {
        await replyPagination.loadMore(
            nextOffset => api.getReplies(topic, post, comment.hash, REPLY_LIMIT, nextOffset)
        );
    }

    useEffect(() => {
        loadReplies();
    }, []);

    if (removed || comment.deleted) {
        return (
            <div className="comment-outer">
                <div className="comment-card comment-removed">
                    <div className="comment-header">
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
        ? hashColor(comment.anon_token.slice(0, 6)).dot
        : undefined;

    return (
        <div className="comment-outer">
            <div className="comment-card">
                <div className="comment-header">
                    {comment.anon_token && (
                        <AnonBadge token={comment.anon_token} isOp={isOp} isMe={isMe} sm />
                    )}
                    <span className="comment-time">{commentTime}</span>
                    <div className="comment-header-end">
                        <ModActions show={isAdmin} type="comment" onRemove={() => setRemoved(true)} />
                        {replyPagination.items.length > 0 && (
                            <button className="comment-collapse" onClick={() => setCol(!col)}>
                                {col ? `[+${replyPagination.items.length}]` : '[–]'}
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
                    <CreateCard
                        topic={topic}
                        post={post}
                        commentHash={comment.hash}
                        myToken={comment.is_mine ? comment.anon_token : undefined}
                        onCreated={async () => {
                            setReplyOpen(false);
                            await loadReplies();
                        }}
                    />
                )}
            </div>

            {loading && <p className="comment-loading">Loading replies…</p>}

            {!col && replyPagination.items.length > 0 && (
                <div className="comment-replies">
                    <ReplyList hasMore={replyPagination.hasMore} onLoadMore={loadMoreReplies}>
                        {replyPagination.items.map((r, i) => (
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
                                hasMoreSiblings={i < replyPagination.items.length - 1 || replyPagination.hasMore}
                            />
                        ))}
                    </ReplyList>
                </div>
            )}

            <ErrorMessage error={error} />
        </div>
    );
}
