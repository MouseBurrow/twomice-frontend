import { Link } from "react-router-dom";
import type { TopicData } from "../../types";

export default function TopicCard({ topic }: { topic: TopicData }) {
    return (
        <div className="mcf-board-card">
            <Link to={`/b/${topic.name}`}>
                <p className="mcf-board-name">b/{topic.name}</p>
                <p className="mcf-board-desc">{topic.description}</p>
                <span className="mcf-board-meta">
                    {new Date(topic.created_at).toLocaleDateString()}
                </span>
            </Link>
        </div>
    );
}
