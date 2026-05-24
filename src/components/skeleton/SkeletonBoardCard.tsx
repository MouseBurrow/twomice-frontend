import "../../assets/Skeleton.scss";

export default function SkeletonBoardCard() {
    return (
        <div className="mcf-board-card">
            {/* padding mirrors .mcf-board-card a { padding: 14px 16px } */}
            <div style={{ padding: "14px 16px" }}>
                <p className="mcf-board-name"><span className="shimmer-line" style={{ width: "55%" }} /></p>
                <p className="mcf-board-desc"><span className="shimmer-line" style={{ width: "82%" }} /></p>
                <span className="mcf-board-meta" style={{ display: "block" }}><span className="shimmer-line" style={{ width: "35%" }} /></span>
            </div>
        </div>
    );
}
