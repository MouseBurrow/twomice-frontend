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
        ? "Enter the burrow and follow boards to fill your feed."
        : !hasFollowed
            ? "You're not following any boards yet — visit a board and hit Follow."
            : undefined;

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
