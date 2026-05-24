import SkeletonVoteColumn from "./SkeletonVoteColumn";
import "../../assets/Skeleton.scss";

export default function SkeletonNibHeader() {
    return (
        <div className="nib-vote-row">
            <SkeletonVoteColumn />
            <div className="nib-header">
                <div className="nib-header-meta"><span className="shimmer-line" style={{ width: "12%" }} /></div>
                <h1 className="nib-header-title"><span className="shimmer-line" style={{ width: "68%" }} /></h1>
                <p className="nib-header-content">
                    <span className="shimmer-line" style={{ width: "100%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "90%", marginBottom: "6px" }} />
                    <span className="shimmer-line" style={{ width: "60%" }} />
                </p>
            </div>
        </div>
    );
}
