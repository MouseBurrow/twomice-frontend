import "../../assets/Skeleton.scss";

export default function SkeletonBoardHero() {
    return (
        <div className="board-hero" style={{ borderTop: "3px solid var(--accent)" }}>
            <div className="board-hero-body">
                <div className="board-hero-row" style={{ marginBottom: "0.75rem" }}>
                    <div className="skeleton-hero-title">
                        <span className="shimmer-line" style={{ width: "28%", display: "inline-block" }} />
                    </div>
                    <span className="shimmer-line" style={{ width: "5rem", height: "1.25rem", display: "inline-block" }} />
                </div>
                <p style={{ marginBottom: "1rem" }}>
                    <span className="shimmer-line" style={{ width: "55%" }} />
                </p>
                <div className="board-hero-stats" style={{ display: "flex", gap: "0.75rem" }}>
                    <span className="shimmer-line" style={{ width: "5rem", height: "2rem" }} />
                    <span className="shimmer-line" style={{ width: "6rem", height: "2rem" }} />
                </div>
            </div>
        </div>
    );
}
