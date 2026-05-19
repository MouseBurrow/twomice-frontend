import { Link } from "react-router-dom";
import type { PostData } from "../../types";

type Props = {
    board: string;
    post: PostData;
};

export default function PostCard({ board, post }: Props) {
    return (
        <article className="topic-post">
            <Link to={`/b/${board}/nib/${post.slug}`}>
                <h3>{post.title}</h3>
                <p>{post.content.slice(0, 120)}{post.content.length > 120 ? "…" : ""}</p>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </Link>
        </article>
    );
}
