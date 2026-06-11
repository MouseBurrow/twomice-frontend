type Props = {
    color?: string;
    glow?: boolean;
};

export default function BallPin({ color = 'var(--accent)', glow = false }: Props) {
    return (
        <div style={{
            position: 'absolute', top: -24, left: '50%',
            transform: 'translateX(-50%)', zIndex: 3, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
            <div style={{
                width: 18, height: 18, borderRadius: '50%', position: 'relative', flexShrink: 0,
                background: color,
                border: '1.5px solid rgba(0,0,0,0.18)',
                boxShadow: '0 2px 8px rgba(0,0,0,.26), inset 0 2px 5px rgba(255,255,255,.52), inset -1px -2px 4px rgba(0,0,0,.12)',
            }}>
                <div style={{
                    position: 'absolute', top: 4, left: 4,
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.56)',
                }} />
            </div>
            <div style={{
                width: 2.5, height: 10,
                background: 'rgba(0,0,0,0.24)',
                borderRadius: '0 0 1px 1px',
                marginTop: -1,
            }} />
            <div style={{
                width: 0, height: 0,
                borderLeft: '3.5px solid transparent',
                borderRight: '3.5px solid transparent',
                borderTop: '6px solid rgba(0,0,0,0.24)',
            }} />
        </div>
    );
}
