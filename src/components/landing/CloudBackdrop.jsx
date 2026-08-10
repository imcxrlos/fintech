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
        <radialGradient id={`cg-${className}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="70%" stopColor="#f4f7fb" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e6ecf3" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <path
        d="M55 110 C25 110 10 90 18 70 C8 58 18 38 38 42 C42 22 68 18 78 32 C86 14 112 14 118 36 C138 28 160 42 152 64 C168 68 168 92 150 98 C152 106 138 112 122 108 C108 116 82 116 68 110 Z"
        fill={`url(#cg-${className})`}
      />
    </svg>
  );
}

export default function CloudBackdrop() {
  const clouds = [
    { top: "4%", left: "3%", width: "420px", opacity: 0.9 },
    { top: "12%", left: "58%", width: "340px", opacity: 0.7 },
    { top: "30%", left: "22%", width: "280px", opacity: 0.6 },
    { top: "38%", left: "72%", width: "380px", opacity: 0.75 },
    { top: "55%", left: "6%", width: "360px", opacity: 0.65 },
    { top: "62%", left: "48%", width: "300px", opacity: 0.55 },
    { top: "74%", left: "28%", width: "400px", opacity: 0.6 },
    { top: "84%", left: "62%", width: "320px", opacity: 0.5 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {clouds.map((c, i) => (
        <CloudShape
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}