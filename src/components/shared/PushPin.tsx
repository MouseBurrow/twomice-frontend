type Props = {
    color?: string;
    glow?: boolean;
};

export default function PushPin({ color = 'var(--accent)', glow = false }: Props) {
    return (
        <div style={{
            position: 'absolute', top: -13, left: '50%',
            transform: 'translateX(-50%)', zIndex: 3, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
            <div style={{
                width: 14, height: 14, borderRadius: '50%', position: 'relative',
                background: `radial-gradient(circle at 36% 32%, rgba(255,255,255,0.46) 0%, transparent 55%), ${color}`,
                border: '1.5px solid rgba(0,0,0,0.14)',
                boxShadow: glow
                    ? `0 0 0 3px ${color}40, 0 0 10px ${color}80, 0 2px 7px rgba(0,0,0,0.28), inset 0 1px 3px rgba(255,255,255,.4)`
                    : `0 2px 7px rgba(0,0,0,0.24), inset 0 1px 3px rgba(255,255,255,.38)`,
                animation: glow ? 'hotpulse 2s ease-in-out infinite' : 'none',
            }}>
                <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.42)' }} />
            </div>
            <div style={{ width: 2, height: 6, background: 'rgba(0,0,0,0.2)' }} />
        </div>
    );
}
