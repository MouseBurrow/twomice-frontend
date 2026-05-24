import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import SqueakGrid from "../components/nib/SqueakGrid";
import CreateSqueakCard from "../components/nib/CreateSqueakCard";
import NibHeader from "../components/nib/NibHeader.tsx";
import VoteColumn from "../components/shared/VoteColumn";
import SkeletonNibHeader from "../components/skeleton/SkeletonNibHeader";
import SkeletonSqueakCard from "../components/skeleton/SkeletonSqueakCard";
import type { SqueakData, NibData } from "../types";
import "../assets/Nib.scss";

export default function Nib() {
    const { board, post } = useParams<{ board: string; post: string }>();
    const [postData, setNibData] = useState<NibData>();
    const [comments, setComments] = useState<SqueakData[]>([]);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(true);

    async function load(cancelled?: () => boolean) {
        try {
            setError(undefined);
            const [p, c] = await Promise.all([
                api.getNib(board!, post!),
                api.getAllSqueaks(board!, post!)
            ]);
            if (cancelled?.()) return;
            setNibData(p);
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
        <div className="nib-page">
            <div className="nib-content">
                {loading ? (
                    <>
                        <SkeletonNibHeader/>
                        <div className="squeak-list">
                            {Array.from({ length: 4 }, (_, i) => <SkeletonSqueakCard key={i}/>)}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="nib-vote-row">
                            <VoteColumn initialScore={postData?.vote_count ?? 0}/>
                            <NibHeader
                                title={postData?.title ?? ""}
                                content={postData?.content ?? ""}
                                createdAt={postData?.created_at}
                            />
                        </div>
                        {postData && (
                            <>
                                <CreateSqueakCard topic={board!} post={post!} onCreated={load}/>
                                <SqueakGrid topic={board!} post={post!} comments={comments}/>
                            </>
                        )}
                        {error && <p className="nib-error">Failed to load comments.</p>}
                    </>
                )}
            </div>
        </div>
    );
}
