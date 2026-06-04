type Sort = "hot" | "new" | "top";
type Props = { sort: Sort; onSort: (s: Sort) => void };

export default function SortBar({ sort, onSort }: Props) {
    return (
        <div className="sort-bar">
            <span className="sort-bar-label">Sort</span>
            {(["hot", "new", "top"] as Sort[]).map(s => (
                <button
                    key={s}
                    className={`sort-btn${sort === s ? " active" : ""}`}
                    aria-pressed={sort === s}
                    onClick={() => onSort(s)}
                >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
            ))}
        </div>
    );
}
