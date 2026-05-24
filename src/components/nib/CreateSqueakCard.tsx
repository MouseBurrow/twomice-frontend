import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage";

type Props = { topic: string; post: string; onCreated: () => Promise<void> };

export default function CreateSqueakCard({ topic, post, onCreated }: Props) {
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
            await api.createSqueak(topic, post, { content });
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="squeak-create">
            <h2>+ Squeak</h2>

            {isGuest ? (
                <div className="squeak-auth-cta">
                    <span className="squeak-auth-icon" aria-hidden="true">🐭</span>
                    <p>Add your squeak</p>
                    <span>Sign in to join the mischief.</span>
                    <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
                </div>
            ) : (
                <>
                    <textarea
                        placeholder="What's your squeak?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={3}
                    />
                    <button
                        type="button"
                        className="squeak-submit"
                        onClick={submit}
                        disabled={!content || loading}
                    >
                        {loading && <span className="squeak-spinner"/>}
                        {loading ? "Squeaking…" : "Squeak"}
                    </button>
                </>
            )}

            <ErrorMessage error={error}/>
        </section>
    );
}
