import { useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { CommentData, ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteColumn from "../shared/VoteColumn";
import CreateReplyCard from "./CreateReplyCard";

type Props = { topic: string; post: string; comment: CommentData };

export default function CommentCard({ topic, post, comment }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [error, setError] = useState<ApiError>();

    async function loadReplies() {
        try {
            setLoading(true);
            setError(undefined);
            const data = await api.getReplies(topic, post, comment.hash);
            setReplies(data.filter(r => !r.deleted));
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    async function toggleReplies() {
        if (open) { setOpen(false); return; }
        if (replies.length === 0) await loadReplies();
        setOpen(true);
    }

    return (
        <article className="comment-card">
            <VoteColumn initialScore={comment.vote_count ?? 0}/>

            <div className="comment-bubble">
                <p className="comment-content">{comment.content}</p>

                <div className="comment-meta">
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    <button className="comment-replies-toggle" onClick={toggleReplies}>
                        {open ? "hide echoes" : "echoes"}
                    </button>
                </div>

                {loading && <p className="comment-loading">Loading echoes…</p>}

                {open && (
                    <div className="comment-replies">
                        {replies.map(r => (
                            <div key={r.hash} className="comment-reply">
                                <p className="comment-reply-content">{r.content}</p>
                                <span className="comment-reply-meta">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        <CreateReplyCard
                            topic={topic}
                            post={post}
                            commentHash={comment.hash}
                            onCreated={loadReplies}
                        />
                    </div>
                )}

                <ErrorMessage error={error}/>
            </div>
        </article>
    );
}
