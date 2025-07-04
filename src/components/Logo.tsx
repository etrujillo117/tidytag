export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.4142 13L13 21.4142C12.6364 21.7778 12.1304 22 11.5999 22H4C2.89543 22 2 21.1046 2 20V12.4C2 11.8696 2.22219 11.3636 2.58579 11L11 2.58579C11.3636 2.22219 11.8696 2 12.4 2C12.9304 2 13.4364 2.22219 13.8 2.58579L21.4142 10.1716C22.1953 10.9526 22.1953 12.219 21.4142 13Z"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="hsl(var(--background))" />
    </svg>
  );
}
