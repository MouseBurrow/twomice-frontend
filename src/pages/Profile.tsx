import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";
import type { NibData, UserStats } from "../types";
import NibCard from "../components/board/NibCard";
import SkeletonNibCard from "../components/skeleton/SkeletonNibCard";
import "../assets/Profile.scss";

type Tab = "nibs" | "following";

export default function Profile() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("nibs");
    const [stats, setStats] = useState<UserStats | null>(null);
    const [nibs, setNibs] = useState<NibData[]>([]);
    const [followedBoards, setFollowedBoards] = useState<string[]>([]);
    const [nibsLoading, setNibsLoading] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);

    useEffect(() => {
        if (auth.status !== "user" && auth.status !== "admin") return;
        api.getUserStats().then(setStats).catch(() => {});
    }, [auth.status]);

    useEffect(() => {
        if (auth.status !== "user" && auth.status !== "admin") return;
        if (tab === "nibs") {
            setNibsLoading(true);
            api.getUserNibs()
                .then(data => { setNibs(data.filter(n => !n.deleted)); setNibsLoading(false); })
                .catch(() => setNibsLoading(false));
        } else {
            setFollowingLoading(true);
            api.getFollowedBoards()
                .then(data => { setFollowedBoards(data); setFollowingLoading(false); })
                .catch(() => setFollowingLoading(false));
        }
    }, [tab, auth.status]);

    function handleUnfollow(boardId: string) {
        api.unfollowBoard(boardId)
            .then(() => setFollowedBoards(prev => prev.filter(b => b !== boardId)))
            .catch(() => {});
    }

    if (auth.status === "unknown") return null;

    if (auth.status === "guest") {
        return (
            <div className="profile-page">
                <div className="profile-board">
                    <div className="profile-guest">
                        <span className="profile-guest-icon" aria-hidden="true">🐭</span>
                        <p>You need a burrow to see this</p>
                        <span>Sign in to view your profile, nibs, and followed boards.</span>
                        <button type="button" onClick={() => navigate("/auth")}>
                            Sign in to the mischief
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handle = localStorage.getItem("twomice_handle") ??
        `anon_${auth.info.username.slice(-4)}`;
    const initials = handle.slice(0, 2).toUpperCase();
    const isAdmin = auth.status === "admin";

    return (
        <div className="profile-page">
            <div className="profile-board">
                {/* Hero */}
                <div className="profile-hero">
                    <div className="profile-avatar-lg" aria-hidden="true">
                        {initials}
                    </div>
                    <div className="profile-hero-info">
                        <div className="profile-hero-row">
                            <p className="profile-handle">{handle}</p>
                            {isAdmin && <span className="profile-role-badge">mod</span>}
                        </div>
                        <span className="profile-since">
                            member since {new Date(auth.info.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="profile-stats">
                        <div className="profile-stat">
                            <span className="profile-stat-value">{stats.nib_count}</span>
                            <span className="profile-stat-label">Nibs</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-value">{stats.squeak_count}</span>
                            <span className="profile-stat-label">Squeaks</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-value">{stats.upvote_count}</span>
                            <span className="profile-stat-label">Upvotes</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-value">{stats.following_count}</span>
                            <span className="profile-stat-label">Following</span>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="profile-tabs">
                    {(["nibs", "following"] as Tab[]).map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`profile-tab${tab === t ? " active" : ""}`}
                            onClick={() => setTab(t)}
                        >
                            {t === "nibs" ? "My Nibs" : "Following"}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {tab === "nibs" && (
                    nibsLoading ? (
                        <div className="profile-nib-grid">
                            {Array.from({ length: 4 }, (_, i) => <SkeletonNibCard key={i} />)}
                        </div>
                    ) : nibs.length === 0 ? (
                        <div className="profile-empty">No nibs yet.</div>
                    ) : (
                        <div className="profile-nib-grid">
                            {nibs.map(n => <NibCard key={n.slug} post={n} />)}
                        </div>
                    )
                )}

                {tab === "following" && (
                    followingLoading ? (
                        <div className="profile-empty">Loading…</div>
                    ) : followedBoards.length === 0 ? (
                        <div className="profile-empty">Not following any boards yet.</div>
                    ) : (
                        <div className="profile-following-grid">
                            {followedBoards.map(boardId => (
                                <div key={boardId} className="profile-board-card">
                                    <span className="profile-board-name">b/{boardId}</span>
                                    <button
                                        className="profile-unfollow"
                                        onClick={() => handleUnfollow(boardId)}
                                    >
                                        Unfollow
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
