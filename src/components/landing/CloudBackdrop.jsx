import React from "react";

export default function CloudBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="cloud cloud-three" />
      <div className="cloud cloud-four" />
      <div className="cloud cloud-five" />
      <div className="cloud cloud-six" />
      <div className="cloud cloud-dark-one" />
      <div className="cloud cloud-dark-two" />
      <div className="absolute inset-0 bg-background/45" />
    </div>
  );
}