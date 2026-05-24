import { Link } from "react-router-dom";
import type { NibData } from "../../types";
import VoteColumn from "../shared/VoteColumn";

type Props = { board: string; post: NibData };

export default function NibCard({ board, post }: Props) {
    return (
        <article className="nib-card">
            <Link to={`/b/${board}/nib/${post.slug}`}>
                <VoteColumn initialScore={post.vote_count ?? 0}/>
                <div className="nib-card-body">
                    <p className="nib-card-title">{post.title}</p>
                    <p className="nib-card-preview">
                        {post.content.slice(0, 120)}{post.content.length > 120 ? "…" : ""}
                    </p>
                    <span className="nib-card-meta">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                </div>
            </Link>
        </article>
    );
}
