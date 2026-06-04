import "../../assets/Skeleton.scss";

export default function SkeletonPostHeader() {
    return (
        <div className="post-detail" style={{ marginBottom: "1rem" }}>
            <div className="post-detail-inner">
                <div className="post-detail-meta">
                    <span className="shimmer-line" style={{ width: "12%" }} />
                </div>
                <div className="post-detail-title">
                    <span className="shimmer-line" style={{ width: "68%" }} />
                </div>
                <div className="post-detail-content">
                    <span className="shimmer-line" style={{ width: "100%", marginBottom: "0.375rem" }} />
                    <span className="shimmer-line" style={{ width: "90%", marginBottom: "0.375rem" }} />
                    <span className="shimmer-line" style={{ width: "60%" }} />
                </div>
            </div>
        </div>
    );
}
