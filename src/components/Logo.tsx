interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer compass circle with gradient */}
      <defs>
        <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(262, 85%, 58%)" />
          <stop offset="50%" stopColor="hsl(280, 80%, 65%)" />
          <stop offset="100%" stopColor="hsl(47, 96%, 53%)" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(262, 85%, 68%)" />
          <stop offset="100%" stopColor="hsl(262, 85%, 48%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Compass outer ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#compassGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
      
      {/* Compass inner ring */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="url(#compassGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Shield shape for truth/verification */}
      <path
        d="M50 15 L70 25 L70 45 Q70 60 50 75 Q30 60 30 45 L30 25 Z"
        fill="url(#shieldGradient)"
        filter="url(#glow)"
      />

      {/* Checkmark inside shield */}
      <path
        d="M42 45 L47 52 L58 38"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Compass needle pointing to truth (North) */}
      <g transform="translate(50, 50)">
        {/* North needle (red/primary) */}
        <path
          d="M0,-25 L3,-5 L0,-8 L-3,-5 Z"
          fill="hsl(0, 84%, 60%)"
        />
        {/* South needle (white) */}
        <path
          d="M0,25 L3,5 L0,8 L-3,5 Z"
          fill="white"
          opacity="0.8"
        />
        {/* Center dot */}
        <circle cx="0" cy="0" r="3" fill="hsl(262, 85%, 58%)" />
      </g>

      {/* Cardinal direction markers */}
      <text x="50" y="12" textAnchor="middle" fill="url(#compassGradient)" fontSize="10" fontWeight="bold">N</text>
      <text x="88" y="54" textAnchor="middle" fill="url(#compassGradient)" fontSize="8" fontWeight="bold">E</text>
      <text x="50" y="92" textAnchor="middle" fill="url(#compassGradient)" fontSize="8" fontWeight="bold">S</text>
      <text x="12" y="54" textAnchor="middle" fill="url(#compassGradient)" fontSize="8" fontWeight="bold">W</text>
    </svg>
  );
}