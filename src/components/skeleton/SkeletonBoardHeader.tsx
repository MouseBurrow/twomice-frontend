import "../../assets/Skeleton.scss";

export default function SkeletonBoardHeader() {
    return (
        <div className="board-hero">
            <div className="board-hero-top" />
            <div className="board-hero-body">
                <h1 className="board-hero-name"><span className="shimmer-line" style={{ width: "28%" }} /></h1>
                <p className="board-hero-desc"><span className="shimmer-line" style={{ width: "55%" }} /></p>
            </div>
        </div>
    );
}
