import "./skeleton.scss";

type Props = {
    lines: number;
    widths?: string[];
    height?: string;
    style?: React.CSSProperties;
};

const WIDTHS = ["62%", "48%", "75%", "53%", "68%", "41%", "58%", "72%"];

export default function SkeletonLines({ lines, widths, height, style }: Props) {
    return (
        <div className="skeleton-block" style={{ ...style, height: height ?? undefined }}>
            {Array.from({ length: lines }, (_, i) => (
                <span
                    key={i}
                    className="shimmer-line"
                    style={{
                        width: widths?.[i] ?? WIDTHS[i % WIDTHS.length],
                        marginBottom: i < lines - 1 ? "0.5rem" : undefined,
                    }}
                />
            ))}
        </div>
    );
}
