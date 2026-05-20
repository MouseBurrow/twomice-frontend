import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage";

type Props = { onCreated: () => Promise<void> };

export default function CreateTopicCard({ onCreated }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const isGuest = auth.status === "unknown" || auth.status === "guest";

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            await api.createTopic({ name, description });
            setName("");
            setDescription("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mcf-create">
            <h2>Start a new board</h2>

            {isGuest ? (
                <div className="mcf-auth-cta">
                    <span className="mcf-auth-icon" aria-hidden="true">🏡</span>
                    <p>Start a new board</p>
                    <span>Sign in to create your own corner of the mischief.</span>
                    <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
                </div>
            ) : (
                <>
                    <input
                        placeholder="Board name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <textarea
                        placeholder="Describe the board"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
                    />
                    <button
                        type="button"
                        className="mcf-submit"
                        onClick={submit}
                        disabled={!name || loading}
                    >
                        {loading && <span className="mcf-spinner"/>}
                        {loading ? "Creating…" : "Create board"}
                    </button>
                </>
            )}

            <ErrorMessage error={error}/>
        </section>
    );
}
