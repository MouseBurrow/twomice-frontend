import { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import { formatDate } from "../../utils/date";
import { hashColor } from "../../utils/hash";
import "../../assets/components.scss";

type Props = {
    reply: ReplyData;
    topic: string;
    post: string;
    commentHash: string;
    bc?: string;
    parentColor?: string;
    onUpdated: () => void;
};

export default function ReplyRow({ reply, topic, post, commentHash, bc, parentColor, onUpdated }: Props) {
    const mountRef = useRef(true);
    const [nested, setNested] = useState<ReplyData[]>([]);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedLoading, setNestedLoading] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyBusy, setReplyBusy] = useState(false);
    const [replyError, setReplyError] = useState<ApiError>();
    const [showNested, setShowNested] = useState(false);

    useEffect(() => {
        return () => { mountRef.current = false; };
    }, []);

    async function loadNested() {
        setNestedLoading(true);
        try {
            const data = await api.getReplies(topic, post, reply.hash);
            if (!mountRef.current) return;
            setNested(data.filter(r => !r.deleted));
            setNestedOpen(true);
        } catch { /* ignore */ } finally {
            if (mountRef.current) setNestedLoading(false);
        }
    }

    async function submitReply() {
        if (!replyContent.trim() || replyBusy) return;
        setReplyBusy(true);
        setReplyError(undefined);
        try {
            await api.createReply(topic, post, commentHash, { content: replyContent, reply_hash: reply.hash });
            setReplyContent("");
            setReplyOpen(false);
            await loadNested();
            onUpdated();
        } catch (e) {
            setReplyError(e as ApiError);
        } finally {
            setReplyBusy(false);
        }
    }

    const threadColor = parentColor || (reply.anon_token
        ? hashColor(reply.anon_token).dot
        : undefined);
    const lineColor = threadColor
        ? `color-mix(in srgb, ${threadColor} 38%, var(--text-faint))`
        : 'var(--text-faint)';
    const circFill = threadColor
        ? `color-mix(in srgb, ${threadColor} 10%, var(--bg-elevated))`
        : 'var(--bg-elevated)';
    const circSize = 9;
    const circR = circSize / 2;
    const circCenter = 22;
    const circTop = Math.round(circCenter - circR);
    const circBottom = circTop + circSize;
    const lineX = Math.round(circR) + 2;

    return (
        <div className="reply-row" style={{ paddingLeft: circSize + 12 }}>
            <div className="thread-dot"
                style={{ left: lineX, top: circTop, width: circSize, height: circSize, background: circFill, border: `2px solid ${lineColor}` }}
            />
            <div className="thread-connector"
                style={{ left: lineX + 4, top: circCenter, width: 16, '--connector-clr': lineColor } as React.CSSProperties}
            />
            <div className="reply-card-inline">
                <div className="comment-header">
                    {reply.anon_token && <AnonBadge token={reply.anon_token} sm />}
                    <span className="reply-card-inline-meta">{formatDate(reply.created_at)}</span>
                    <div className="comment-header-end">
                        {nested.length > 0 && (
                            <button className="comment-collapse" onClick={() => setShowNested(!showNested)}>
                                {showNested ? '[–]' : `[+${nested.length}]`}
                            </button>
                        )}
                    </div>
                </div>
                <div className="comment-body">
                    <GreenText text={reply.content} />
                </div>
                <div className="comment-footer">
                    <VoteButtons votes={reply.vote_count ?? 0} disabled={false} bc={bc} />
                    <button className="reply-chip" onClick={() => setReplyOpen(!replyOpen)}>
                        ↩ squeak back
                    </button>
                </div>

                {replyOpen && (
                    <div className="reply-form-wrap">
                        <textarea
                            className="reply-form-input"
                            placeholder="Echo back…"
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                        />
                        <div className="reply-form-actions">
                            <button
                                className="reply-form-submit"
                                disabled={!replyContent.trim() || replyBusy}
                                onClick={submitReply}
                            >
                                {replyBusy ? "…" : "Echo"}
                            </button>
                            <button
                                className="reply-form-cancel"
                                onClick={() => { setReplyOpen(false); setReplyError(undefined); }}
                            >
                                Cancel
                            </button>
                        </div>
                        <ErrorMessage error={replyError} />
                    </div>
                )}

                {nestedLoading && <p className="comment-loading">Loading…</p>}

                {showNested && nested.length > 0 && (
                    <div className="reply-nested">
                        {nested.map(nr => (
                            <ReplyRow key={nr.hash} reply={nr} topic={topic} post={post} commentHash={commentHash} bc={bc} parentColor={parentColor} onUpdated={onUpdated} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}