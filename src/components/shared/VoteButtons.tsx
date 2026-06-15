import { useEffect, useState } from 'react';
import UpArrow from "../../icons/UpArrow";
import DownArrow from "../../icons/DownArrow";
import ReplyBubble from "../../icons/ReplyBubble";
import "../../assets/components.scss";

type Props = {
    votes: number;
    disabled?: boolean;
    bc?: string;
    replies?: number;
};

function fmt(n: number): string {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

export default function VoteButtons({ votes, disabled = false, bc, replies }: Props) {
    const [userVote, setUserVote] = useState<1 | -1 | null>(null);
    const [prevVotes, setPrevVotes] = useState(votes);

    useEffect(() => {
        if (prevVotes !== votes) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPrevVotes(votes);
             
            setUserVote(null);
        }
    }, [votes, prevVotes]);

    const score = votes + (userVote ?? 0);
    const up = userVote === 1;
    const dn = userVote === -1;
    const boardColor = bc || 'var(--accent)';
    const voteClr = dn ? '#c0392b' : boardColor;

    const vote = (e: React.MouseEvent, dir: 0 | 1 | -1) => {
        e.stopPropagation();
        if (disabled || dir === 0) { setUserVote(null); return; }
        setUserVote(userVote === dir ? null : dir);
    };

    return (
        <div className="vote-wrap">
            <div
                className="vote-pill"
                style={{ '--vote-clr': voteClr } as React.CSSProperties}
            >
                <button
                    className="vote-pill-half"
                    disabled={disabled}
                    style={{ cursor: disabled ? 'default' : 'pointer' }}
                    onClick={e => {
                        e.stopPropagation();
                        if (!disabled) vote(e, up ? 0 : 1);
                    }}
                >
                    <UpArrow color={boardColor} />
                    <span className="vote-pill-score">{fmt(score)}</span>
                </button>

                <div className="vote-pill-divider" />

                <button
                    className="vote-pill-half"
                    disabled={disabled}
                    style={{ cursor: disabled ? 'default' : 'pointer' }}
                    onClick={e => {
                        e.stopPropagation();
                        if (!disabled) vote(e, dn ? 0 : -1);
                    }}
                >
                    <DownArrow />
                </button>
            </div>

            {replies != null && (
                <div className="reply-count-wrap">
                    <ReplyBubble />
                    <span className="reply-count-label">{replies}</span>
                </div>
            )}
        </div>
    );
}
