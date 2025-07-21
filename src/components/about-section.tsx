"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ctaMousePosition, setCtaMousePosition] = useState({ x: 0, y: 0 });
  const [isCtaHovering, setIsCtaHovering] = useState(false);
  const [isCtaTransitioning, setIsCtaTransitioning] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update posisi cursor secara langsung untuk responsivitas maksimal
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsHovering(true);
      setIsTransitioning(false);
    }, 50);
  };

  const handleMouseLeave = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsHovering(false);
      setIsTransitioning(false);
    }, 50);
  };

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update posisi cursor secara langsung untuk responsivitas maksimal
    setCtaMousePosition({ x, y });
  };

  const handleCtaMouseEnter = () => {
    setIsCtaTransitioning(true);
    setTimeout(() => {
      setIsCtaHovering(true);
      setIsCtaTransitioning(false);
    }, 50);
  };

  const handleCtaMouseLeave = () => {
    setIsCtaTransitioning(true);
    setTimeout(() => {
      setIsCtaHovering(false);
      setIsCtaTransitioning(false);
    }, 50);
  };
  return (
    <section className="relative w-full content-above-gradient">
      <div className="relative z-10">
        {/* About Section Content */}
        <div className="py-24 relative" style={{ isolation: "isolate" }}>
          {/* Network Graphic - Absolute positioned to the right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[70vw] h-full flex items-center justify-end"
            style={{ zIndex: -1 }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 700 700"
              fill="none"
              className="opacity-70"
              style={{ maxWidth: "800px" }}
            >
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient
                  id="nodeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Connection Lines - More connections for complexity */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none">
                <line x1="150" y1="200" x2="300" y2="100" />
                <line x1="200" y1="200" x2="100" y2="400" />
                <line x1="200" y1="200" x2="450" y2="350" />
                <line x1="450" y1="350" x2="300" y2="550" />
                <line x1="450" y1="350" x2="600" y2="250" />
                <line x1="300" y1="550" x2="500" y2="600" />
                <line x1="100" y1="400" x2="300" y2="550" />
                <line x1="50" y1="100" x2="200" y2="200" />
                <line x1="650" y1="500" x2="450" y2="350" />
                <line x1="550" y1="150" x2="600" y2="250" />
                <line x1="350" y1="50" x2="200" y2="200" />
                <line x1="450" y1="350" x2="350" y2="50" />
                <line x1="100" y1="400" x2="50" y2="500" />
                <line x1="500" y1="600" x2="650" y2="500" />
                <line x1="50" y1="500" x2="300" y2="550" />
                <line x1="600" y1="250" x2="650" y2="500" />
                <line x1="150" y1="200" x2="250" y2="300" />
                <line x1="250" y1="300" x2="350" y2="400" />
                <line x1="350" y1="400" x2="450" y2="350" />
                <line x1="250" y1="300" x2="150" y2="400" />

                {/* Extended connections that go beyond the page */}
                <line x1="650" y1="500" x2="750" y2="450" />
                <line x1="600" y1="250" x2="750" y2="200" />
                <line x1="500" y1="600" x2="750" y2="650" />
                <line x1="50" y1="100" x2="-50" y2="150" />
                <line x1="100" y1="400" x2="-50" y2="350" />
                <line x1="50" y1="500" x2="-50" y2="550" />
                <line x1="200" y1="200" x2="100" y2="50" />
                <line x1="450" y1="350" x2="550" y2="200" />
                <line x1="300" y1="550" x2="400" y2="650" />
                <line x1="100" y1="400" x2="200" y2="550" />

                {/* Additional connections extending to the left (behind Platform ini hadir) */}
                <line x1="150" y1="200" x2="50" y2="250" />
                <line x1="250" y1="300" x2="150" y2="350" />
                <line x1="350" y1="400" x2="250" y2="450" />
                <line x1="200" y1="200" x2="100" y2="150" />
                <line x1="300" y1="100" x2="200" y2="50" />
                <line x1="450" y1="350" x2="350" y2="300" />
                <line x1="550" y1="150" x2="450" y2="100" />
                <line x1="650" y1="500" x2="550" y2="450" />
                <line x1="500" y1="600" x2="400" y2="550" />
                <line x1="600" y1="250" x2="500" y2="200" />

                {/* Additional connections for extended nodes */}
                <line x1="750" y1="450" x2="700" y2="600" />
                <line x1="750" y1="200" x2="700" y2="100" />

                <line x1="-50" y1="150" x2="-20" y2="100" />
                <line x1="-50" y1="350" x2="-20" y2="600" />
                <line x1="-50" y1="550" x2="-20" y2="600" />
                <line x1="100" y1="50" x2="-20" y2="100" />
                <line x1="550" y1="200" x2="700" y2="100" />
                <line x1="400" y1="650" x2="100" y2="650" />
                <line x1="200" y1="550" x2="100" y2="650" />
                <line x1="750" y1="300" x2="700" y2="100" />
                <line x1="-30" y1="250" x2="-20" y2="100" />

                <line x1="50" y1="100" x2="-20" y2="100" />
                <line x1="600" y1="650" x2="700" y2="600" />
                <line x1="100" y1="650" x2="600" y2="650" />
              </g>

              {/* Large Nodes with gradient and stronger glow */}
              <g filter="url(#glow)">
                <circle
                  cx="200"
                  cy="200"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="450"
                  cy="350"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="300"
                  cy="550"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="100"
                  cy="400"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="600"
                  cy="250"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="500"
                  cy="600"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="500"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx="650"
                  cy="500"
                  r="12"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="3"
                />

                {/* Extended large nodes outside the viewport */}
                <circle
                  cx="750"
                  cy="300"
                  r="10"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <circle
                  cx="-30"
                  cy="250"
                  r="10"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="2.5"
                />

                <circle
                  cx="50"
                  cy="100"
                  r="10"
                  fill="url(#nodeGradient)"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </g>

              {/* Medium Nodes with stronger stroke */}
              <g filter="url(#glow)">
                <circle
                  cx="150"
                  cy="200"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="250"
                  cy="200"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="250"
                  cy="300"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="150"
                  cy="300"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="350"
                  cy="400"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="100"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="350"
                  cy="50"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="550"
                  cy="150"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Extended medium nodes outside the viewport */}
                <circle
                  cx="700"
                  cy="100"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="700"
                  cy="600"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="-20"
                  cy="100"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="-20"
                  cy="600"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="100"
                  cy="650"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="600"
                  cy="650"
                  r="8"
                  fill="rgba(255,255,255,0.9)"
                  stroke="white"
                  strokeWidth="2"
                />
              </g>

              {/* Small Nodes */}
              <g filter="url(#glow)">
                <circle
                  cx="120"
                  cy="120"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="280"
                  cy="120"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="380"
                  cy="200"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="380"
                  cy="300"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="280"
                  cy="380"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="120"
                  cy="380"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="20"
                  cy="200"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="20"
                  cy="300"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="480"
                  cy="450"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="580"
                  cy="350"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="680"
                  cy="450"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />

                {/* Extended nodes outside the viewport */}
                <circle
                  cx="750"
                  cy="450"
                  r="6"
                  fill="rgba(255,255,255,0.6)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle
                  cx="750"
                  cy="200"
                  r="6"
                  fill="rgba(255,255,255,0.6)"
                  stroke="white"
                  strokeWidth="1.5"
                />

                <circle
                  cx="-50"
                  cy="150"
                  r="6"
                  fill="rgba(255,255,255,0.6)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle
                  cx="-50"
                  cy="350"
                  r="6"
                  fill="rgba(255,255,255,0.6)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle
                  cx="-50"
                  cy="550"
                  r="6"
                  fill="rgba(255,255,255,0.6)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle
                  cx="100"
                  cy="50"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="550"
                  cy="200"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="400"
                  cy="650"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="550"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />

                {/* Additional nodes extending to the left (behind Platform ini hadir) */}
                <circle
                  cx="50"
                  cy="250"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="150"
                  cy="350"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="250"
                  cy="450"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="100"
                  cy="150"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="50"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="350"
                  cy="300"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="450"
                  cy="100"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="550"
                  cy="450"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="400"
                  cy="550"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="500"
                  cy="200"
                  r="5"
                  fill="rgba(255,255,255,0.7)"
                  stroke="white"
                  strokeWidth="1"
                />
              </g>

              {/* User Icons in some large nodes */}
              <g fill="rgba(255,255,255,0.95)">
                <circle
                  cx="200"
                  cy="200"
                  r="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                />
                <circle cx="200" cy="200" r="4" />
                <path
                  d="M200 195 Q200 190 200 185"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M195 188 Q190 185 185 185"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M205 188 Q210 185 215 185"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>

              <g fill="rgba(255,255,255,0.95)">
                <circle
                  cx="450"
                  cy="350"
                  r="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                />
                <circle cx="450" cy="350" r="4" />
                <path
                  d="M450 345 Q450 340 450 335"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M445 338 Q440 335 435 335"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M455 338 Q460 335 465 335"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>

              <g fill="rgba(255,255,255,0.95)">
                <circle
                  cx="100"
                  cy="400"
                  r="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                />
                <circle cx="100" cy="400" r="4" />
                <path
                  d="M100 395 Q100 390 100 385"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M95 388 Q90 385 85 385"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M105 388 Q110 385 115 385"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>
            </svg>
          </div>

          {/* Text Content - Positioned to the left */}
          <div className="w-full px-4 sm:px-8 md:px-16 flex justify-center">
            <div className="w-full relative" style={{ zIndex: 10 }}>
              <div
                className="relative rounded-2xl border border-white/20 p-4 md:p-8 cursor-pointer overflow-hidden"
                style={{
                  maxWidth: "840px",
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Gradient overlay yang mengikuti cursor */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 30%, rgba(236, 72, 153, 0.2) 60%, transparent 100%)`,
                    opacity: isHovering ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                />
                {/* Content */}
                <div className="relative z-10">
                  <h2
                    style={{
                      fontFamily: "Albert Sans, Arial, sans-serif",
                      fontWeight: 250,
                      fontStyle: "thin",
                      fontSize: "clamp(2rem, 6vw, 60px)",
                      lineHeight: "clamp(2.5rem, 7vw, 70px)",
                      letterSpacing: "-0.05em",
                      color: "#FFFBFB",
                      margin: "0 0 30px 0",
                    }}
                  >
                    Platform ini hadir untuk menghubungkan Creator
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, Arial, sans-serif",
                      fontWeight: 300,
                      fontStyle: "light",
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      lineHeight: "150%",
                      letterSpacing: "-0.01em",
                      color: "#FFFFFF",
                      background: "transparent",
                      marginBottom: "32px",
                    }}
                  >
                    dari berbagai bidang dengan para pengguna yang mencari
                    inspirasi, ide, dan solusi melalui workflow yang praktis.
                    Kami percaya, kolaborasi kreatif akan lebih mudah ketika
                    prosesnya terbuka, sederhana, dan saling berbagi.
                    <br />
                    <br />
                    Di sini, Anda bisa menemukan kreator berbakat, menjelajahi
                    berbagai workflow, hingga membangun proses kerja yang lebih
                    terarah dan efisien.
                  </p>
                  <div className="flex justify-start">
                    <a
                      href="/creators"
                      className="btn-jelajah flex items-center gap-3"
                      style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}
                    >
                      Connect With Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits Content */}
        <div
          className="w-full mt-24 px-4 sm:px-8 md:px-16 relative"
          style={{ isolation: "isolate" }}
        >
          {/* SVG Ellipse tipis untuk menghubungkan icon centang - dipindah ke belakang */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -10 }}
          >
            <svg
              width="900"
              height="900"
              viewBox="0 0 900 900"
              fill="none"
              className="absolute -left-[150px] top-[40px]"
              style={{ pointerEvents: "none", opacity: 0.44 }}
            >
              <defs>
                <linearGradient
                  id="ellipseStroke"
                  x1="0"
                  y1="0"
                  x2="900"
                  y2="900"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9460CD" />
                  <stop offset="1" stopColor="#3D1654" />
                </linearGradient>
              </defs>
              <ellipse
                cx="450"
                cy="450"
                rx="440"
                ry="440"
                fill="none"
                stroke="url(#ellipseStroke)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Konten di atas SVG */}
          <div
            className="flex flex-col items-start w-full text-left relative"
            style={{ zIndex: 10 }}
          >
            <div className="mb-12 w-full">
              <h3
                className="text-5xl font-thin text-white/80 mb-4"
                style={{ fontFamily: "Albert Sans, Arial, sans-serif" }}
              >
                Key Benefits
              </h3>
              <p className="text-lg text-white/80 max-w-2xl">
                Kami menghadirkan platform yang memudahkan Anda untuk menemukan
                kreator, menjelajahi workflow, dan membangun proses kerja yang
                lebih efektif.
              </p>
            </div>
            <div className="flex flex-col gap-16 w-full">
              {/* Item 1 */}
              <div
                className="flex items-start gap-4 relative"
                style={{ marginLeft: "clamp(20px, 5vw, 60px)" }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#C084FC] flex items-center justify-center shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#C084FC" />
                    <path
                      d="M6 10.5L9 13.5L14 8.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-white/90 font-normal mb-1">
                    Share Your Workflow
                  </div>
                  <div className="font-bold text-white text-lg leading-snug">
                    Bagikan workflow Anda untuk membantu kreator lain
                    <br />
                    menemukan cara kerja yang lebih efisien dan terarah.
                  </div>
                </div>
              </div>
              {/* Item 2 */}
              <div
                className="flex items-start gap-4 relative"
                style={{ marginLeft: "clamp(40px, 10vw, 160px)" }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#C084FC] flex items-center justify-center shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#C084FC" />
                    <path
                      d="M6 10.5L9 13.5L14 8.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-white/90 font-normal mb-1">
                    Access Ready-to-Use Workflows
                  </div>
                  <div className="font-bold text-white text-lg leading-snug">
                    Jelajahi berbagai workflow yang praktis dan dapat langsung
                    <br />
                    Anda terapkan dalam proses kerja Anda.
                  </div>
                </div>
              </div>
              {/* Item 3 */}
              <div
                className="flex items-start gap-4 relative"
                style={{ marginLeft: "clamp(60px, 15vw, 260px)" }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#C084FC] flex items-center justify-center shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#C084FC" />
                    <path
                      d="M6 10.5L9 13.5L14 8.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-white/90 font-normal mb-1">
                    Connect & Collaborate
                  </div>
                  <div className="font-bold text-white text-lg leading-snug">
                    Bangun koneksi dan kolaborasi dengan kreator lain untuk
                    <br />
                    mengembangkan proyek yang lebih maksimal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action Section */}
      <div
        className="w-full mt-24 px-4 sm:px-8 md:px-16 py-16 flex justify-center relative"
        style={{ background: "transparent", isolation: "isolate", zIndex: 20 }}
      >
        <div
          className="relative rounded-2xl border border-white/20 p-4 md:p-8 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden"
          style={{
            maxWidth: "840px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            zIndex: 30,
          }}
          onMouseMove={handleCtaMouseMove}
          onMouseEnter={handleCtaMouseEnter}
          onMouseLeave={handleCtaMouseLeave}
        >
          {/* Gradient overlay yang mengikuti cursor */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${ctaMousePosition.x}px ${ctaMousePosition.y}px, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 30%, rgba(236, 72, 153, 0.2) 60%, transparent 100%)`,
              opacity: isCtaHovering ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
          {/* Content */}
          <div
            className="relative flex flex-col md:flex-row items-center justify-between gap-8 w-full"
            style={{ zIndex: 40 }}
          >
            <div className="flex flex-col items-start justify-center text-center md:text-left">
              <div
                style={{
                  fontFamily: "Albert Sans, Arial, sans-serif",
                  fontWeight: 200,
                  fontSize: "clamp(1.25rem, 4vw, 28px)",
                  lineHeight: "120%",
                  color: "#CFC6E2",
                  letterSpacing: "-0.01em",
                  maxWidth: "500px",
                  textAlign: "center",
                }}
              >
                Sudah 3.000+ orang bergabung.
                <br />
                Ayo, mulai perjalanan Anda hari ini!
              </div>
            </div>
            <a
              href="/auth"
              className="rounded-full px-6 py-3 tablet:px-8 tablet:py-3 lg:px-10 lg:py-4 text-sm tablet:text-base font-semibold flex items-center gap-2 tablet:gap-3 hover:scale-105 w-full md:w-auto justify-center"
              style={{
                background: "linear-gradient(90deg, #D900FF 0%, #9500FF 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px 0 #9500FF66",
                minWidth: "160px",
                justifyContent: "center",
                transition: "all 0.2s ease",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 20px 0 #9500FF88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px 0 #9500FF66";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Join Community
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 tablet:w-5 tablet:h-5 lg:w-6 lg:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.75h2.25A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H16.5m-6-4.5 3-3m0 0-3-3m3 3H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
