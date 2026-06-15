type Props = { className?: string };

export default function RightArrow({ className }: Props) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
