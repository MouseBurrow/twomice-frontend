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
