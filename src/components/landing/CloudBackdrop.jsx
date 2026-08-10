import React from "react";

const CLOUD_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/0/0d/Clouds_%28transparent%29.png",
  "https://upload.wikimedia.org/wikipedia/commons/7/7e/Cloud_PNG_Image.png",
  "https://upload.wikimedia.org/wikipedia/commons/5/55/Set_of_soft_clouds.png",
];

export default function CloudBackdrop() {
  const clouds = [
    { top: "2%", left: "1%", width: "440px", img: 0, opacity: 0.85 },
    { top: "8%", left: "55%", width: "360px", img: 1, opacity: 0.7 },
    { top: "26%", left: "18%", width: "300px", img: 2, opacity: 0.6 },
    { top: "34%", left: "68%", width: "400px", img: 0, opacity: 0.75 },
    { top: "50%", left: "5%", width: "380px", img: 1, opacity: 0.6 },
    { top: "58%", left: "48%", width: "320px", img: 2, opacity: 0.5 },
    { top: "72%", left: "22%", width: "420px", img: 0, opacity: 0.55 },
    { top: "82%", left: "60%", width: "340px", img: 1, opacity: 0.45 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {clouds.map((c, i) => (
        <img
          key={i}
          src={CLOUD_IMAGES[c.img]}
          alt=""
          draggable="false"
          className="absolute select-none"
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