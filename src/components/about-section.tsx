import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section
      className="relative overflow-hidden w-full"
      style={{ background: "#201A2C" }}
    >
      <div className="ellipse-angular-about" />
      <div className="ellipse-blur-dark" />
      <div>
        {/* About Section Content */}
        <div className="py-24">
          <div className="container mx-auto px-4 flex justify-center">
            <div
              style={{
                maxWidth: "820px",
                textAlign: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <h2
                style={{
                  fontFamily: "Albert Sans, Arial, sans-serif",
                  fontWeight: 250,
                  fontStyle: "thin",
                  fontSize: "80px",
                  lineHeight: "94px",
                  letterSpacing: "-0.05em",
                  color: "#FFFBFB",
                  marginBottom: "40px",
                }}
              >
                Platform ini hadir untuk menghubungkan creator
              </h2>
              <p
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 300,
                  fontStyle: "light",
                  fontSize: "20px",
                  lineHeight: "150%",
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                  background: "transparent",
                  marginBottom: "0",
                }}
              >
                dari berbagai bidang dengan para pengguna yang mencari
                inspirasi, ide, dan solusi melalui workflow yang praktis. Kami
                percaya, kolaborasi kreatif akan lebih mudah ketika prosesnya
                terbuka, sederhana, dan saling berbagi.
                <br />
                <br />
                Di sini, Anda bisa menemukan kreator berbakat, menjelajahi
                berbagai workflow, hingga membangun proses kerja yang lebih
                terarah dan efisien.
              </p>
              <div className="mt-10 flex justify-center">
                <a
                  href="/connect"
                  className="btn-jelajah flex items-center gap-3"
                  style={{ fontSize: "20px" }}
                >
                  Connect With Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits Content */}
        <div className="w-full mt-24 px-4 md:px-12 relative">
          <div className="ellipse-linear-keybenefit" />
          {/* SVG Ellipse tipis untuk menghubungkan icon centang */}
          <svg
            width="900"
            height="900"
            viewBox="0 0 900 900"
            fill="none"
            className="absolute -left-[150px] top-[40px] z-0"
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
          <div className="flex flex-col items-start w-full text-left">
            <div className="mb-12 z-10 w-full">
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
            <div className="flex flex-col gap-16 w-full z-10">
              {/* Item 1 */}
              <div
                className="flex items-start gap-4 relative"
                style={{ marginLeft: "60px" }}
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
                style={{ marginLeft: "160px" }}
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
                style={{ marginLeft: "260px" }}
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
        className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mt-24 px-4 md:px-12 py-16"
        style={{ background: "transparent" }}
      >
        <div className="w-full md:w-auto flex-1 flex flex-col items-center md:items-center justify-center text-center">
          <div
            style={{
              fontFamily: "Albert Sans, Arial, sans-serif",
              fontWeight: 200,
              fontSize: "28px",
              lineHeight: "120%",
              color: "#CFC6E2",
              letterSpacing: "-0.01em",
              maxWidth: "700px",
            }}
          >
            Sudah 3.000+ orang bergabung.
            <br />
            Ayo, mulai perjalanan Anda hari ini!
          </div>
        </div>
        <a
          href="/auth"
          className="rounded-full px-10 py-4 text-base font-semibold flex items-center gap-3 mt-8 md:mt-0 md:ml-8"
          style={{
            background: "linear-gradient(90deg, #D900FF 0%, #9500FF 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px 0 #9500FF33",
            minWidth: "200px",
            justifyContent: "center",
            transition: "filter 0.2s",
          }}
        >
          Join Community
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75h2.25A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H16.5m-6-4.5 3-3m0 0-3-3m3 3H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default AboutSection;
