const DOT_S = 9;
const DOT_R = DOT_S / 2;
const CENTER = 22;
const DOT_T = Math.round(CENTER - DOT_R);
const REM = (n: number) => `${n * 0.0625}rem`;

type Props = {
    hasMore?: boolean;
    onLoadMore?: () => void;
    children: React.ReactNode;
};

export default function ReplyList({ hasMore, onLoadMore, children }: Props) {
    return (
        <div className="reply-list">
            {children}
            {hasMore && onLoadMore && (
                <button className="btn-ghost load-more-nested" onClick={onLoadMore}>
                    Load more
                </button>
            )}
        </div>
    );
}

export { DOT_S, DOT_R, CENTER, DOT_T, REM };
