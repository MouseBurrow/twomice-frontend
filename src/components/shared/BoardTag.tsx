type Props = { tag: string; bc: string };

export default function BoardTag({ tag, bc }: Props) {
    return (
        <span className="bc-tag" style={{ '--tag-clr': bc } as React.CSSProperties}>
            #{tag}
        </span>
    );
}
