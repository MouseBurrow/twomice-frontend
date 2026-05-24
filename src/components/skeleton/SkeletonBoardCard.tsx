import "../../assets/Skeleton.scss";

export default function SkeletonBoardCard() {
    return (
        <div className="home-board-card">
            {/* padding mirrors .home-board-card a { padding: 14px 16px } */}
            <div style={{ padding: "14px 16px" }}>
                <p className="home-board-name"><span className="shimmer-line" style={{ width: "55%" }} /></p>
                <p className="home-board-desc"><span className="shimmer-line" style={{ width: "82%" }} /></p>
                <span className="home-board-meta" style={{ display: "block" }}><span className="shimmer-line" style={{ width: "35%" }} /></span>
            </div>
        </div>
    );
}
