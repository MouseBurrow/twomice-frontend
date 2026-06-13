import { Link } from "react-router-dom";
import type { BoardData } from "../../types";
import { useFormatRelativeTime } from "../../utils/date";

export default function BoardCard({ topic }: { topic: BoardData }) {
    const boardTime = useFormatRelativeTime(topic.created_at);
    return (
        <div className="home-board-card">
            <Link to={`/b/${topic.name}`}>
                <p className="home-board-name">b/{topic.name}</p>
                <p className="home-board-desc">{topic.description}</p>
                <span className="home-board-meta">
                    {boardTime}
                </span>
            </Link>
        </div>
    );
}
