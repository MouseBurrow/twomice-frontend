import { useEffect, useState } from "react";
import { api } from "../api";
import type { ApiError } from "../apiError";
import HomeBanner from "../components/home/Header";
import CreateBoardCard from "../components/home/CreateBoardCard";
import BoardGrid from "../components/home/BoardGrid";
import SkeletonBoardCard from "../components/skeleton/SkeletonBoardCard";
import type { BoardData } from "../types";
import "../assets/Home.scss";

export default function Home() {
    const [topics, setTopics] = useState<BoardData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const res = await api.getAllBoards();
            if (cancelled?.()) return;
            setTopics(res.filter(t => !t.deleted));
            setLoading(false);
        } catch (e) {
            if (cancelled?.()) return;
            setError(e as ApiError);
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        load(() => cancelled);
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="home-page">
            <HomeBanner/>
            <CreateBoardCard onCreated={load}/>
            {loading ? (
                <div className="home-boards">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonBoardCard key={i}/>)}
                </div>
            ) : (
                <>
                    {error && <p style={{ color: "var(--accent)", textAlign: "center" }}>Failed to load boards.</p>}
                    <BoardGrid topics={topics}/>
                </>
            )}
        </div>
    );
}
