export default function WaveDivider({ flip = false, color = "var(--ivory)" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg
        className="relative block w-[200%] h-20 animate-wave"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C300,120 600,0 1200,60 C1800,120 2100,0 2400,60 L2400,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
