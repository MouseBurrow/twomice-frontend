type Props = { title: string; content: string; createdAt?: string };

export default function NibHeader({ title, content, createdAt }: Props) {
    return (
        <div className="nib-header">
            {createdAt && (
                <div className="nib-header-meta">
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
            )}
            <h1 className="nib-header-title">{title}</h1>
            {content && <p className="nib-header-content">{content}</p>}
        </div>
    );
}
