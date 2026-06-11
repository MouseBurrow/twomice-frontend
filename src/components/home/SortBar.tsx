import MiniBtn from "../shared/MiniBtn";

type Sort = "hot" | "new" | "top";
type Props = { sort: Sort; onSort: (s: Sort) => void };

export default function SortBar({ sort, onSort }: Props) {
    return (
        <div className="sort-bar">
            <span className="sort-bar-label">Sort</span>
            {(["hot", "new", "top"] as Sort[]).map(s => (
                <MiniBtn key={s} active={sort === s} onClick={() => onSort(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </MiniBtn>
            ))}
        </div>
    );
}
