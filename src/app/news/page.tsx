import { Metadata } from "next";
import GradientCircle from "@/components/GradientCircle";

export const metadata: Metadata = {
  title: "Berita - N8N Indonesia Community",
  description: "Berita terbaru dan informasi seputar N8N Indonesia Community",
};

export default function NewsPage() {
  return (
    <div className="text-white content-above-gradient relative">
      {/* Gradient circle langsung di halaman */}
      <GradientCircle
        type="hero"
        style={{
          top: "10vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      {/* Gradient circle kedua di area kanan */}
      <GradientCircle
        type="hero"
        style={{
          top: "120vh",
          left: "80vw",
          transform: "translateX(50%)",
          zIndex: -1,
        }}
      />
      <div className="w-full container-box relative z-10 mb-32">
        {/* HERO SECTION - 2 COLUMN LAYOUT */}
        <div className="w-full pt-32 md:pt-64 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* KOLOM KIRI: Judul + Garis + Deskripsi */}
          <div className="flex flex-col items-start flex-1 lg:max-w-[45%]">
            {/* Judul */}
            <div className="flex flex-col items-start mb-6">
              <h1 className="hero-title-main">N8N</h1>
              <h2 className="hero-title-sub">News</h2>
            </div>

            {/* Garis Horizontal */}
            <div className="w-24 h-0.5 bg-white mb-8"></div>

            {/* Deskripsi */}
            <div className="hero-description max-w-lg">
              Ikuti event meetup komunitas dan dapatkan update terbaru dari N8N
              ID. Tetap terhubung dan berkembang bersama para kreator di sini!
            </div>
          </div>

          {/* KOLOM KANAN: Carousel Featured Content */}
          <div className="flex-1 lg:max-w-[55%] w-full">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
              {/* Carousel Image */}
              <div className="relative h-80 lg:h-96">
                <img
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"
                  alt="N8N Community Event"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="w-8 h-0.5 bg-white mb-3"></div>
                  <p className="text-white text-sm lg:text-base leading-relaxed">
                    1 juta orang lebih pengguna n8n di Indonesia menjadi alasan
                    dibuatnya website community n8n Indonesia
                  </p>
                </div>

                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING EVENT SECTION */}
        <div className="mt-28 md:mt-32">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Upcoming Event
          </h2>

          {/* Horizontal Scrollable Events */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-gray-800/80 to-gray-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:from-gray-700/90 hover:to-gray-500/90 transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-gray-600/80 to-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:from-gray-500/90 hover:to-gray-700/90 transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Events Container */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4">
              {/* Event Card 1 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400"
                    alt="Meet Up Perdana n8n Community Regional Surabaya"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Meet Up Perdana n8n
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Community Regional Surabaya
                  </p>
                  <p className="text-sm text-gray-500">
                    diadakan pada 25 September 2025
                  </p>
                </div>
              </div>

              {/* Event Card 2 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
                    alt="Workshop n8n Automation untuk Beginners"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Workshop n8n Automation
                  </h3>
                  <p className="text-gray-600 mb-3">untuk Beginners</p>
                  <p className="text-sm text-gray-500">
                    diadakan pada 15 Oktober 2025
                  </p>
                </div>
              </div>

              {/* Event Card 3 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
                    alt="N8N Community Gathering Jakarta"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    N8N Community Gathering
                  </h3>
                  <p className="text-gray-600 mb-3">Jakarta</p>
                  <p className="text-sm text-gray-500">
                    diadakan pada 30 Oktober 2025
                  </p>
                </div>
              </div>

              {/* Event Card 4 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
                    alt="Advanced N8N Workflows Webinar"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Advanced N8N Workflows
                  </h3>
                  <p className="text-gray-600 mb-3">Webinar</p>
                  <p className="text-sm text-gray-500">
                    diadakan pada 12 November 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEWS & REPORT SECTION */}
        <div className="mt-20">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            News & Report
          </h2>

          {/* Horizontal Scrollable News */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-gray-800/80 to-gray-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:from-gray-700/90 hover:to-gray-500/90 transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-gray-600/80 to-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:from-gray-500/90 hover:to-gray-700/90 transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* News Container */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4">
              {/* News Card 1 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
                    alt="Pengguna n8n Community Indonesia mencapai 500ribu"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Pengguna n8n Community Indonesia
                  </h3>
                  <p className="text-gray-600 mb-3">mencapai 500ribu</p>
                  <p className="text-sm text-gray-500">
                    diposting pada 1 Agustus 2025
                  </p>
                </div>
              </div>

              {/* News Card 2 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
                    alt="Tips dan Trik Optimasi Workflow n8n"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Tips dan Trik Optimasi
                  </h3>
                  <p className="text-gray-600 mb-3">Workflow n8n</p>
                  <p className="text-sm text-gray-500">
                    diposting pada 15 Agustus 2025
                  </p>
                </div>
              </div>

              {/* News Card 3 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400"
                    alt="N8N Indonesia Community Resmi Diluncurkan"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    N8N Indonesia Community
                  </h3>
                  <p className="text-gray-600 mb-3">Resmi Diluncurkan</p>
                  <p className="text-sm text-gray-500">
                    diposting pada 20 Agustus 2025
                  </p>
                </div>
              </div>

              {/* News Card 4 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
                    alt="Cara Membuat Workflow Automation Pertama"
                    className="w-full h-full object-cover"
                  />
                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200">
                      <span>Lihat</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Cara Membuat Workflow
                  </h3>
                  <p className="text-gray-600 mb-3">Automation Pertama</p>
                  <p className="text-sm text-gray-500">
                    diposting pada 25 Agustus 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
