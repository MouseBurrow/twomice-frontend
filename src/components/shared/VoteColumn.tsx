import { useState } from "react";
import "./VoteColumn.scss";

type Props = {
    initialScore?: number;
};

function stripeStyle(score: number): { height: string; background: string } {
    if (score >= 100) return {
        height: "32px",
        background: "linear-gradient(var(--stripe-top), var(--stripe-bottom))",
    };
    if (score >= 20) return {
        height: "20px",
        background: "linear-gradient(#a05828, #d49060)",
    };
    if (score >= 5) return {
        height: "13px",
        background: "#c8a880",
    };
    return { height: "5px", background: "#e0cdb8" };
}

export default function VoteColumn({ initialScore = 0 }: Props) {
    const [score, setScore] = useState(initialScore);
    const [vote, setVote] = useState<"up" | "down" | null>(null);

    function cast(dir: "up" | "down") {
        if (vote === dir) {
            setVote(null);
            setScore(s => dir === "up" ? s - 1 : s + 1);
        } else {
            const delta = dir === "up" ? 1 : -1;
            const undo = vote !== null ? (vote === "up" ? -1 : 1) : 0;
            setScore(s => s + delta + undo);
            setVote(dir);
        }
    }

    return (
        <div className="vote-col">
            <button
                className={`vote-arrow${vote === "up" ? " active" : ""}`}
                onClick={() => cast("up")}
                aria-label="Upvote"
            >
                ▲
            </button>
            <div className="vote-stripe" style={stripeStyle(score)}/>
            <span className="vote-score">{score}</span>
            <button
                className={`vote-arrow${vote === "down" ? " active" : ""}`}
                onClick={() => cast("down")}
                aria-label="Downvote"
            >
                ▼
            </button>
        </div>
    );
}
