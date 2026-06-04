import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import { api } from "../api";
import type { PostData, UserStats, FollowedBoardInfo } from "../types";
import PostCard from "../components/board/PostCard";
import SkeletonPostCard from "../components/skeleton/SkeletonPostCard";
import "../assets/Profile.scss";

type Tab = "posts" | "following";

export default function Profile() {
    const { auth } = useAuth();
    const { density } = useDensity();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("posts");
    const [stats, setStats] = useState<UserStats | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [followedBoards, setFollowedBoards] = useState<FollowedBoardInfo[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);
    const [unfollowingIds, setUnfollowingIds] = useState<Set<string>>(new Set());

    const [prevTab, setPrevTab] = useState(tab);
    if (prevTab !== tab) {
        setPrevTab(tab);
        if (tab === "posts") {
            setPostsLoading(true);
        } else {
            setFollowingLoading(true);
        }
    }

    useEffect(() => {
        if (auth.status !== "user" && auth.status !== "admin") return;
        let cancelled = false;
        api.getUserStats().then(data => { if (!cancelled) setStats(data); }).catch(() => {});
        return () => { cancelled = true; };
    }, [auth.status]);

    useEffect(() => {
        if (auth.status !== "user" && auth.status !== "admin") return;
        let cancelled = false;
        if (tab === "posts") {
            api.getUserPosts()
                .then(data => { if (!cancelled) { setPosts(data.filter(n => !n.deleted)); setPostsLoading(false); } })
                .catch(() => { if (!cancelled) setPostsLoading(false); });
        } else {
            api.getFollowedBoards()
                .then(data => { if (!cancelled) { setFollowedBoards(data); setFollowingLoading(false); } })
                .catch(() => { if (!cancelled) setFollowingLoading(false); });
        }
        return () => { cancelled = true; };
    }, [tab, auth.status]);

    if (auth.status === "unknown") return null;

    if (auth.status === "guest") {
        return (
            <div className="profile-page">
                <div className="profile-guest">
                    <span className="profile-guest-icon" aria-hidden="true">🐭</span>
                    <p>You need a burrow to see this</p>
                    <span>Sign in to view your profile, posts, and followed boards.</span>
                    <button type="button" onClick={() => navigate("/auth")}>Sign in to the mischief</button>
                </div>
            </div>
        );
    }

    const handle = localStorage.getItem("twomice_handle") ?? `anon_${auth.info.username.slice(-4)}`;
    const initials = handle.slice(0, 2).toUpperCase();
    const isAdmin = auth.status === "admin";
    const roleLabel = isAdmin ? "Admin" : "Member";
    const roleColor = isAdmin ? "#e67e22" : "var(--accent2)";

    function handleUnfollow(boardId: string) {
        setUnfollowingIds(prev => new Set(prev).add(boardId));
        api.unfollowBoard(boardId)
            .then(() => setFollowedBoards(prev => prev.filter(b => b.id !== boardId)))
            .catch(() => {})
            .finally(() => setUnfollowingIds(prev => {
                const next = new Set(prev);
                next.delete(boardId);
                return next;
            }));
    }

    const statItems = [
        { label: "Posts", val: stats?.nib_count ?? 0 },
        { label: "Comments", val: stats?.squeak_count ?? 0 },
        { label: "Upvotes", val: stats?.upvote_count ?? 0 },
        { label: "Following", val: stats?.following_count ?? followedBoards.length },
    ];

    return (
        <div className="profile-page" data-density={density}>
            <div className="profile-hero">
                <div className="profile-hero-stripe" />
                <div className="profile-hero-glow" />
                <div className="profile-hero-body">
                    <div className="profile-hero-top">
                        <div className="profile-avatar">
                            <span className="profile-avatar-text">{initials}</span>
                        </div>
                        <div>
                            <div className="profile-handle">{handle}</div>
                            <div className="profile-role-row">
                                <span className="profile-role-badge" style={{ borderColor: roleColor, color: roleColor }}>{roleLabel}</span>
                                <span className="profile-anon-note">all posts appear anonymous to others</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-member-since" style={{ display: "block" }}>
                        member since {new Date(auth.info.created_at).toLocaleDateString()}
                    </div>
                    {stats && (
                        <div className="profile-stats">
                            {statItems.map(({ label, val }) => (
                                <div key={label} className="profile-stat">
                                    <div className="profile-stat-value">{val}</div>
                                    <div className="profile-stat-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-tabs">
                <button className={`profile-tab${tab === "posts" ? " active" : ""}`} onClick={() => setTab("posts")}>Posts</button>
                <button className={`profile-tab${tab === "following" ? " active" : ""}`} onClick={() => setTab("following")}>
                    Following ({followedBoards.length || (stats?.following_count ?? 0)})
                </button>
            </div>

            {tab === "posts" && (
                <div>
                    <div className="profile-posts-note">Your recent posts. Others only see your anonymous ID — never your username.</div>
                    {postsLoading ? (
                        <div className="profile-posts-list">
                            {Array.from({ length: 4 }, (_, i) => <SkeletonPostCard key={i} />)}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="profile-empty">No posts yet.</div>
                    ) : (
                        <div className="profile-posts-list">
                            {posts.map(n => <PostCard key={`${n.board_id ?? ''}-${n.slug}`} post={n} />)}
                        </div>
                    )}
                </div>
            )}

            {tab === "following" && (
                <div>
                    {followingLoading ? (
                        <div className="profile-empty">Loading…</div>
                    ) : followedBoards.length === 0 ? (
                        <div className="profile-empty">Not following any boards yet.</div>
                    ) : (
                        <div className="profile-following-grid">
                            {followedBoards.map(b => (
                                <div key={b.id} className="profile-board-card" onClick={() => navigate(`/b/${b.name}`)}>
                                    <div className="profile-board-card-name">b/{b.name}</div>
                                    <div className="profile-board-card-desc">{b.description}</div>
                                    <div className="profile-board-card-count">{b.post_count.toLocaleString()} posts</div>
                                    <button className="btn-ghost" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.625rem", marginTop: "0.5rem" }}
                                        disabled={unfollowingIds.has(b.id)}
                                        onClick={e => { e.stopPropagation(); handleUnfollow(b.id); }}>{unfollowingIds.has(b.id) ? "…" : "Unfollow"}</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
