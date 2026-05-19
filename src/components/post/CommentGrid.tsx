import type { CommentData } from "../../types";
import CommentCard from "./CommentCard";

type Props = { topic: string; post: string; comments: CommentData[] };

export default function CommentGrid({ topic, post, comments }: Props) {
    return (
        <div className="comment-list">
            {comments.map((c, i) => (
                <div key={c.hash}>
                    {i > 0 && <div className="comment-separator"/>}
                    <CommentCard topic={topic} post={post} comment={c}/>
                </div>
            ))}
        </div>
    );
}
