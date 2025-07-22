import React from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import FeaturedWorkflows from "@/components/featured-workflows";
import FeaturedCreators from "@/components/featured-creators";
import GradientCircle from "@/components/GradientCircle";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Gradient circles langsung di halaman */}
      {/* Circle Gradient 1: Diatas, menyentuh header navbar, judul dan dibawahnya */}
      <GradientCircle
        type="hero"
        style={{
          top: "50px",
          left: "35%",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      {/* Circle Gradient 2: ditengah, di antara workflow dan meet creator */}

      {/* Circle Gradient 3: di bawah, di key benefit agak bawah */}
      <GradientCircle
        type="footer"
        style={{
          top: "3000px",
          left: "70%",
          transform: "translateX(-80%)",
          zIndex: 1,
          width: "40rem",
          height: "40rem",
          opacity: "0.3",
        }}
      />
      <GradientCircle
        type="footer"
        style={{
          top: "4100px",
          left: "20%",
          transform: "translateX(-80%)",
          zIndex: 1,
          width: "40rem",
          height: "40rem",
          opacity: "0.3%",
        }}
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
