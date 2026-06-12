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
    onCreated: () => Promise<void>;
};

export default function CreateCommentCard({ topic, post, myToken, onCreated }: Props) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { isGuest } = useAuth();
    const navigate = useNavigate();

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            await api.createComment(topic, post, { content });
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="comment-create">
            {isGuest ? (
                <div className="comment-auth-cta">
                    <span className="comment-auth-icon" aria-hidden="true">🐭</span>
                    <p>Add your squeak</p>
                    <span>Sign in to join the mischief.</span>
                    <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
                </div>
            ) : (
                <>
                    {myToken && (
                        <div className="comment-create-identity">
                            <AnonBadge token={myToken} isMe sm />
                            <span className="comment-create-identity-label">posting anonymously · identity is private</span>
                        </div>
                    )}
                    <textarea
                        placeholder="Start with > to quote…"
                        onInput={autoResize}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={3}
                    />
                    <button
                        type="button"
                        className="comment-submit"
                        onClick={submit}
                        disabled={!content || loading}
                    >
                        {loading && <span className="comment-spinner"/>}
                        {loading ? "Posting…" : "Post Reply"}
                    </button>
                </>
            )}

            <ErrorMessage error={error}/>
        </section>
    );
}
