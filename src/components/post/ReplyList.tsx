type Props = {
    color?: string;
    hasMore?: boolean;
    onLoadMore?: () => void;
    children: React.ReactNode;
};

const DOT_S = 9;
const DOT_R = DOT_S / 2;
const CENTER = 22;
const DOT_T = Math.round(CENTER - DOT_R);
const REM = (n: number) => `${n * 0.0625}rem`;

export default function ReplyList({ color, hasMore, onLoadMore, children }: Props) {
    const items = Array.isArray(children) ? children : [children].filter(Boolean);
    const lineColor = color
        ? `color-mix(in srgb, ${color} 38%, var(--text-faint))`
        : 'var(--text-faint)';
    const dotFill = color
        ? `color-mix(in srgb, ${color} 10%, var(--bg-elevated))`
        : 'var(--bg-elevated)';

    return (
        <div className="reply-list">
            {items.map((child, i) => {
                const isLast = i === items.length - 1 && !hasMore;
                return (
                    <div key={i} className="rl-item"
                        style={{
                            '--line-clr': lineColor,
                            '--dot-fill': dotFill,
                            '--dot-t': REM(DOT_T),
                            '--dot-s': REM(DOT_S),
                        } as React.CSSProperties}
                    >
                        {i === 0 && (
                            <div className="rl-line rl-line--top"
                                style={{ borderLeftColor: lineColor }}
                            />
                        )}
                        <div className="rl-dot"
                            style={{ top: REM(DOT_T), width: REM(DOT_S), height: REM(DOT_S), background: dotFill, border: `0.125rem solid ${lineColor}` }}
                        />
                        {!isLast && (
                            <div className="rl-line rl-line--mid"
                                style={{ borderLeftColor: lineColor }}
                            />
                        )}
                        <div className="rl-connector"
                            style={{ borderColor: lineColor }}
                        />
                        {child}
                    </div>
                );
            })}
            {hasMore && onLoadMore && (
                <button className="btn-ghost load-more-nested" onClick={onLoadMore}>
                    Load more
                </button>
            )}
        </div>
    );
}