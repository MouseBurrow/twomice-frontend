import React, { useState } from 'react';

type Props = { votes: number; disabled?: boolean };

export default function VoteButtons({ votes, disabled = false }: Props) {
  const [uv, setUv] = useState<1 | -1 | null>(null);
  const [prevVotes, setPrevVotes] = useState(votes);

  if (prevVotes !== votes) {
    setPrevVotes(votes);
    setUv(null);
  }

  const score = votes + (uv ?? 0);

  const vote = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation();
    if (disabled) return;
    setUv(uv === dir ? null : dir);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <button className={`vote-btn vote-btn--up${uv === 1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, 1)} aria-label="Upvote">▲</button>
      <span className="vote-score">{score}</span>
      <button className={`vote-btn vote-btn--down${uv === -1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, -1)} aria-label="Downvote">▼</button>
    </div>
  );
}
