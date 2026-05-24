import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import CreateNibCard from "../components/board/CreateNibCard.tsx";
import NibGrid from "../components/board/NibGrid";
import BoardHeader from "../components/board/BoardHeader.tsx";
import SkeletonBoardHeader from "../components/skeleton/SkeletonBoardHeader";
import SkeletonNibCard from "../components/skeleton/SkeletonNibCard";
import type { NibData, BoardData } from "../types";
import "../assets/Board.scss";

export default function Board() {
    const { board } = useParams<{ board: string }>();
    const [topicData, setBoardData] = useState<BoardData>();
    const [posts, setPosts] = useState<NibData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const [t, p] = await Promise.all([
                api.getBoard(board!),
                api.getAllNibs(board!)
            ]);
            if (cancelled?.()) return;
            setBoardData(t);
            setPosts(p.filter(post => !post.deleted));
            setLoading(false);
        } catch (e) {
            if (cancelled?.()) return;
            setError(e as ApiError);
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        load(() => cancelled);
        return () => { cancelled = true; };
    }, [board]);

    return (
        <div className="topic-page">
            <div className="topic-board">
                {loading ? (
                    <>
                        <SkeletonBoardHeader/>
                        <div className="topic-posts">
                            {Array.from({ length: 5 }, (_, i) => <SkeletonNibCard key={i}/>)}
                        </div>
                    </>
                ) : (
                    <>
                        {topicData && <BoardHeader name={topicData.name} description={topicData.description}/>}
                        {topicData && (
                            <>
                                <CreateNibCard topicName={topicData.name} onCreated={load}/>
                                <NibGrid board={topicData.name} posts={posts}/>
                            </>
                        )}
                        {error && <p className="topic-error">Failed to load posts.</p>}
                    </>
                )}
            </div>
        </div>
    );
}
