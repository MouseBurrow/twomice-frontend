import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import CreatePostCard from "../components/topic/CreatePostCard.tsx";
import PostGrid from "../components/topic/PostGrid";
import TopicHeader from "../components/topic/TopicHeader.tsx";
import type { PostData, TopicData } from "../types";
import "../assets/Topic.scss";

export default function Topic() {
    const { board } = useParams<{ board: string }>();
    const [topicData, setTopicData] = useState<TopicData>();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<ApiError>();

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const [t, p] = await Promise.all([
                api.getTopic(board!),
                api.getAllPosts(board!)
            ]);
            if (cancelled?.()) return;
            setTopicData(t);
            setPosts(p.filter(post => !post.deleted));
        } catch (e) {
            if (cancelled?.()) return;
            setError(e as ApiError);
        }
    }

    useEffect(() => {
        let cancelled = false;
        load(() => cancelled);
        return () => { cancelled = true; };
    }, [board]);

    return (
        <div className="topic-page">
            <div className="topic-board">
                <TopicHeader
                    name={topicData?.name ?? "Loading…"}
                    description={topicData?.description ?? ""}
                />
                {topicData && (
                    <>
                        <CreatePostCard topicName={topicData.name} onCreated={load}/>
                        <PostGrid board={topicData.name} posts={posts}/>
                    </>
                )}
                {error && <p className="topic-error">Failed to load posts.</p>}
            </div>
        </div>
    );
}
