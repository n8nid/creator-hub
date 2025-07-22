import React from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import FeaturedWorkflows from "@/components/featured-workflows";
import FeaturedCreators from "@/components/featured-creators";
import GradientCircle from "@/components/GradientCircle";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative pt-16">
      {/* Gradient circles langsung di halaman */}
      {/* Circle Gradient 1: Diatas, menyentuh header navbar, judul dan dibawahnya */}
      <GradientCircle type="hero" className="gradient-circle-hero" />

      {/* Circle Gradient 2: ditengah, di antara workflow dan meet creator */}
      <GradientCircle type="about" className="gradient-circle-about" />

      {/* Circle Gradient 3: di bawah, di key benefit agak bawah */}
      <GradientCircle type="footer" className="gradient-circle-footer" />

      <main className="flex-grow relative z-10">
        <HeroSection />
        <FeaturedWorkflows />
        <FeaturedCreators />
        <AboutSection />
      </main>
    </div>
  );
}
