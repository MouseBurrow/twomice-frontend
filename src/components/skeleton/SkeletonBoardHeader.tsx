import "../../assets/Skeleton.scss";

export default function SkeletonBoardHeader() {
    return (
        <div className="board-header">
            <h1 className="board-header-name"><span className="shimmer-line" style={{ width: "28%" }} /></h1>
            <p className="board-header-desc"><span className="shimmer-line" style={{ width: "55%" }} /></p>
        </div>
    );
}
