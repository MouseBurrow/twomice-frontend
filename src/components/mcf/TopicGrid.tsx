import type { TopicData } from "../../types";
import TopicCard from "./TopicCard";

export default function TopicGrid({ topics }: { topics: TopicData[] }) {
    return (
        <div className="mcf-boards">
            {topics.map(t => (
                <TopicCard key={t.name} topic={t}/>
            ))}
        </div>
    );
}
