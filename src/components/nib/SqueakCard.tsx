import { useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { SqueakData, EchoData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteColumn from "../shared/VoteColumn";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import CreateEchoCard from "./CreateEchoCard";
import { useDensity } from "../../contexts/DensityContext";

type Props = { topic: string; post: string; comment: SqueakData };

export default function SqueakCard({ topic, post, comment }: Props) {
    const { density } = useDensity();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [echoes, setEchoes] = useState<EchoData[]>([]);
    const [error, setError] = useState<ApiError>();

    async function loadEchoes(signal?: { cancelled: boolean }) {
        try {
            setLoading(true);
            setError(undefined);
            const data = await api.getEchoes(topic, post, comment.hash);
            if (!signal?.cancelled) {
                setEchoes(data.filter(r => !r.deleted));
            }
        } catch (e) {
            if (!signal?.cancelled) setError(e as ApiError);
        } finally {
            if (!signal?.cancelled) setLoading(false);
        }
    }

    async function toggleEchoes() {
        if (open) { setOpen(false); return; }
        await loadEchoes();
        setOpen(true);
    }

    const padding = density === "compact" ? "8px 12px" : density === "spacious" ? "16px 20px" : "12px 16px";

    return (
        <article className="squeak-card" style={{ padding }}>
            <VoteColumn initialScore={comment.vote_count ?? 0} />

            <div className="squeak-bubble">
                {comment.anon_token && (
                    <div className="squeak-author">
                        <AnonBadge token={comment.anon_token} isMe={comment.is_mine} sm />
                    </div>
                )}

                <div className="squeak-content">
                    <GreenText text={comment.content} />
                </div>

                <div className="squeak-meta">
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    <button
                        className="squeak-replies-toggle"
                        onClick={toggleEchoes}
                        aria-label={open ? "Hide echoes" : "Show echoes"}
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

                <ErrorMessage error={error} />
            </div>
        </article>
    );
}
