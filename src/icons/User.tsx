type Props = { className?: string };

export default function User({ className }: Props) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
