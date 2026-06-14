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
import BoardTag from "../components/shared/BoardTag";
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
    const [boardTags, setBoardTags] = useState<string[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState<string | null>(null);

    const [reloadVersion, setReloadVersion] = useState(0);
    const showLoad = useShowLoading(loading);
    const showLoading = FORCE_SKELETON || showLoad;

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
        if (!boardData || !board) return;
        let cancelled = false;
        api.getBoardTags(board)
            .then(tags => { if (!cancelled) setBoardTags(tags); })
            .catch(() => { if (!cancelled) setBoardTags([]); });
        return () => { cancelled = true; };
    }, [board, boardData]);

    useEffect(() => {
        if (isGuest || !board) return;
        if (!boardData) return;
        let cancelled = false;
        api.getFollowedBoards()
            .then(followedBoards => {
                if (!cancelled) setFollowed(followedBoards.some(b => b.name === board));
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [board, isGuest, boardData]);

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

    const todayCount = useMemo(
        () => posts.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length,
        [posts],
    );

    const heroColor = boardData ? boardColorFromName(boardData.name) : board ? boardColorFromName(board) : 'var(--accent)';

    if (auth.status === "unknown") {
        return <div className="board-page" data-density={density}><div className="page-loading" /></div>;
    }

    if (!showLoading && error) {
        const is404 = error.status === 404;
        return (
            <div className="board-page" data-density={density}>
                <div className="board-error-card">
                    <div className="board-error-text">
                        {is404 ? "This burrow doesn't exist." : "Couldn't reach this burrow."}
                    </div>
                    <div className="board-error-actions">
                        {is404 ? (
                            <button className="btn-pill" onClick={() => navigate("/")}>← Back to the hole</button>
                        ) : (
                            <>
                                <button className="btn-pill" onClick={() => setReloadVersion(v => v + 1)}>Retry</button>
                                <button className="btn-ghost" onClick={() => navigate("/")}>← Home</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="board-page" data-density={density}>
            {!showLoading && isGuest && <GuestBanner onLogin={() => navigate("/auth")} />}

            {boardData && (
            <>
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
                                <span className="board-hero-dot" style={{ background: heroColor, boxShadow: `0 0 0 3px color-mix(in srgb,${heroColor} 18%,transparent)` }} />
                                <div className="board-hero-name" style={{ color: heroColor }}>b/{boardData.name}</div>
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
                        <div className="board-hero-desc">{boardData.description}</div>
                    )}
                    {!showLoading && boardTags.length > 0 && (
                        <div className="board-hero-tags">
                            {boardTags.map(tag => (
                                <BoardTag key={tag} tag={tag} bc={heroColor} />
                            ))}
                        </div>
                    )}
                    <div className="board-hero-stats">
                        {showLoading ? (
                            <>
                                <div className="board-hero-stat">
                                    <span className="sk-line sk-line--stat" />
                                </div>
                                <div className="board-hero-stat">
                                    <span className="sk-line sk-line--stat" />
                                </div>
                                <div className="board-hero-stat">
                                    <span className="sk-line sk-line--stat" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="board-hero-stat">
                                    <div className="board-hero-stat-value" style={{ color: heroColor }}>{todayCount}</div>
                                    <div className="board-hero-stat-label">Nibbles today</div>
                                </div>
                                <div className="board-hero-stat">
                                    <div className="board-hero-stat-value" style={{ color: heroColor }}>{boardData.post_count ?? sortedPosts.length}</div>
                                    <div className="board-hero-stat-label">Posts total</div>
                                </div>
                                <div className="board-hero-stat">
                                    <div className="board-hero-stat-value" style={{ color: heroColor }}>0</div>
                                    <div className="board-hero-stat-label">Followers</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <SortBar sort={sort} onSort={setSort} />

            <div className="board-layout">
                <div className="board-layout-main">
                    <CreatePostCard topicName={board ?? ""} bc={heroColor} onCreated={() => { setReloadVersion(v => v + 1); }} />
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
                            sortedPosts.map(post => <PostCard key={post.slug} board={boardData.name} post={post} />)
                        )}
                    </div>
                </div>
                <div className="board-sidebar hide-sidebar">
                    <Sidebar />
                </div>
            </div>
            </>
            )}
        </div>
    );
}
