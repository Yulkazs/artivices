export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M24 4 C24 12 20 16 12 16 C20 16 24 20 24 28 C24 20 28 16 36 16 C28 16 24 12 24 4Z" />
        <path d="M24 20 C24 28 20 32 12 32 C20 32 24 36 24 44 C24 36 28 32 36 32 C28 32 24 28 24 20Z" />
        <path d="M8 20 C11 20 13 22 13 25 C13 22 15 20 18 20 C15 20 13 18 13 15 C13 18 11 20 8 20Z" />
        <path d="M30 20 C33 20 35 22 35 25 C35 22 37 20 40 20 C37 20 35 18 35 15 C35 18 33 20 30 20Z" />
      </g>
    </svg>
  );
}
