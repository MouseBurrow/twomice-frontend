import { useEffect, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { ReplyData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import VoteButtons from "../shared/VoteButtons";
import AnonBadge from "../shared/AnonBadge";
import GreenText from "../shared/GreenText";
import ReplyList, { DOT_S, DOT_T, REM } from "./ReplyList";
import { formatDate } from "../../utils/date";
import { hashColor } from "../../utils/hash";
import { autoResize } from "../../utils/autoResize";
import "../../assets/components.scss";

const MAX_DEPTH = 5;

type Props = {
    reply: ReplyData;
    topic: string;
    post: string;
    commentHash: string;
    bc?: string;
    connectorColor?: string;
    depth?: number;
    isFirst?: boolean;
    hasMoreSiblings?: boolean;
    onUpdated: () => void;
};

export default function ReplyRow({ reply, topic, post, commentHash, bc, connectorColor, depth = 0, isFirst = false, hasMoreSiblings = false, onUpdated }: Props) {
    const [nested, setNested] = useState<ReplyData[]>(reply.children ?? []);
    const [nestedLoading, setNestedLoading] = useState(false);
    const [nestedOffset, setNestedOffset] = useState(reply.children?.length ?? 0);
    const [nestedTotal, setNestedTotal] = useState(reply.children?.length ?? 0);
    const NESTED_LIMIT = 10;
    const nestedHasMore = nestedOffset + NESTED_LIMIT < nestedTotal;
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyBusy, setReplyBusy] = useState(false);
    const [replyError, setReplyError] = useState<ApiError>();
    const [showNested, setShowNested] = useState(
        (reply.children?.length ?? 0) > 0 && (reply.children?.length ?? 0) <= 3
    );

    const hasNested = nested.length > 0;

    useEffect(() => {
        const len = reply.children?.length ?? 0;
        setNested(reply.children ?? []);
        setNestedOffset(len);
        setNestedTotal(len);
    }, [reply.children]);

    async function loadNested() {
        if (depth >= MAX_DEPTH) return;
        setNestedLoading(true);
        try {
            const res = await api.getReplies(topic, post, reply.hash, NESTED_LIMIT, 0);
            setNested(res.data);
            setNestedOffset(0);
            setNestedTotal(res.total);
        } catch { /* ignore */ } finally {
            setNestedLoading(false);
        }
    }

    async function loadMoreNested() {
        if (depth >= MAX_DEPTH) return;
        try {
            const nextOffset = nestedOffset + NESTED_LIMIT;
            const res = await api.getReplies(topic, post, reply.hash, NESTED_LIMIT, nextOffset);
            const existing = new Set(nested.map(r => r.hash));
            const fresh = res.data.filter(r => !existing.has(r.hash));
            if (fresh.length > 0) {
                setNested(prev => [...prev, ...fresh]);
                setNestedOffset(nextOffset);
            } else {
                setNestedOffset(nestedTotal);
            }
        } catch { /* ignore */ }
    }

    async function submitReply() {
        if (!replyContent.trim() || replyBusy) return;
        setReplyBusy(true);
        setReplyError(undefined);
        try {
            await api.createReply(topic, post, commentHash, { content: replyContent, reply_hash: reply.hash });
            setReplyContent("");
            setReplyOpen(false);
            setNested([]);
            setNestedOffset(0);
            await loadNested();
            onUpdated();
        } catch (e) {
            setReplyError(e as ApiError);
        } finally {
            setReplyBusy(false);
        }
    }

    const rawColor = connectorColor;
    const lineColor = rawColor
        ? `color-mix(in srgb, ${rawColor} 38%, var(--text-faint))`
        : 'var(--text-faint)';
    const dotFill = rawColor
        ? `color-mix(in srgb, ${rawColor} 10%, var(--bg-elevated))`
        : 'var(--bg-elevated)';

    const myColor = reply.anon_token ? hashColor(reply.anon_token).dot : undefined;

    return (
        <div className="rl-item">
            {isFirst && (
                <div className="rl-line rl-line--top"
                    style={{ borderLeftColor: lineColor }}
                />
            )}
            <div className="rl-dot"
                style={{ top: REM(DOT_T), width: REM(DOT_S), height: REM(DOT_S), background: dotFill, border: `0.125rem solid ${lineColor}` }}
            />
            {hasMoreSiblings && (
                <div className="rl-line rl-line--mid"
                    style={{ borderLeftColor: lineColor }}
                />
            )}
            <div className="rl-connector"
                style={{ borderColor: lineColor }}
            />
            <div className="reply-row">
                <div className="reply-card">
                    <div className="comment-header">
                        {reply.anon_token && !reply.deleted && <AnonBadge token={reply.anon_token} sm />}
                        <span className="reply-card-inline-meta">{formatDate(reply.created_at)}</span>
                        <div className="comment-header-end">
                            {hasNested && (
                                <button className="comment-collapse" onClick={() => setShowNested(!showNested)}>
                                    {showNested ? '[–]' : `[+${nested.length}]`}
                                </button>
                            )}
                        </div>
                    </div>
                    {reply.deleted ? (
                        <div className="comment-body">
                            <em>[removed]</em>
                        </div>
                    ) : (
                        <>
                            <div className="comment-body">
                                <GreenText text={reply.content} />
                            </div>
                            <div className="comment-footer">
                                <VoteButtons votes={reply.vote_count ?? 0} disabled={false} bc={bc} />
                                <button className="reply-chip" onClick={() => setReplyOpen(!replyOpen)}>
                                    ↩ squeak back
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {replyOpen && (
                    <div className="reply-form-wrap">
                        <textarea
                            className="reply-form-input"
                            placeholder="Echo back…"
                            onInput={autoResize}
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
                    <ReplyList hasMore={nestedHasMore} onLoadMore={loadMoreNested}>
                        {nested.map((nr, i) => (
                            <ReplyRow key={nr.hash} reply={nr} topic={topic} post={post} commentHash={commentHash} bc={bc}
                                connectorColor={myColor}
                                depth={depth + 1}
                                isFirst={i === 0}
                                hasMoreSiblings={i < nested.length - 1 || nestedHasMore}
                                onUpdated={onUpdated} />
                        ))}
                    </ReplyList>
                )}
            </div>
        </div>
    );
}