type Props = { color: string };

export default function DraftMarker({ color }: Props) {
  return (
    <div className="draft-marker">
      <div className="draft-marker-ring" style={{
        border: `2px dashed ${color}`,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}>
        <div className="draft-marker-dot" style={{ background: color }} />
      </div>
      <div className="draft-marker-needle" style={{ background: `color-mix(in srgb, ${color} 28%, transparent)` }} />
    </div>
  );
}
