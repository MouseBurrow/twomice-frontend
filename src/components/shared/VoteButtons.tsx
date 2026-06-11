import { useState } from 'react';

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

    if (prevVotes !== votes) {
        setPrevVotes(votes);
        setUserVote(null);
    }

    const score = votes + (userVote ?? 0);
    const up = userVote === 1;
    const dn = userVote === -1;
    const boardColor = bc || 'var(--accent)';

    const pillBg = `color-mix(in srgb, ${boardColor} 10%, var(--bg-surface))`;
    const pillBorder = `color-mix(in srgb, ${boardColor} 28%, transparent)`;
    const dividerCol = `color-mix(in srgb, ${boardColor} 28%, transparent)`;
    const upArrow = boardColor;
    const dnArrow = dn ? '#c0392b' : 'var(--text-faint)';
    const countColor = dn ? '#c0392b' : boardColor;

    const vote = (e: React.MouseEvent, dir: 1 | -1) => {
        e.stopPropagation();
        if (disabled) return;
        setUserVote(userVote === dir ? null : dir);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center',
                borderRadius: 99,
                background: pillBg,
                border: `1.5px solid ${pillBorder}`,
                overflow: 'hidden',
                transition: 'border-color 0.15s, background 0.15s',
            }}>
                <button
                    className={`vote-btn${up ? ' vote-up' : ''}`}
                    disabled={disabled}
                    style={{
                        padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 5,
                        background: 'transparent', border: 'none',
                        cursor: disabled ? 'default' : 'pointer',
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        if (!disabled) vote(e, up ? 0 : 1);
                    }}
                >
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 6L5 1.5L9 6" stroke={upArrow} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                        fontSize: 11, fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, color: countColor, lineHeight: 1,
                        transition: 'color 0.15s',
                    }}>
                        {fmt(score)}
                    </span>
                </button>

                <div style={{ width: 1, height: 14, background: dividerCol, flexShrink: 0 }} />

                <button
                    className={`vote-btn${dn ? ' vote-dn' : ''}`}
                    disabled={disabled}
                    style={{
                        padding: '3px 9px', display: 'flex', alignItems: 'center',
                        background: 'transparent', border: 'none',
                        cursor: disabled ? 'default' : 'pointer',
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        if (!disabled) vote(e, dn ? 0 : -1);
                    }}
                >
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 1.5L5 6L9 1.5" stroke={dnArrow} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {replies != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="11" height="10" viewBox="0 0 12 11" fill="none">
                        <path d="M1.5 1.5h9v6H7L5.5 9 4 7.5H1.5V1.5z"
                            stroke="var(--text-faint)"
                            strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                        fontSize: 11, fontFamily: "'Space Grotesk', sans-serif",
                        color: 'var(--text-faint)',
                    }}>{replies}</span>
                </div>
            )}
        </div>
    );
}
