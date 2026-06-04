import { useEffect, useState } from "react";
import { api } from "../../api";
import type { ApiError } from "../../apiError";
import type { NibData } from "../../types";
import NibCard from "../board/NibCard";
import SkeletonNibCard from "../skeleton/SkeletonNibCard";
import SortBar from "./SortBar";

type Sort = "hot" | "new" | "top";

export default function NibFeed() {
    const [sort, setSort] = useState<Sort>("hot");
    const [nibs, setNibs] = useState<NibData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError>();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(undefined);
        api.getFeed(sort)
            .then(data => {
                if (cancelled) return;
                setNibs(data.filter(n => !n.deleted));
                setLoading(false);
            })
            .catch(e => {
                if (cancelled) return;
                setError(e as ApiError);
                setLoading(false);
            });
        return () => { cancelled = true; };
    }, [sort]);

    return (
        <div className="nib-feed">
            <SortBar sort={sort} onSort={setSort} />
            {loading ? (
                <div className="nib-feed-grid">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonNibCard key={i} />)}
                </div>
            ) : error ? (
                <p className="nib-feed-error">Failed to load feed.</p>
            ) : nibs.length === 0 ? (
                <p className="nib-feed-empty">Nothing here yet.</p>
            ) : (
                <div className="nib-feed-grid">
                    {nibs.map(n => (
                        <NibCard key={`${n.board_id}-${n.slug}`} post={n} />
                    ))}
                </div>
            )}
        </div>
    );
}
