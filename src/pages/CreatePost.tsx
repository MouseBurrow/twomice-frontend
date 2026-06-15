import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateNibble } from "../hooks/useCreateNibble";
import { autoResize } from "../utils/autoResize";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import { boardColorFromName } from "../utils/hash";
import ErrorMessage from "../components/ErrorMessage";
import TagSelector from "../components/shared/TagSelector";
import "./create-post.scss";

export default function CreatePost() {
    const { board } = useParams<{ board: string }>();
    const { isGuest } = useAuth();
    const { density } = useDensity();
    const navigate = useNavigate();
    const bc = boardColorFromName(board ?? "");

    const { title, setTitle, content, setContent, tags, setTags, loading, error, submit } = useCreateNibble({
        board: board ?? "",
        onSuccess: () => navigate(`/b/${board}`),
    });

    if (isGuest) {
        return (
            <div className="create-post-page" data-density={density}>
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

    return (
        <div className="create-post-page" data-density={density}>
            <div className="create-post-board">
                <div className="create-post-header">
                    <h1>New Nibble</h1>
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
                        onInput={autoResize}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />

                    <TagSelector board={board} bc={bc} selected={tags} onChange={setTags} />

                    <div className="create-post-actions">
                        <button
                            type="button"
                            className="create-post-submit"
                            disabled={!title.trim() || loading}
                            onClick={submit}
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
