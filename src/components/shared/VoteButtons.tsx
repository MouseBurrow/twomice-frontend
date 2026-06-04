import React, { useEffect, useState } from 'react';

type Props = { votes: number; disabled?: boolean };

export default function VoteButtons({ votes, disabled = false }: Props) {
  const [score, setScore] = useState(votes);
  const [uv, setUv] = useState<1 | -1 | null>(null);

  useEffect(() => { setScore(votes); setUv(null); }, [votes]);

  const vote = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation();
    if (disabled) return;
    const newUv = uv === dir ? null : dir;
    setScore(prev => prev - (uv ?? 0) + (newUv ?? 0));
    setUv(newUv);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <button className={`vote-btn vote-btn--up${uv === 1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, 1)} aria-label="Upvote">▲</button>
      <span className="vote-score">{score}</span>
      <button className={`vote-btn vote-btn--down${uv === -1 ? " vote-btn--active" : ""}`} disabled={disabled} onClick={e => vote(e, -1)} aria-label="Downvote">▼</button>
    </div>
  );
}
