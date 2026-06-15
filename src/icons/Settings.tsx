type Props = { className?: string };

export default function Settings({ className }: Props) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 1v1.2M7 11.8V13M1 7h1.2M11.8 7H13M2.9 2.9l.85.85M10.25 10.25l.85.85M2.9 11.1l.85-.85M10.25 3.75l.85-.85" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
