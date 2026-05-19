import type { PostData } from "../../types";
import PostCard from "./PostCard";

type Props = { board: string; posts: PostData[] };

export default function PostGrid({ board, posts }: Props) {
    return (
        <div className="topic-posts">
            {posts.map(p => (
                <PostCard key={p.slug} board={board} post={p}/>
            ))}
        </div>
    );
}
