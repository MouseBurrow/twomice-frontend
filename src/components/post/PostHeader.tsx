type Props = { title: string; content: string; createdAt?: string };

export default function PostHeader({ title, content, createdAt }: Props) {
    return (
        <div className="post-header">
            <div className="post-header-meta">
                <span className="post-header-vote-pill">▲ 0 ▼</span>
                {createdAt && <span>{new Date(createdAt).toLocaleDateString()}</span>}
            </div>
            <h1 className="post-header-title">{title}</h1>
            {content && <p className="post-header-content">{content}</p>}
        </div>
    );
}
