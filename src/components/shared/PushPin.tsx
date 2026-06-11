import "../../assets/components.scss";

type Props = {
    color?: string;
    glow?: boolean;
};

export default function PushPin({ color = 'var(--accent)', glow = false }: Props) {
    return (
        <div className="pushpin">
            <div
                className={`pushpin-head${glow ? ' pushpin-head-glow' : ''}`}
                style={{
                    background: `radial-gradient(circle at 36% 32%, rgba(255,255,255,0.46) 0%, transparent 55%), ${color}`,
                    boxShadow: glow
                        ? `0 0 0 3px ${color}40, 0 0 10px ${color}80, 0 2px 7px rgba(0,0,0,0.28), inset 0 1px 3px rgba(255,255,255,.4)`
                        : `0 2px 7px rgba(0,0,0,0.24), inset 0 1px 3px rgba(255,255,255,.38)`,
                }}
            >
                <div className="pushpin-highlight" />
            </div>
            <div className="pushpin-needle" />
        </div>
    );
}
