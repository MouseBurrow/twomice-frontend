type Props = { className?: string; color?: string };

export default function Pencil({ className, color }: Props) {
  return (
    <svg className={className} width="11" height="11" viewBox="0 0 14 14" fill="none" style={color ? { color } : undefined}>
      <path d="M9.8 1.4l2.8 2.8L3.8 13H1v-2.8L9.8 1.4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <path d="M8.4 2.8l2.8 2.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
