import { useRef, useState } from "react";
import { useCreateNibble } from "../../hooks/useCreateNibble";
import { useAuth } from "../../contexts/AuthContext";
import { autoResize } from "../../utils/autoResize";
import { useDensity } from "../../contexts/DensityContext";
import { dv } from "../../utils/density";
import DraftMarker from "../shared/DraftMarker";
import TagSelector from "../shared/TagSelector";
import ErrorMessage from "../ErrorMessage";

type Props = { topicName: string; bc: string; onCreated: () => void };

export default function CreatePostCard({ topicName, bc, onCreated }: Props) {
    const { isGuest } = useAuth();
    const { density: d } = useDensity();
    const { title, setTitle, content, setContent, tags, setTags, error, submit, reset } = useCreateNibble({
        board: topicName,
        onSuccess: onCreated,
    });

    const [expanded, setExpanded] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [justDone, setJustDone] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);

    const bcDashed = `color-mix(in srgb, ${bc} 36%, var(--border))`;

    function expand() {
        if (isGuest) return;
        setExpanded(true);
        setTimeout(() => titleRef.current?.focus(), 40);
    }

    function handleCancel() {
        setExpanded(false);
        reset();
        setJustDone(false);
        setSubmitting(false);
    }

    async function handleSubmit() {
        if (!title.trim() || submitting) return;
        setSubmitting(true);
        const ok = await submit();
        if (!ok) { setSubmitting(false); return; }
        setJustDone(true);
        setTimeout(() => {
            setJustDone(false);
            reset();
            setExpanded(false);
            setSubmitting(false);
        }, 1400);
    }

    const canSubmit = title.trim() !== "";
    const titleMb = expanded ? dv(d, 10, 12, 13) : 0;

    return (
        <div
            className="create-post-card"
            style={{
                '--card-mt': dv(d, 20, 24, 28),
                '--card-mb': dv(d, 16, 20, 24),
                '--card-accent': bc,
                '--card-bg': 'var(--bg-surface)',
                '--card-bd': bcDashed,
                '--card-shadow-idle': '-2px 4px 10px rgba(0,0,0,.05)',
                '--card-shadow-focus': `0 4px 22px color-mix(in srgb, ${bc} 12%, transparent), -2px 6px 14px rgba(0,0,0,.06)`,
                '--card-pad': dv(d, '11px 13px', '13px 17px', '15px 21px'),
                '--card-header-mb': dv(d, 8, 10, 11),
                '--card-title-fs': dv(d, 15, 17, 19),
                '--card-title-pad': `${dv(d, 4, 5, 6)}px 0`,
                '--card-title-bd': `1px solid color-mix(in srgb, ${bc} 22%, var(--border))`,
                '--card-title-mb': titleMb,
                '--card-body-fs': dv(d, 12, 13, 13),
                '--card-body-pad': `${dv(d, 4, 5, 6)}px 0`,
                '--card-body-mb': dv(d, 12, 14, 16),
                '--card-body-minh': dv(d, 52, 62, 70),
                '--card-submit-fs': dv(d, 11, 12, 13),
                '--card-submit-pad': dv(d, '5px 14px', '6px 16px', '7px 18px'),
                '--card-cursor': expanded ? 'default' : isGuest ? 'default' : 'text',
            } as React.CSSProperties}
        >
            <DraftMarker color={bc} />

            <div
                className="create-post-card-inner"
                onClick={() => { if (!expanded) expand(); }}
                data-expanded={expanded ? "" : undefined}
            >
                <div className="create-card-header">
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="create-card-pencil">
                        <path d="M9.8 1.4l2.8 2.8L3.8 13H1v-2.8L9.8 1.4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
                        <path d="M8.4 2.8l2.8 2.8" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    <span className="create-card-header-label">New Nibble</span>
                    {expanded && (
                        <button className="create-card-cancel" onClick={handleCancel}>cancel</button>
                    )}
                </div>

                <input
                    ref={titleRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    placeholder={isGuest ? "Log in to post a nibble…" : "What are we nibbling on today?"}
                    disabled={isGuest}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onFocus={() => { if (!expanded) expand(); }}
                    className="create-card-title-input"
                    data-expanded={expanded ? "" : undefined}
                />

                {expanded && (
                    <>
                        <textarea
                            placeholder="More context? (optional)"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onInput={autoResize}
                            className="create-card-body-input"
                        />

                        <TagSelector board={topicName} bc={bc} selected={tags} onChange={setTags} />

                        <div className="create-card-actions">
                            <button
                                className="create-card-submit"
                                disabled={!canSubmit || submitting || justDone}
                                onClick={handleSubmit}
                                style={{
                                    opacity: (!canSubmit || submitting) ? 0.55 : 1,
                                }}
                            >
                                {submitting ? (
                                    <span className="btn-loading"><span className="spin-dot" />Nibbling…</span>
                                ) : justDone ? (
                                    "✓ Nibble dropped!"
                                ) : (
                                    "Drop Nibble"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ErrorMessage error={error} />
        </div>
    );
}
