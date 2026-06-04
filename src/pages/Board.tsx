import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import type { PostData, BoardData } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import PostCard from "../components/board/PostCard";
import CreatePostCard from "../components/board/CreatePostCard";
import SkeletonBoardHeader from "../components/skeleton/SkeletonBoardHeader";
import SkeletonPostCard from "../components/skeleton/SkeletonPostCard";
import Sidebar from "../components/board/Sidebar";
import GuestBanner from "../components/shared/GuestBanner";
import SortBar from "../components/home/SortBar";
import "../assets/Board.scss";

export default function Board() {
    const { board } = useParams<{ board: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { density } = useDensity();

    const [boardData, setBoardData] = useState<BoardData>();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState<string | null>(null);

    const isGuest = auth.status === "guest" || auth.status === "unknown";

    const [reloadVersion, setReloadVersion] = useState(0);

    const prevKey = `${board}/${reloadVersion}`;
    const [prevKeySt, setPrevKeySt] = useState(prevKey);
    if (prevKeySt !== prevKey) {
        setPrevKeySt(prevKey);
        setLoading(true);
        setError(undefined);
        setFollowed(false);
        setFollowError(null);
    }

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [b, p] = await Promise.all([
                    api.getBoard(board!),
                    api.getAllPosts(board!),
                ]);
                if (cancelled) return;
                setBoardData(b);
                setPosts(p.filter(post => !post.deleted));
                setLoading(false);
            } catch (e) {
                if (cancelled) return;
                setError(e as ApiError);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [board, reloadVersion]);

    useEffect(() => {
        if (isGuest || !board) return;
        let cancelled = false;
        api.getFollowedBoards()
            .then(followedBoards => {
                if (!cancelled) setFollowed(followedBoards.some(b => b.name === board));
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [board, isGuest]);

    async function handleFollow() {
        if (isGuest || !board) return;
        setFollowLoading(true);
        setFollowError(null);
        try {
            if (followed) {
                await api.unfollowBoard(board);
                setFollowed(false);
            } else {
                await api.followBoard(board);
                setFollowed(true);
            }
        } catch {
            setFollowError("Failed to update follow status");
        } finally {
            setFollowLoading(false);
        }
    }

    const sortedPosts = useMemo(() => [...posts].sort((a, b) => {
        if (sort === "hot") return (b.is_hot ? 1 : 0) - (a.is_hot ? 1 : 0) || (b.vote_count ?? 0) - (a.vote_count ?? 0);
        if (sort === "top") return (b.vote_count ?? 0) - (a.vote_count ?? 0);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }), [posts, sort]);

    return (
        <div className="board-page" data-density={density}>
            {isGuest && <GuestBanner onLogin={() => navigate("/auth")} />}

            {loading ? (
                <>
                    <SkeletonBoardHeader />
                    <div className="board-posts">
                        {Array.from({ length: 5 }, (_, i) => <SkeletonPostCard key={i} />)}
                    </div>
                </>
            ) : (
                <>
                    {boardData && (
                        <>
                            <div className="board-hero">
                                <div className="board-hero-glow" />
                                <div className="board-hero-body">
                                    <div className="board-hero-row">
                                        <div className="board-hero-name">b/{boardData.name}</div>
                                        {!isGuest && (
                                            <button
                                                onClick={handleFollow}
                                                disabled={followLoading}
                                                className={followed ? "btn-ghost" : "btn-pill"}
                                                style={{ fontSize: "0.75rem", padding: "0.375rem 0.875rem", flexShrink: 0, marginTop: "0.125rem" }}
                                            >
                                                {followLoading ? "…" : followed ? "✓ Following" : "+ Follow"}
                                            </button>
                                        )}
                                    </div>
                                    {followError && (
                                        <div style={{ fontSize: "0.6875rem", color: "var(--danger)", marginBottom: "0.5rem" }}>{followError}</div>
                                    )}
                                    <div className="board-hero-desc">{boardData.description}</div>
                                    <div className="board-hero-stats">
                                        <div className="board-hero-stat">
                                            <div className="board-hero-stat-value">{sortedPosts.length}</div>
                                            <div className="board-hero-stat-label">Posts</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <SortBar sort={sort} onSort={setSort} />

                            <div className="board-layout">
                                <div className="board-posts">
                                    <CreatePostCard topicName={boardData.name} onCreated={async () => { setReloadVersion(v => v + 1); }} />
                                    {sortedPosts.map(post => <PostCard key={post.slug} board={boardData.name} post={post} />)}
                                    {sortedPosts.length === 0 && (
                                        <div className="board-posts-empty">No posts yet on this board.</div>
                                    )}
                                </div>
                                <div className="board-sidebar hide-sidebar">
                                    <Sidebar />
                                </div>
                            </div>
                        </>
                    )}
                    {error && <div className="board-error">Failed to load board.</div>}
                </>
            )}
        </div>
    );
}
