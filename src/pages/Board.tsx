import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import type { PostData, BoardData } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import PostCard from "../components/board/PostCard";
import CreatePostCard from "../components/board/CreatePostCard";
import SkeletonPostCard from "../components/skeleton/SkeletonPostCard";
import Sidebar from "../components/board/Sidebar";
import GuestBanner from "../components/shared/GuestBanner";
import SortBar from "../components/home/SortBar";
import { boardColorFromName } from "../utils/hash";
import { useShowLoading } from "../utils/useShowLoading";
import { FORCE_SKELETON } from "../debug";
import "../assets/Board.scss";

export default function Board() {
    const { board } = useParams<{ board: string }>();
    const navigate = useNavigate();
    const { auth, isGuest } = useAuth();
    const { density } = useDensity();

    const [boardData, setBoardData] = useState<BoardData>();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState<string | null>(null);

    const [reloadVersion, setReloadVersion] = useState(0);
    const showLoading = FORCE_SKELETON || useShowLoading(loading);

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

    const heroColor = boardData ? boardColorFromName(boardData.name) : board ? boardColorFromName(board) : 'var(--accent)';

    if (auth.status === "unknown") {
        return <div className="board-page" data-density={density}><div className="page-loading" /></div>;
    }

    return (
        <div className="board-page" data-density={density}>
            {!showLoading && isGuest && <GuestBanner onLogin={() => navigate("/auth")} />}

            {/* ── Hero ── */}
            <div className="board-hero" style={{ borderTop: `3px solid ${heroColor}` }}>
                <div className="board-hero-body">
                    <div className="board-hero-row">
                        {showLoading ? (
                            <div className="board-hero-skeleton-row">
                                <div className="sk-dot" />
                                <div className="sk-name" />
                            </div>
                        ) : (
                            <div className="board-hero-row-left">
                                <span className="board-hero-dot" style={{ background: boardColorFromName(boardData!.name), boxShadow: `0 0 0 3px color-mix(in srgb,${boardColorFromName(boardData!.name)} 18%,transparent)` }} />
                                <div className="board-hero-name" style={{ color: boardColorFromName(boardData!.name) }}>b/{boardData!.name}</div>
                            </div>
                        )}
                        {!isGuest && (
                            <button
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`board-hero-follow-btn ${followed ? "btn-ghost" : "btn-pill"}`}
                                style={followed ? {} : { background: heroColor }}
                            >
                                {followLoading ? "…" : followed ? "✓ Following" : "+ Follow"}
                            </button>
                        )}
                    </div>
                    {!showLoading && followError && (
                        <div className="board-hero-follow-error">{followError}</div>
                    )}
                    {showLoading ? (
                        <div className="board-hero-desc">
                            <span className="sk-line sk-line--wide" />
                        </div>
                    ) : (
                        <div className="board-hero-desc">{boardData!.description}</div>
                    )}
                    <div className="board-hero-stats">
                        {showLoading ? (
                            <>
                                <div className="board-hero-stat">
                                    <span className="sk-line sk-line--stat" />
                                </div>
                                <div className="board-hero-stat">
                                    <span className="sk-line sk-line--stat-lg" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="board-hero-stat">
                                    <div className="board-hero-stat-value" style={{ color: boardColorFromName(boardData!.name) }}>{sortedPosts.length}</div>
                                    <div className="board-hero-stat-label">Nibbles today</div>
                                </div>
                                {sortedPosts.length > 0 && (
                                    <div className="board-hero-stat">
                                        <div className="board-hero-stat-value" style={{ color: boardColorFromName(boardData!.name) }}>{(sortedPosts.length * 210 + 841).toLocaleString()}</div>
                                        <div className="board-hero-stat-label">Tunnels</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <SortBar sort={sort} onSort={setSort} />

            <div className="board-layout">
                <div className="board-layout-main">
                    <CreatePostCard topicName={board ?? ""} onCreated={async () => { setReloadVersion(v => v + 1); }} />
                    <div className="board-posts">
                        {showLoading ? (
                            Array.from({ length: 5 }, (_, i) => <SkeletonPostCard key={i} />)
                        ) : sortedPosts.length === 0 ? (
                            <div className="board-posts-empty">
                                <span className="board-empty-icon">🐭</span>
                                No nibbles here yet.
                                <div className="board-empty-action">Post the first one above ↑</div>
                            </div>
                        ) : (
                            sortedPosts.map(post => <PostCard key={post.slug} board={boardData!.name} post={post} />)
                        )}
                    </div>
                </div>
                <div className="board-sidebar hide-sidebar">
                    <Sidebar />
                </div>
            </div>

            {!showLoading && error && (
                <div className="board-error-card">
                    <span className="board-error-icon">⚠</span>
                    <div className="board-error-text">Couldn't reach this burrow.</div>
                    <div className="board-error-actions">
                        <button className="btn-pill" onClick={() => setReloadVersion(v => v + 1)}>Retry</button>
                        <button className="btn-ghost" onClick={() => navigate("/")}>← Home</button>
                    </div>
                </div>
            )}
        </div>
    );
}
