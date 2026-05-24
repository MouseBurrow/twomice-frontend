import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import CommentGrid from "../components/post/CommentGrid";
import CreateCommentCard from "../components/post/CreateCommentCard";
import PostHeader from "../components/post/PostHeader.tsx";
import VoteColumn from "../components/shared/VoteColumn";
import SkeletonPostHeader from "../components/skeleton/SkeletonPostHeader";
import SkeletonCommentCard from "../components/skeleton/SkeletonCommentCard";
import type { CommentData, PostData } from "../types";
import "../assets/Post.scss";

export default function Post() {
    const { board, post } = useParams<{ board: string; post: string }>();
    const [postData, setPostData] = useState<PostData>();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const [p, c] = await Promise.all([
                api.getPost(board!, post!),
                api.getAllComments(board!, post!)
            ]);
            if (cancelled?.()) return;
            setPostData(p);
            setComments(c.filter(x => !x.deleted));
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
    }, [board, post]);

    return (
        <div className="post-page">
            <div className="post-board">
                {loading ? (
                    <>
                        <SkeletonPostHeader/>
                        <div className="comment-list">
                            {Array.from({ length: 4 }, (_, i) => <SkeletonCommentCard key={i}/>)}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="post-vote-row">
                            <VoteColumn initialScore={postData?.vote_count ?? 0}/>
                            <PostHeader
                                title={postData?.title ?? ""}
                                content={postData?.content ?? ""}
                                createdAt={postData?.created_at}
                            />
                        </div>
                        {postData && (
                            <>
                                <CreateCommentCard topic={board!} post={post!} onCreated={load}/>
                                <CommentGrid topic={board!} post={post!} comments={comments}/>
                            </>
                        )}
                        {error && <p className="post-error">Failed to load comments.</p>}
                    </>
                )}
            </div>
        </div>
    );
}
