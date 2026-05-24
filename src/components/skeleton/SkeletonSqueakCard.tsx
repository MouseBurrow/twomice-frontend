import SkeletonVoteColumn from "./SkeletonVoteColumn";
import "../../assets/Skeleton.scss";

export default function SkeletonSqueakCard() {
    return (
        <article className="squeak-card">
            <SkeletonVoteColumn />
            <div className="squeak-bubble">
                <p className="squeak-content">
                    <span className="shimmer-line" style={{ width: "92%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "75%" }} />
                </p>
                <div className="squeak-meta">
                    <span className="shimmer-line" style={{ width: "18%" }} />
                </div>
            </div>
        </article>
    );
}
