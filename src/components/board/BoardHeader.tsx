type Props = { name: string; description: string };

export default function BoardHeader({ name, description }: Props) {
    return (
        <div className="topic-header">
            <h1 className="topic-header-name">b/{name}</h1>
            <p className="topic-header-desc">{description}</p>
        </div>
    );
}
