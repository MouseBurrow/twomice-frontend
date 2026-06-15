type Props = { className?: string };

export default function ArrowLeft({ className }: Props) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
