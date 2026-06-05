import React, { useState } from 'react';

type Props = { votes: number; disabled?: boolean };

export default function VoteButtons({ votes, disabled = false }: Props) {
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [prevVotes, setPrevVotes] = useState(votes);

  if (prevVotes !== votes) {
    setPrevVotes(votes);
    setUserVote(null);
  }

  const score = votes + (userVote ?? 0);

  const vote = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation();
    if (disabled) return;
    setUserVote(userVote === dir ? null : dir);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <button className={`vote-btn vote-btn--up${userVote === 1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, 1)} aria-label="Upvote">▲</button>
      <span className="vote-score">{score}</span>
      <button className={`vote-btn vote-btn--down${userVote === -1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, -1)} aria-label="Downvote">▼</button>
    </div>
  );
}
