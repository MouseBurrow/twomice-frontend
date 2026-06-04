import { useDensity } from "../../contexts/DensityContext";
import "../../assets/Skeleton.scss";

export default function SkeletonPostCard() {
    const { density } = useDensity();

    return (
        <article className="post-card">
            <div className="post-card-inner">
                <div className="post-card-meta-row">
                    <span className="shimmer-line" style={{ width: "3.5rem", height: "0.75rem" }} />
                    <span className="shimmer-line" style={{ width: "5rem", height: "0.75rem" }} />
                </div>
                <div className="post-card-title">
                    <span className="shimmer-line" style={{ width: "65%" }} />
                </div>
                {density !== "compact" && (
                    <div className="post-card-preview" style={{ height: "2.5rem" }}>
                        <span className="shimmer-line" style={{ width: "95%", marginBottom: "0.25rem" }} />
                        <span className="shimmer-line" style={{ width: "72%" }} />
                    </div>
                )}
                <div className="post-card-footer">
                    <span className="shimmer-line" style={{ width: "4rem", height: "0.875rem" }} />
                    <span className="shimmer-line" style={{ width: "3rem", height: "0.875rem" }} />
                </div>
            </div>
        </article>
    );
}
