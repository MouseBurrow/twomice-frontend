import SkeletonVoteColumn from "./SkeletonVoteColumn";
import "../../assets/Skeleton.scss";

export default function SkeletonSqueakCard() {
    return (
        <article className="comment-card">
            <SkeletonVoteColumn />
            <div className="comment-bubble">
                <p className="comment-content">
                    <span className="shimmer-line" style={{ width: "92%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "75%" }} />
                </p>
                <div className="comment-meta">
                    <span className="shimmer-line" style={{ width: "18%" }} />
                </div>
            </div>
        </article>
    );
}
