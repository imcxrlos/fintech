import React from "react";

const CLOUD_IMG = "https://media.base44.com/images/public/6a78f94b469a2985507520df/b074b0bdf_generated_image.png";

export default function CloudBackdrop() {
  const clouds = [
    { top: "3%", left: "2%", width: "380px", opacity: 0.85 },
    { top: "10%", left: "55%", width: "300px", opacity: 0.7 },
    { top: "28%", left: "20%", width: "260px", opacity: 0.6 },
    { top: "35%", left: "70%", width: "340px", opacity: 0.75 },
    { top: "52%", left: "8%", width: "320px", opacity: 0.65 },
    { top: "60%", left: "50%", width: "280px", opacity: 0.55 },
    { top: "72%", left: "25%", width: "360px", opacity: 0.6 },
    { top: "82%", left: "60%", width: "300px", opacity: 0.5 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            opacity: c.opacity,
          }}
        >
          <img src={CLOUD_IMG} alt="" className="w-full h-auto select-none" draggable="false" />
        </div>
      ))}
    </div>
  );
}