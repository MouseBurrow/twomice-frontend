import { useEffect, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { PostData } from "../../types";
import PostCard from "../board/PostCard";
import SkeletonPostCard from "../skeleton/SkeletonPostCard";
import SortBar from "./SortBar";

type Sort = "hot" | "new" | "top";

export default function PostFeed() {
    const [sort, setSort] = useState<Sort>("hot");
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError>();
    const [prevSort, setPrevSort] = useState(sort);
    if (prevSort !== sort) {
        setPrevSort(sort);
        setLoading(true);
        setError(undefined);
    }

    useEffect(() => {
        let cancelled = false;
        api.getFeed(sort)
            .then(data => {
                if (cancelled) return;
                setPosts(data.filter(n => !n.deleted));
                setLoading(false);
            })
            .catch(e => {
                if (cancelled) return;
                setError(e as ApiError);
                setLoading(false);
            });
        return () => { cancelled = true; };
    }, [sort]);

    return (
        <div className="post-feed">
            <SortBar sort={sort} onSort={setSort} />
            {loading ? (
                <div className="post-feed-grid">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonPostCard key={i} />)}
                </div>
            ) : error ? (
                <p className="post-feed-error">Failed to load feed.</p>
            ) : posts.length === 0 ? (
                <p className="post-feed-empty">Nothing here yet.</p>
            ) : (
                <div className="post-feed-grid">
                    {posts.map(n => (
                        <PostCard key={`${n.board_id}-${n.slug}`} post={n} />
                    ))}
                </div>
            )}
        </div>
    );
}
