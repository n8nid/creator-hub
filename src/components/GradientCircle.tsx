import React from "react";

interface GradientCircleProps {
  type: "hero" | "about" | "footer" | "custom";
  className?: string;
  style?: React.CSSProperties;
}

export default function GradientCircle({
  type,
  className,
  style,
}: GradientCircleProps) {
  // Gunakan CSS classes yang sudah ada di globals.css
  const getGradientClass = () => {
    switch (type) {
      case "hero":
        return "ellipse-angular-hero";
      case "about":
        return "ellipse-angular-about";
      case "footer":
        return "ellipse-angular-footer";
      default:
        return "ellipse-angular-hero";
    }
  };

  // Pastikan style yang kita set tidak di-override oleh CSS
  const combinedStyle = {
    ...style,
    position: "absolute" as const, // Kembali ke absolute agar tidak mengikuti scroll
    width: style?.width || "550px",
    height: style?.height || "550px",
    opacity: style?.opacity || "0.4",
    filter: style?.filter || "blur(90px)",
    zIndex: style?.zIndex || "-1", // Gunakan z-index negatif agar benar-benar di belakang
    borderRadius: style?.borderRadius || "50%",
    pointerEvents: style?.pointerEvents || "none",
  };

  return (
    <div
      className={`${getGradientClass()} ${className || ""}`}
      style={combinedStyle}
    />
  );
}
