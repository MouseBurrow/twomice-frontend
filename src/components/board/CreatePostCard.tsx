import { useMemo, useRef, useState } from "react";
import { useCreateNibble } from "../../hooks/useCreateNibble";
import { useAuth } from "../../contexts/AuthContext";
import { autoResize } from "../../utils/autoResize";
import { useDensity } from "../../contexts/DensityContext";
import { dv } from "../../utils/density";
import Pencil from "../../icons/Pencil";
import DraftMarker from "./DraftMarker";
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

    const cardStyle = useMemo(() => ({
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
    } as React.CSSProperties), [d, bc, bcDashed, expanded, isGuest, titleMb]);

    return (
        <div
            className="create-post-card"
            style={cardStyle}
        >
            <DraftMarker color={bc} />

            <div
                className="create-post-card-inner"
                onClick={() => { if (!expanded) expand(); }}
                data-expanded={expanded ? "" : undefined}
            >
                <div className="create-card-header">
                    <Pencil className="create-card-pencil" />
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
