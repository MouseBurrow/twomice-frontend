import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import { useAuth } from "../../contexts/AuthContext";
import { autoResize } from "../../utils/autoResize";
import { useDensity } from "../../contexts/DensityContext";
import { dv } from "../../utils/density";
import Pencil from "../../icons/Pencil";
import AnonBadge from "../shared/AnonBadge";
import ErrorMessage from "../ErrorMessage";

type Props = {
    topic: string;
    post: string;
    bc: string;
    myToken?: string;
    commentHash?: string;
    onCreated: () => Promise<void>;
};

export default function CreateCard({ topic, post, bc, myToken, commentHash, onCreated }: Props) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError>();
    const { isGuest } = useAuth();
    const navigate = useNavigate();
    const { density: d } = useDensity();
    const isReply = !!commentHash;
    const bcDashed = `color-mix(in srgb, ${bc} 36%, var(--border))`;

    const cardStyle = useMemo(() => ({
        '--card-accent': bc,
        '--card-bg': 'var(--bg-surface)',
        '--card-bd': bcDashed,
        '--card-pad': isReply
            ? dv(d, '8px 10px', '10px 12px', '12px 14px')
            : dv(d, '10px 12px', '12px 16px', '14px 18px'),
        '--card-header-mb': isReply ? 0 : dv(d, 6, 8, 10),
        '--card-textarea-minh': isReply ? dv(d, 36, 40, 44) : dv(d, 52, 64, 76),
        '--card-textarea-mb': dv(d, 6, 8, 10),
        '--card-textarea-pad': `${dv(d, 4, 5, 6)}px 0`,
        '--card-textarea-fs': isReply ? dv(d, 11, 12, 12) : dv(d, 12, 13, 13),
        '--card-submit-fs': dv(d, 11, 12, 13),
        '--card-submit-pad': isReply
            ? dv(d, '3px 10px', '4px 12px', '5px 14px')
            : dv(d, '5px 14px', '6px 18px', '7px 20px'),
    } as React.CSSProperties), [bc, bcDashed, d, isReply]);

    async function submit() {
        try {
            setError(undefined);
            setLoading(true);
            if (isReply) {
                await api.createReply(topic, post, commentHash, { content });
            } else {
                await api.createComment(topic, post, { content });
            }
            setContent("");
            await onCreated();
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    if (isGuest) {
        if (isReply) {
            return (
                <div className="reply-auth-cta">
                    <button onClick={() => navigate("/auth")}>Sign in to echo</button>
                </div>
            );
        }
        return (
            <div className="comment-auth-cta">
                <span className="comment-auth-icon" aria-hidden="true">🐭</span>
                <p>Leave a squeak</p>
                <span>Sign in to join the mischief.</span>
                <button type="button" onClick={() => navigate("/auth")}>Sign in</button>
            </div>
        );
    }

    return (
        <div
            className={isReply ? "reply-create" : "comment-create"}
            style={cardStyle}
        >
            {!isReply && (
                <div className="create-card-header">
                    <Pencil className="create-card-pencil" />
                    <span className="create-card-header-label">Leave a Squeak</span>
                    <div className="create-card-header-end">
                        {myToken && <AnonBadge token={myToken} isMe />}
                    </div>
                </div>
            )}

            {isReply && myToken && (
                <div className="reply-create-identity">
                    <AnonBadge token={myToken} isMe />
                    <span className="reply-create-context">
                        replying to #{commentHash!.slice(0, 7)}
                    </span>
                </div>
            )}

            <textarea
                placeholder="Start with > to greentext…"
                onInput={autoResize}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={isReply ? 2 : 3}
                className="create-card-textarea"
            />
            <div className="create-card-footer">
                <button
                    className="create-card-submit"
                    disabled={!content || loading}
                    onClick={submit}
                >
                    {loading ? (
                        <span className="btn-loading"><span className="spin-dot" />{isReply ? "Echoing…" : "Squeaking…"}</span>
                    ) : (
                        isReply ? "Echo" : "Squeak!"
                    )}
                </button>
            </div>
            <ErrorMessage error={error} />
        </div>
    );
}
