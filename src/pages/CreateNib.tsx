import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import "../assets/CreateNib.scss";

export default function CreateNib() {
    const { board } = useParams<{ board: string }>();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | undefined>(undefined);

    if (auth.status === "unknown" || auth.status === "guest") {
        return (
            <div className="create-nib-page">
                <div className="create-nib-board">
                    <div className="create-nib-guest">
                        <p>You must be signed in to post a nib.</p>
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
        <div className="create-nib-page">
            <div className="create-nib-board">
                <div className="create-nib-header">
                    <h1>New Nib</h1>
                    <p>b/{board}</p>
                </div>

                <div className="create-nib-form">
                    <label htmlFor="nib-title">Title</label>
                    <input
                        id="nib-title"
                        className="create-nib-title"
                        type="text"
                        placeholder="Give your nib a title…"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <label htmlFor="nib-content">Content</label>
                    <textarea
                        id="nib-content"
                        className="create-nib-body"
                        placeholder="What's on your mind?"
                        rows={8}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />

                    <div className="create-nib-actions">
                        <button
                            type="button"
                            className="create-nib-submit"
                            disabled={!title.trim() || loading}
                            onClick={handleSubmit}
                        >
                            {loading && <span className="create-nib-spinner" aria-hidden="true"/>}
                            {loading ? "Posting…" : "Post Nib"}
                        </button>
                        <Link to={`/b/${board}`} className="create-nib-cancel">
                            Cancel
                        </Link>
                    </div>

                    <ErrorMessage error={error}/>
                </div>
            </div>
        </div>
    );
}
