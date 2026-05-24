import { Link } from "react-router-dom";
import type { NibData } from "../../types";
import VoteColumn from "../shared/VoteColumn";

type Props = { board: string; post: NibData };

export default function NibCard({ board, post }: Props) {
    return (
        <article className="topic-post">
            <Link to={`/b/${board}/nib/${post.slug}`}>
                <VoteColumn initialScore={post.vote_count ?? 0}/>
                <div className="topic-post-body">
                    <p className="topic-post-title">{post.title}</p>
                    <p className="topic-post-preview">
                        {post.content.slice(0, 120)}{post.content.length > 120 ? "…" : ""}
                    </p>
                    <span className="topic-post-meta">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                </div>
            </Link>
        </article>
    );
}
