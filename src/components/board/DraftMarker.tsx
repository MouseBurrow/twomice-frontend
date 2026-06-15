type Props = { color: string };

export default function DraftMarker({ color }: Props) {
  return (
    <div className="draft-marker" style={{ '--draft-clr': color } as React.CSSProperties}>
      <div className="draft-marker-ring">
        <div className="draft-marker-dot" />
      </div>
      <div className="draft-marker-needle" />
    </div>
  );
}
