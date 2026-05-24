import type { BoardData } from "../../types";
import BoardCard from "./BoardCard";

export default function BoardGrid({ topics }: { topics: BoardData[] }) {
    return (
        <div className="mcf-boards">
            {topics.map(t => (
                <BoardCard key={t.name} topic={t}/>
            ))}
        </div>
    );
}
