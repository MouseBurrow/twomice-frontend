import SkeletonVoteColumn from "./SkeletonVoteColumn";
import "../../assets/Skeleton.scss";

export default function SkeletonNibCard() {
    return (
        <article className="topic-post">
            {/* layout mirrors .topic-post a { display: flex; gap: 12px; padding: 12px 16px } */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px" }}>
                <SkeletonVoteColumn />
                <div className="topic-post-body">
                    <p className="topic-post-title"><span className="shimmer-line" style={{ width: "55%" }} /></p>
                    {/* div instead of p to avoid -webkit-line-clamp interfering with block shimmer children */}
                    <div style={{ marginBottom: "6px" }}>
                        <span className="shimmer-line" style={{ width: "95%", marginBottom: "4px" }} />
                        <span className="shimmer-line" style={{ width: "72%" }} />
                    </div>
                    <span className="topic-post-meta" style={{ display: "block" }}><span className="shimmer-line" style={{ width: "25%" }} /></span>
                </div>
            </div>
        </article>
    );
}
