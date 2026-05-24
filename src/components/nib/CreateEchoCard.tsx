import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage";

type Props = {
    topic: string;
    post: string;
    commentHash: string;
    onCreated: () => Promise<void>;
};

export default function CreateEchoCard({ topic, post, commentHash, onCreated }: Props) {
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
            await api.createEcho(topic, post, commentHash, { content });
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    if (isGuest) {
        return (
            <div className="reply-auth-cta">
                <button onClick={() => navigate("/auth")}>Sign in to echo</button>
            </div>
        );
    }

    return (
        <div className="reply-create">
            <textarea
                placeholder="↩ echo…"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={2}
            />
            <button onClick={submit} disabled={!content || loading}>
                {loading ? "Echoing…" : "Echo"}
            </button>
            <ErrorMessage error={error}/>
        </div>
    );
}
