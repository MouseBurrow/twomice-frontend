import { useEffect, useRef, useState } from "react";
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
import { useOffsetPagination } from "../../hooks/useOffsetPagination";
import "../../assets/components.scss";

const MAX_DEPTH = 5;
const NESTED_LIMIT = 10;

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
};

export default function ReplyRow({ reply, topic, post, commentHash, bc, connectorColor, depth = 0, isFirst = false, hasMoreSiblings = false }: Props) {
    const nestedPagination = useOffsetPagination<ReplyData>(NESTED_LIMIT);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyBusy, setReplyBusy] = useState(false);
    const [replyError, setReplyError] = useState<ApiError>();
    const [showNested, setShowNested] = useState(
        (reply.children?.length ?? 0) > 0 && (reply.children?.length ?? 0) <= 3
    );
    const manuallyCollapsed = useRef(false);

    const hasNested = nestedPagination.items.length > 0;

    useEffect(() => {
        const children = reply.children ?? [];
        const len = children.length;
        nestedPagination.replace(children, len, len);
    }, [reply.children]);

    async function loadMoreNested() {
        if (depth >= MAX_DEPTH) return;
        await nestedPagination.loadMore(
            nextOffset => api.getReplies(topic, post, reply.hash, NESTED_LIMIT, nextOffset)
        );
    }

    async function submitReply() {
        if (!replyContent.trim() || replyBusy) return;
        setReplyBusy(true);
        setReplyError(undefined);
        try {
            const optimistic: ReplyData = {
                hash: 'opt_' + Date.now(),
                content: replyContent,
                created_at: new Date().toISOString(),
                deleted: false,
                is_mine: true,
                children: [],
            };
            nestedPagination.setItems(prev => [...prev, optimistic]);
            setShowNested(true);
            await api.createReply(topic, post, commentHash, { content: replyContent, reply_hash: reply.hash });
            setReplyContent("");
            setReplyOpen(false);
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

    const myColor = reply.anon_token ? hashColor(reply.anon_token.slice(0, 6)).dot : undefined;

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
                        {reply.anon_token && !reply.deleted && <AnonBadge token={reply.anon_token} isMe={!!reply.is_mine} sm />}
                        <span className="reply-card-inline-meta">{formatDate(reply.created_at)}</span>
                        <div className="comment-header-end">
                            {hasNested && (
                                <button className="comment-collapse" onClick={() => { setShowNested(!showNested); manuallyCollapsed.current = !showNested; }}>
                                    {showNested ? '[–]' : `[+${nestedPagination.items.length}]`}
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

                {nestedPagination.loading && <p className="comment-loading">Loading…</p>}

                {showNested && nestedPagination.items.length > 0 && (
                    <ReplyList hasMore={nestedPagination.hasMore} onLoadMore={loadMoreNested}>
                        {nestedPagination.items.map((nr, i) => (
                            <ReplyRow key={nr.hash} reply={nr} topic={topic} post={post} commentHash={commentHash} bc={bc}
                                connectorColor={myColor}
                                depth={depth + 1}
                                isFirst={i === 0}
                                hasMoreSiblings={i < nestedPagination.items.length - 1 || nestedPagination.hasMore} />
                        ))}
                    </ReplyList>
                )}
            </div>
        </div>
    );
}
