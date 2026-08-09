import React from "react";

function CloudShape({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`grad-${className}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#f0f6ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#dce8f5" stopOpacity="0.85" />
        </radialGradient>
        <filter id={`shadow-${className}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#shadow-${className})`}>
        <path
          d="M40 90 C18 90 8 74 18 60 C8 46 22 30 40 36 C42 18 68 14 78 30 C86 12 118 14 120 34 C140 28 158 42 150 58 C168 54 178 72 162 86 C168 96 154 100 140 96 L40 96 C28 98 26 94 40 90 Z"
          fill={`url(#grad-${className})`}
        />
        <path
          d="M60 78 C44 78 38 66 48 56 C42 46 54 34 66 40 C70 26 90 24 96 38 C104 24 126 28 126 44 C140 40 150 52 142 64 C152 68 148 80 136 78 L60 78 Z"
          fill="#ffffff"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

export default function CloudBackdrop() {
  const clouds = [
    { top: "5%", left: "3%", width: "320px", delay: "0s", duration: "60s", opacity: 0.9 },
    { top: "12%", left: "45%", width: "260px", delay: "-15s", duration: "70s", opacity: 0.8 },
    { top: "22%", left: "75%", width: "300px", delay: "-30s", duration: "65s", opacity: 0.85 },
    { top: "38%", left: "10%", width: "240px", delay: "-10s", duration: "75s", opacity: 0.75 },
    { top: "45%", left: "55%", width: "340px", delay: "-25s", duration: "60s", opacity: 0.8 },
    { top: "60%", left: "25%", width: "280px", delay: "-40s", duration: "80s", opacity: 0.7 },
    { top: "68%", left: "65%", width: "220px", delay: "-5s", duration: "70s", opacity: 0.75 },
    { top: "82%", left: "15%", width: "300px", delay: "-20s", duration: "65s", opacity: 0.65 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute cloud-drift"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            opacity: c.opacity,
            animation: `cloud-drift ${c.duration} linear infinite`,
            animationDelay: c.delay,
          }}
        >
          <CloudShape className={`cloud-${i}`} style={{ width: "100%", height: "auto" }} />
        </div>
      ))}
    </div>
  );
}