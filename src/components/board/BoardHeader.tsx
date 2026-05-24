type Props = { name: string; description: string };

export default function BoardHeader({ name, description }: Props) {
    return (
        <div className="board-header">
            <h1 className="board-header-name">b/{name}</h1>
            <p className="board-header-desc">{description}</p>
        </div>
    );
}
