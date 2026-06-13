import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import { autoResize } from "../../utils/autoResize";
import AnonBadge from "../shared/AnonBadge";
import ErrorMessage from "../ErrorMessage";

type Props = {
    topic: string;
    post: string;
    myToken?: string;
    commentHash?: string;
    onCreated: () => Promise<void>;
};

export default function CreateCard({ topic, post, myToken, commentHash, onCreated }: Props) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { isGuest } = useAuth();
    const navigate = useNavigate();
    const isReply = !!commentHash;

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            if (isReply) {
                await api.createReply(topic, post, commentHash, { content });
            } else {
                await api.createComment(topic, post, { content });
            }
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    if (isGuest) {
        if (isReply) {
            return (
                <div className="reply-auth-cta">
                    <button onClick={() => navigate("/auth")}>Sign in to echo</button>
                </div>
            );
        }
        return (
            <div className="comment-auth-cta">
                <span className="comment-auth-icon" aria-hidden="true">🐭</span>
                <p>Add your squeak</p>
                <span>Sign in to join the mischief.</span>
                <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
            </div>
        );
    }

    return (
        <div className={isReply ? "reply-create" : "comment-create"}>
            {myToken && (
                <div className={isReply ? "reply-create-identity" : "comment-create-identity"}>
                    <AnonBadge token={myToken} isMe sm />
                    <span className={isReply ? "reply-create-context" : "comment-create-identity-label"}>
                        {isReply ? `replying to #${commentHash!.slice(0, 7)}` : "posting anonymously · identity is private"}
                    </span>
                </div>
            )}
            <textarea
                placeholder="Start with > to quote…"
                onInput={autoResize}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={isReply ? 2 : 3}
            />
            <button
                type="button"
                className={isReply ? "" : "comment-submit"}
                onClick={submit}
                disabled={!content || loading}
            >
                {!isReply && loading && <span className="comment-spinner" />}
                {loading ? (isReply ? "Echoing…" : "Posting…") : (isReply ? "Echo" : "Post Reply")}
            </button>
            <ErrorMessage error={error} />
        </div>
    );
}
