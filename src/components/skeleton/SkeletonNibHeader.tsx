import SkeletonVoteColumn from "./SkeletonVoteColumn";
import "../../assets/Skeleton.scss";

export default function SkeletonNibHeader() {
    return (
        <div className="post-vote-row">
            <SkeletonVoteColumn />
            <div className="post-header">
                <div className="post-header-meta"><span className="shimmer-line" style={{ width: "12%" }} /></div>
                <h1 className="post-header-title"><span className="shimmer-line" style={{ width: "68%" }} /></h1>
                <p className="post-header-content">
                    <span className="shimmer-line" style={{ width: "100%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "90%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "60%" }} />
                </p>
            </div>
        </div>
    );
}
