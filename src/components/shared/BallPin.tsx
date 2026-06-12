import "../../assets/components.scss";

type Props = {
    color?: string;
    glow?: boolean;
};

export default function BallPin({ color = 'var(--accent)' }: Props) {
    return (
        <div className="ballpin">
            <div className="ballpin-head" style={{ background: color }}>
                <div className="ballpin-specular" />
            </div>
            <div className="ballpin-shaft" style={{ background: `color-mix(in srgb, var(--text-primary) 24%, transparent)` }} />
            <div className="ballpin-tip" style={{ borderTop: `6px solid color-mix(in srgb, var(--text-primary) 24%, transparent)` }} />
        </div>
    );
}
