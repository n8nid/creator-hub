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

  // Minimal inline styling, prioritaskan CSS classes
  const combinedStyle = {
    ...style,
    position: "absolute" as const,
    zIndex: style?.zIndex || "-1",
    pointerEvents: "none" as const,
  };

  return (
    <div
      className={`${getGradientClass()} ${className || ""}`}
      style={combinedStyle}
    />
  );
}
