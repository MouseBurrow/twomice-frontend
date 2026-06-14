import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { PostData } from "../../types";
import PostCard from "../board/PostCard";
import SkeletonPostCard from "../skeleton/SkeletonPostCard";
import { FORCE_SKELETON } from "../../debug";
import { useShowLoading } from "../../utils/useShowLoading";
import SortBar from "./SortBar";

type Sort = "hot" | "new" | "top";

type Props = {
    title?: string;
    note?: string;
};

export default function PostFeed({ title, note }: Props) {
    const navigate = useNavigate();
    const [sort, setSort] = useState<Sort>("hot");
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError>();
    const [retryKey, setRetryKey] = useState(0);
    const showLoad = useShowLoading(loading);
    const showLoading = FORCE_SKELETON || showLoad;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError(undefined);
    }, [sort, retryKey]);

    useEffect(() => {
        let cancelled = false;
        api.getFeed(sort)
            .then(data => {
                if (cancelled) return;
                setPosts(data.filter(item => !item.deleted));
                setLoading(false);
            })
            .catch(e => {
                if (cancelled) return;
                setError(e as ApiError);
                setLoading(false);
            });
        return () => { cancelled = true; };
    }, [sort, retryKey]);

    return (
        <div className="post-feed">
            {title && (
                <div className="post-feed-title-row">
                    <div className="post-feed-title">{title}</div>
                    {!loading && (
                        <span className="post-feed-count">
                            {posts.length} nibble{posts.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            )}

            <SortBar sort={sort} onSort={setSort} />

            {note && (
                <div className="post-feed-note">{note}</div>
            )}

            {showLoading ? (
                <div className="post-feed-grid">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonPostCard key={i} />)}
                </div>
            ) : error ? (
                <div className="post-feed-error">
                    <div className="post-feed-error-text">Failed to load feed.</div>
                    <button className="btn-ghost" onClick={() => setRetryKey(k => k + 1)}>Retry</button>
                </div>
            ) : posts.length === 0 ? (
                <div className="post-feed-empty">
                    <div className="post-feed-empty-text">Nothing squeaking yet.</div>
                    <button className="btn-ghost" onClick={() => navigate("/")}>Browse burrows →</button>
                </div>
            ) : (
                <div className="post-feed-grid">
                    {posts.map(item => (
                        <PostCard key={`${item.board_id}-${item.slug}`} post={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
