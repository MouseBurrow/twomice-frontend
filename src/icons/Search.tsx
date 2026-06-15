type Props = { className?: string };

export default function Search({ className }: Props) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
