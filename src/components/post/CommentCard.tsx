import { useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { CommentData, ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteColumn from "../shared/VoteColumn";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import CreateReplyCard from "./CreateReplyCard";
import { useDensity, dv } from "../../contexts/DensityContext";

type Props = {
    topic: string;
    post: string;
    comment: CommentData;
    opToken?: string;
};

export default function CommentCard({ topic, post, comment, opToken }: Props) {
    const { density } = useDensity();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [replyOpen, setReplyOpen] = useState(false);

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

    const isOp = !!(opToken && comment.anon_token === opToken);
    const padding = dv(density, "0.5rem 0.75rem", "0.75rem 1rem", "1rem 1.25rem");

    return (
        <article className="comment-card" style={{ padding }}>
            <VoteColumn initialScore={comment.vote_count ?? 0} />

            <div className="comment-bubble">
                <div className="comment-author">
                    {comment.anon_token && (
                        <AnonBadge token={comment.anon_token} isOp={isOp} isMe={comment.is_mine} sm />
                    )}
                    <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <span className="comment-hash">
                        #{comment.hash.slice(0, 7)}
                    </span>
                </div>

                <div className="comment-content">
                    <GreenText text={comment.content} />
                </div>

                <div className="comment-meta">
                    <button
                        onClick={() => setReplyOpen(!replyOpen)}
                        className="comment-reply-btn"
                    >
                        ↩ reply
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
                            await loadReplies();
                            setOpen(true);
                        }}
                    />
                )}

                {loading && <p className="comment-loading">Loading replies…</p>}

                {open && (
                    <div className="reply-list">
                        {replies.map(r => (
                            <div key={r.hash} className="reply-card">
                                <div className="reply-content">
                                    <GreenText text={r.content} />
                                </div>
                                <span className="reply-meta">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <ErrorMessage error={error} />
            </div>
        </article>
    );
}
