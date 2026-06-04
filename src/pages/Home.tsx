import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PostFeed from "../components/home/PostFeed";
import HomeSidebar from "../components/home/HomeSidebar";
import GuestBanner from "../components/shared/GuestBanner";
import FollowedBoardsBar from "../components/home/FollowedBoardsBar";
import "../assets/Home.scss";

export default function Home() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const isGuest = auth.status === "guest" || auth.status === "unknown";

    return (
        <div className="home-page">
            <div className="home-layout">
                <main className="home-main">
                    {isGuest && <GuestBanner onLogin={() => navigate("/auth")} />}
                    {!isGuest && <FollowedBoardsBar />}
                    <PostFeed />
                </main>
                <aside className="home-sidebar hide-sidebar">
                    <HomeSidebar />
                </aside>
            </div>
        </div>
    );
}
