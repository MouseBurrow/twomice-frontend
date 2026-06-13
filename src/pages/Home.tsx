import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import { api } from "../api";
import type { FollowedBoardInfo } from "../types";
import PostFeed from "../components/home/PostFeed";
import HomeSidebar from "../components/home/HomeSidebar";
import GuestBanner from "../components/shared/GuestBanner";
import "../assets/Home.scss";

export default function Home() {
    const { auth, isGuest } = useAuth();
    const { density } = useDensity();
    const navigate = useNavigate();
    const [followed, setFollowed] = useState<FollowedBoardInfo[]>([]);

    useEffect(() => {
        if (isGuest) return;
        let cancelled = false;
        api.getFollowedBoards()
            .then(data => { if (!cancelled) setFollowed(data); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [isGuest]);

    const hasFollowed = !isGuest && followed.length > 0;

    const feedTitle = hasFollowed ? "Your Feed" : "Trending everywhere";
    const feedNote = isGuest
        ? "Hop in, follow some burrows, and this hole fills up with squeaks."
        : !hasFollowed
            ? "Nothing's squeaking yet. Go follow some burrows."
            : undefined;

    if (auth.status === "unknown") {
        return <div className="home-page" data-density={density}><div className="page-loading" /></div>;
    }

    return (
        <div className="home-page" data-density={density}>
            <div className="home-layout">
                <main className="home-main">
                    {isGuest && <GuestBanner onLogin={() => navigate("/auth")} />}
                    <PostFeed title={feedTitle} note={feedNote} />
                </main>
                <aside className="home-sidebar hide-sidebar">
                    <HomeSidebar followed={hasFollowed ? followed : undefined} navigate={navigate} />
                </aside>
            </div>
        </div>
    );
}
