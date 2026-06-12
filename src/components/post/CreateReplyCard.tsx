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
    commentHash: string;
    myToken?: string;
    onCreated: () => Promise<void>;
};

export default function CreateReplyCard({ topic, post, commentHash, myToken, onCreated }: Props) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { isGuest } = useAuth();
    const navigate = useNavigate();

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            await api.createReply(topic, post, commentHash, { content });
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
            {myToken && (
                <div className="reply-create-identity">
                    <AnonBadge token={myToken} isMe sm />
                    <span className="reply-create-context">
                        replying to #{commentHash.slice(0, 7)}
                    </span>
                </div>
            )}
            <textarea
                placeholder="Start with > to quote…"
                onInput={autoResize}
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
