import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import type { BoardSummary } from "../../types";

export default function ActiveBoardsWidget() {
    const [boards, setBoards] = useState<BoardSummary[]>([]);

    useEffect(() => {
        let cancelled = false;
        api.getActiveBoards(8).then(data => { if (!cancelled) setBoards(data); }).catch(() => {});
        return () => { cancelled = true; };
    }, []);

    if (boards.length === 0) return null;

    return (
        <div className="active-boards-widget">
            <p className="widget-title">Busy Burrows</p>
            <div className="widget-board-list">
                {boards.map(b => (
                    <Link key={b.name} to={`/b/${b.name}`} className="widget-board-chip">
                        <span className="widget-board-name">b/{b.name}</span>
                        <span className="widget-board-count">
                            {b.post_count.toLocaleString()}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
