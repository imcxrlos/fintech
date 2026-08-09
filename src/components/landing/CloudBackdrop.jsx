import React from "react";

export default function CloudBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 55% 45% at 15% 15%, #cce8d6 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 85% 10%, #d1d5f2 0%, transparent 55%),
          radial-gradient(ellipse 45% 35% at 50% 45%, #e8e0f1 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 90% 55%, #d1d5f2 0%, transparent 55%),
          radial-gradient(ellipse 45% 35% at 10% 65%, #cce8d6 0%, transparent 55%),
          radial-gradient(ellipse 40% 30% at 55% 85%, #e8e0f1 0%, transparent 50%),
          radial-gradient(ellipse 35% 25% at 80% 80%, #d1d5f2 0%, transparent 45%),
          #f4f7f6
        `
      }}
    >
      <div
        className="atmosphere-drift absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, #cce8d6 0%, transparent 35%),
            radial-gradient(circle at 70% 30%, #d1d5f2 0%, transparent 35%),
            radial-gradient(circle at 50% 60%, #e8e0f1 0%, transparent 30%),
            radial-gradient(circle at 20% 80%, #cce8d6 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, #d1d5f2 0%, transparent 30%)
          `,
          filter: "blur(60px)",
          opacity: 0.7
        }}
      />
    </div>
  );
}