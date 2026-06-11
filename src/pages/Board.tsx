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
import { boardColorFromName } from "../utils/hash";
import "../assets/Board.scss";

export default function Board() {
    const { board } = useParams<{ board: string }>();
    const navigate = useNavigate();
    const { isGuest } = useAuth();
    const { density } = useDensity();

    const [boardData, setBoardData] = useState<BoardData>();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
    const [followed, setFollowed] = useState(false);
    const [followedId, setFollowedId] = useState<string | null>(null);
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState<string | null>(null);

    const [reloadVersion, setReloadVersion] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(undefined);
        setFollowed(false);
        setFollowError(null);
    }, [board, reloadVersion]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [boardResult, boardPosts] = await Promise.all([
                    api.getBoard(board!),
                    api.getAllPosts(board!),
                ]);
                if (cancelled) return;
                setBoardData(boardResult);
                setPosts(boardPosts.filter(post => !post.deleted));
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
                if (cancelled) return;
                const match = followedBoards.find(b => b.name === board);
                setFollowed(!!match);
                setFollowedId(match?.id ?? null);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [board, isGuest]);

    async function handleFollow() {
        if (isGuest || !board) return;
        setFollowLoading(true);
        setFollowError(null);
        try {
            if (followed && followedId) {
                await api.unfollowBoard(followedId);
                setFollowed(false);
                setFollowedId(null);
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
                            <div className="board-hero" style={{ borderTop: `3px solid ${boardColorFromName(boardData.name)}` }}>
                                <div className="board-hero-glow" style={{ background: `radial-gradient(ellipse at 92% 50%, color-mix(in srgb, ${boardColorFromName(boardData.name)} 12%, transparent) 0%, transparent 65%)` }} />
                                <div className="board-hero-body">
                                    <div className="board-hero-row">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: boardColorFromName(boardData.name), display: 'inline-block', border: '2px solid rgba(0,0,0,0.12)', boxShadow: `0 1px 4px rgba(0,0,0,0.25), 0 0 0 3px color-mix(in srgb,${boardColorFromName(boardData.name)} 18%,transparent)`, flexShrink: 0 }} />
                                            <div className="board-hero-name" style={{ color: boardColorFromName(boardData.name) }}>b/{boardData.name}</div>
                                        </div>
                                        {!isGuest && (
                                            <button
                                                onClick={handleFollow}
                                                disabled={followLoading}
                                                className={followed ? "btn-ghost" : "btn-pill"}
                                                style={{ fontSize: "0.75rem", padding: "0.375rem 0.875rem", flexShrink: 0, marginTop: "0.125rem", ...(followed ? {} : { background: boardColorFromName(boardData.name) }) }}
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
                                            <div className="board-hero-stat-value" style={{ color: boardColorFromName(boardData.name) }}>{sortedPosts.length}</div>
                                            <div className="board-hero-stat-label">Nibbles today</div>
                                        </div>
                                        {sortedPosts.length > 0 && (
                                            <div className="board-hero-stat">
                                                <div className="board-hero-stat-value" style={{ color: boardColorFromName(boardData.name) }}>{(sortedPosts.length * 210 + 841).toLocaleString()}</div>
                                                <div className="board-hero-stat-label">Tunnels</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <SortBar sort={sort} onSort={setSort} />

                            <div className="board-layout">
                                <div>
                                    <CreatePostCard topicName={boardData.name} onCreated={async () => { setReloadVersion(v => v + 1); }} />
                                    <div className="board-posts">
                                        {sortedPosts.map(post => <PostCard key={post.slug} board={boardData.name} post={post} />)}
                                        {sortedPosts.length === 0 && (
                                            <div className="board-posts-empty">No posts yet on this board.</div>
                                        )}
                                    </div>
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
