import { useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { SqueakData, EchoData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteColumn from "../shared/VoteColumn";
import CreateEchoCard from "./CreateEchoCard";

type Props = { topic: string; post: string; comment: SqueakData };

export default function SqueakCard({ topic, post, comment }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [echoes, setEchoes] = useState<EchoData[]>([]);
    const [error, setError] = useState<ApiError>();

    async function loadEchoes() {
        try {
            setLoading(true);
            setError(undefined);
            const data = await api.getEchoes(topic, post, comment.hash);
            setEchoes(data.filter(r => !r.deleted));
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    async function toggleEchoes() {
        if (open) { setOpen(false); return; }
        await loadEchoes();
        setOpen(true);
    }

    return (
        <article className="squeak-card">
            <VoteColumn initialScore={comment.vote_count ?? 0}/>

            <div className="squeak-bubble">
                <p className="squeak-content">{comment.content}</p>

                <div className="squeak-meta">
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    <button
                        className="squeak-replies-toggle"
                        onClick={toggleEchoes}
                        aria-label={open ? "Hide echoes for this comment" : "Show echoes for this comment"}
                    >
                        {open ? "hide echoes" : "echoes"}
                    </button>
                </div>

                {loading && <p className="squeak-loading">Loading echoes…</p>}

                {open && (
                    <div className="echo-list">
                        {echoes.map(r => (
                            <div key={r.hash} className="echo-card">
                                <p className="echo-content">{r.content}</p>
                                <span className="echo-meta">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        <CreateEchoCard
                            topic={topic}
                            post={post}
                            commentHash={comment.hash}
                            onCreated={loadEchoes}
                        />
                    </div>
                )}

                <ErrorMessage error={error}/>
            </div>
        </article>
    );
}
