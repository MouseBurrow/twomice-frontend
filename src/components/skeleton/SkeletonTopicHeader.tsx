import "../../assets/Skeleton.scss";

export default function SkeletonTopicHeader() {
    return (
        <div className="topic-header">
            <h1 className="topic-header-name"><span className="shimmer-line" style={{ width: "28%" }} /></h1>
            <p className="topic-header-desc"><span className="shimmer-line" style={{ width: "55%" }} /></p>
        </div>
    );
}
