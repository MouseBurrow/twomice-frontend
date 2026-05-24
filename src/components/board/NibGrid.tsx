import type { NibData } from "../../types";
import NibCard from "./NibCard";

type Props = { board: string; posts: NibData[] };

export default function NibGrid({ board, posts }: Props) {
    return (
        <div className="topic-posts">
            {posts.map(p => (
                <NibCard key={p.slug} board={board} post={p}/>
            ))}
        </div>
    );
}
