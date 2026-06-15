type Props = { className?: string; color?: string };

export default function UpArrow({ className, color }: Props) {
  return (
    <svg className={className} width="10" height="7" viewBox="0 0 10 7" fill="none" style={color ? { color } : undefined}>
      <path d="M1 6L5 1.5L9 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
