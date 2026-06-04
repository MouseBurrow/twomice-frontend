import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import "../assets/CreatePost.scss";

export default function CreatePost() {
    const { board } = useParams<{ board: string }>();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | undefined>(undefined);

    if (auth.status === "unknown" || auth.status === "guest") {
        return (
            <div className="create-post-page">
                <div className="create-post-board">
                    <div className="create-post-guest">
                        <p>You must be signed in to create a post.</p>
                        <Link to="/auth">Sign in</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!board) return null;

    async function handleSubmit() {
        if (!title.trim() || loading) return;
        setError(undefined);
        setLoading(true);
        try {
            await api.createPost(board!, { title: title.trim(), content: content.trim() });
            navigate(`/b/${board}`);
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-post-page">
            <div className="create-post-board">
                <div className="create-post-header">
                    <h1>New Post</h1>
                    <p>b/{board}</p>
                </div>

                <div className="create-post-form">
                    <label htmlFor="post-title">Title</label>
                    <input
                        id="post-title"
                        className="create-post-title"
                        type="text"
                        placeholder="Give your post a title…"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <label htmlFor="post-content">Content</label>
                    <textarea
                        id="post-content"
                        className="create-post-body"
                        placeholder="What's on your mind?"
                        rows={8}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />

                    <div className="create-post-actions">
                        <button
                            type="button"
                            className="create-post-submit"
                            disabled={!title.trim() || loading}
                            onClick={handleSubmit}
                        >
                            {loading && <span className="create-post-spinner" aria-hidden="true"/>}
                            {loading ? "Posting…" : "Post"}
                        </button>
                        <Link to={`/b/${board}`} className="create-post-cancel">
                            Cancel
                        </Link>
                    </div>

                    <ErrorMessage error={error}/>
                </div>
            </div>
        </div>
    );
}
