type Props = { tag: string; bc: string };

export default function BoardTag({ tag, bc }: Props) {
    return (
        <span className="bc-tag" style={{
            color: bc,
            background: `color-mix(in srgb, ${bc} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${bc} 28%, transparent)`,
        }}>
            #{tag}
        </span>
    );
}
