import NibFeed from "../components/home/NibFeed";
import ActiveBoardsWidget from "../components/home/ActiveBoardsWidget";
import "../assets/Home.scss";

export default function Home() {
    return (
        <div className="home-page">
            <div className="home-layout">
                <main className="home-main">
                    <NibFeed />
                </main>
                <aside className="home-sidebar hide-sidebar">
                    <ActiveBoardsWidget />
                </aside>
            </div>
        </div>
    );
}
