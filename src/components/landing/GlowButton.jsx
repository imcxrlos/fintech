import React from "react";

export default function GlowButton({ children, onClick, disabled, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`glow-button ${className}`}
    >
      <span className="glow-button__blob" />
      <span className="glow-button__inner">{children}</span>
    </button>
  );
}