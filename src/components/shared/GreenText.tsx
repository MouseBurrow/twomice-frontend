type Props = { text: string };

export default function GreenText({ text }: Props) {
    return (
        <>
            {text.split("\n").map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                    {line.startsWith(">") ? (
                        <span style={{ color: "var(--greentext)", fontStyle: "italic" }}>
                            {line}
                        </span>
                    ) : (
                        line || "\u00a0"
                    )}
                </span>
            ))}
        </>
    );
}
