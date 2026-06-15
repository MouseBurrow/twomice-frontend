const COLORS = {
    pink: { body: "#f778ba", eye: "#ffffff" },
    green: { body: "#3fb950", eye: "#ffffff" },
};

interface MouseIconProps {
    color: "pink" | "green";
    size?: number;
    className?: string;
}

export default function MouseIcon({ color, size = 46, className }: MouseIconProps) {
    const c = COLORS[color];
    return (
        <svg
            viewBox="5 24 46 58"
            width={size}
            height={size}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`${color} mouse`}
        >
            <circle cx="18" cy="37" r="11" fill={c.body} />
            <circle cx="38" cy="37" r="11" fill={c.body} />
            <circle cx="28" cy="60" r="20" fill={c.body} />
            <circle cx="19" cy="55" r="3.8" fill={c.eye} />
            <circle cx="37" cy="55" r="3.8" fill={c.eye} />
        </svg>
    );
}
