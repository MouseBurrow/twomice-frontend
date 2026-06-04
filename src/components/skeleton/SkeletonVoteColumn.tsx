import "../../assets/Skeleton.scss";

export default function SkeletonVoteColumn() {
    return (
        <div className="vote-col">
            <span className="shimmer-line" style={{ width: "0.75rem", height: "0.625rem" }} />
            <span className="shimmer-line" style={{ width: "0.25rem", height: "0.8125rem" }} />
            <span className="shimmer-line" style={{ width: "1.25rem", height: "0.625rem" }} />
            <span className="shimmer-line" style={{ width: "0.75rem", height: "0.625rem" }} />
        </div>
    );
}
