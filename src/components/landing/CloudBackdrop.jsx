import React from "react";

const CLOUD_IMG = "https://media.base44.com/images/public/6a78f94b469a2985507520df/b074b0bdf_generated_image.png";

export default function CloudBackdrop() {
  const clouds = [
    { top: "4%", left: "-6%", width: "240px", opacity: 0.8, mobile: true },
    { top: "38%", left: "52%", width: "210px", opacity: 0.65, mobile: true },
    { top: "74%", left: "-4%", width: "230px", opacity: 0.55, mobile: true },
    { top: "12%", left: "60%", width: "280px", opacity: 0.7, mobile: false },
    { top: "22%", left: "4%", width: "260px", opacity: 0.6, mobile: false },
    { top: "26%", left: "66%", width: "300px", opacity: 0.65, mobile: false },
    { top: "50%", left: "8%", width: "320px", opacity: 0.6, mobile: false },
    { top: "56%", left: "62%", width: "280px", opacity: 0.7, mobile: false },
    { top: "84%", left: "58%", width: "300px", opacity: 0.5, mobile: false },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          className={`absolute ${c.mobile ? "" : "hidden md:block"}`}
          style={{ top: c.top, left: c.left, width: c.width, opacity: c.opacity }}
        >
          <img src={CLOUD_IMG} alt="" className="w-full h-auto select-none" draggable="false" />
        </div>
      ))}
    </div>
  );
}