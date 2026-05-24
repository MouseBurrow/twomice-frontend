import { useEffect, useState } from "react";
import { api } from "../api";
import type { ApiError } from "../apiError";
import HomeBanner from "../components/mcf/Header";
import CreateTopicCard from "../components/mcf/CreateTopicCard";
import TopicGrid from "../components/mcf/TopicGrid";
import SkeletonBoardCard from "../components/skeleton/SkeletonBoardCard";
import type { TopicData } from "../types";
import "../assets/MCF.scss";

export default function MCF() {
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const res = await api.getAllTopics();
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
        <div className="mcf-page">
            <HomeBanner/>
            <CreateTopicCard onCreated={load}/>
            {loading ? (
                <div className="mcf-boards">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonBoardCard key={i}/>)}
                </div>
            ) : (
                <>
                    {error && <p style={{ color: "var(--accent)", textAlign: "center" }}>Failed to load boards.</p>}
                    <TopicGrid topics={topics}/>
                </>
            )}
        </div>
    );
}
