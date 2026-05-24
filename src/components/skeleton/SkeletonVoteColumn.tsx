import "../../assets/Skeleton.scss";

export default function SkeletonVoteColumn() {
    return (
        <div className="vote-col">
            <span className="shimmer-line" style={{ width: "12px", height: "10px" }} />
            <span className="shimmer-line" style={{ width: "4px", height: "13px" }} />
            <span className="shimmer-line" style={{ width: "20px", height: "10px" }} />
            <span className="shimmer-line" style={{ width: "12px", height: "10px" }} />
        </div>
    );
}
