"use client";

import React from "react";
import Link from "next/link";
import GradientCircle from "@/components/GradientCircle";
import AboutSection from "@/components/about-section";

const ConnectWithUsPage = () => {
  return (
    <section className="relative">
      {/* Circle Gradient Pertama - di area gambar SVG (kanan) */}
      <GradientCircle
        type="hero"
        style={{
          top: "15vh",
          left: "80vw",
          transform: "translateX(50%)",
          zIndex: -1,
        }}
      />

      {/* Circle Gradient Kedua - di area Key Benefits (agak bawah sebelah kiri) */}
      <GradientCircle
        type="hero"
        style={{
          top: "100vh",
          left: "20vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      <AboutSection />
    </section>
  );
};

export default ConnectWithUsPage;
