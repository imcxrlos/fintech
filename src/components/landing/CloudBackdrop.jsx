import React from "react";

const cloudUrl = "https://media.base44.com/images/public/6a78f94b469a2985507520df/e0eaf9f26_generated_image.png";
export default function CloudBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="atmosphere-drift absolute inset-[-10%]"
        style={{
          backgroundImage: `url(${cloudUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      />
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}