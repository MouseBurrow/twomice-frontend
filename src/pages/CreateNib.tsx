import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import "../assets/CreateNib.scss";

export default function CreateNib() {
    const { board } = useParams<{ board: string }>();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

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

    async function handleSubmit() {
        if (!board || !title.trim() || loading) return;
        setLoading(true);
        try {
            await api.createPost(board, { title: title.trim(), content: content.trim() });
            navigate(`/b/${board}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-nib-page">
            <div className="create-nib-board">
                <div className="create-nib-header">
                    <h1>New Nib</h1>
                    <p>Posting to /b/{board}</p>
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
                            {loading && <span className="create-nib-spinner"/>}
                            Post Nib
                        </button>
                        <Link to={`/b/${board}`} className="create-nib-cancel">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
