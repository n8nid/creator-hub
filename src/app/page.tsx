import React from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import FeaturedWorkflows from "@/components/featured-workflows";
import FeaturedCreators from "@/components/featured-creators";
import GradientCircle from "@/components/GradientCircle";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Responsive Gradient Circles */}
      {/* Hero Circle - Positioned by CSS */}
      <GradientCircle type="hero" />

      {/* About Circle - Positioned by CSS */}
      <GradientCircle type="about" />

      {/* Footer Circles - Custom positioning for multiple circles */}
      <GradientCircle
        type="footer"
        className="gradient-circle-footer-1"
        style={{ zIndex: 1 }}
      />
      <GradientCircle
        type="footer"
        className="gradient-circle-footer-2"
        style={{ zIndex: 1 }}
      />

      <main className="flex-grow relative z-10">
        <HeroSection />
        <FeaturedWorkflows />
        <FeaturedCreators />
        <AboutSection />
      </main>
    </div>
  );
}
