import type { SqueakData } from "../../types";
import SqueakCard from "./SqueakCard";

type Props = { topic: string; post: string; comments: SqueakData[] };

export default function SqueakGrid({ topic, post, comments }: Props) {
    return (
        <div className="comment-list">
            {comments.map((c, i) => (
                <div key={c.hash}>
                    {i > 0 && <div className="comment-separator"/>}
                    <SqueakCard topic={topic} post={post} comment={c}/>
                </div>
            ))}
        </div>
    );
}
