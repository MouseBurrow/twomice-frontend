import { Link } from "react-router-dom";
import type { BoardData } from "../../types";
import { formatDate } from "../../utils/date";

export default function BoardCard({ topic }: { topic: BoardData }) {
    return (
        <div className="home-board-card">
            <Link to={`/b/${topic.name}`}>
                <p className="home-board-name">b/{topic.name}</p>
                <p className="home-board-desc">{topic.description}</p>
                <span className="home-board-meta">
                    {formatDate(topic.created_at)}
                </span>
            </Link>
        </div>
    );
}
