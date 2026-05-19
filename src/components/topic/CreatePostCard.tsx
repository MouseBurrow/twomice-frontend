import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage";

type Props = { topicName: string; onCreated: () => Promise<void> };

export default function CreatePostCard({ topicName, onCreated }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const isGuest = auth.status === "unknown" || auth.status === "guest";

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            await api.createPost(topicName, { title, content });
            setTitle("");
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="post-create">
            <h2>Post a nib</h2>

            {isGuest ? (
                <div className="post-auth-cta">
                    Sign in to post.
                    <button onClick={() => navigate("/auth")}>Sign in</button>
                </div>
            ) : (
                <>
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="What's the nibble?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={3}
                    />
                    <button
                        className="post-submit"
                        onClick={submit}
                        disabled={!title || loading}
                    >
                        {loading && <span className="post-spinner"/>}
                        {loading ? "Posting…" : "Post nib"}
                    </button>
                </>
            )}

            <ErrorMessage error={error}/>
        </section>
    );
}
