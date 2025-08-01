"use client";

import GradientCircle from "@/components/GradientCircle";
import { useFeaturedContent } from "@/hooks/use-featured-content";
import { useEvents } from "@/hooks/use-events";
import { useNews } from "@/hooks/use-news";
import { useState } from "react";

export default function NewsPage() {
  const {
    featuredContent,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedContent();
  const { events, loading: eventsLoading, error: eventsError } = useEvents(10);
  const { news, loading: newsLoading, error: newsError } = useNews(10);

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Carousel navigation
  const nextCarousel = () => {
    if (featuredContent.length > 0) {
      setCurrentCarouselIndex((prev) => (prev + 1) % featuredContent.length);
    }
  };

  const prevCarousel = () => {
    if (featuredContent.length > 0) {
      setCurrentCarouselIndex(
        (prev) => (prev - 1 + featuredContent.length) % featuredContent.length
      );
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        <div className="w-full pt-32 md:pt-64 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
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
          <div className="flex-1 lg:max-w-[55%] w-full flex justify-center items-center">
            {featuredLoading ? (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 h-80 lg:h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : featuredError ? (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 h-80 lg:h-96 flex items-center justify-center">
                <p className="text-white/60">Error loading featured content</p>
              </div>
            ) : featuredContent.length > 0 ? (
              <div className="relative w-full max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[800px] self-center">
                {/* Carousel Container with Navigation */}
                <div className="flex items-center gap-0">
                  {/* Left Navigation Arrow */}
                  <button
                    onClick={prevCarousel}
                    className="w-8 md:w-10 lg:w-12 h-16 md:h-20 lg:h-24 xl:h-32 bg-gradient-to-r from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center hover:from-white/30 hover:to-transparent transition-all duration-200 group flex-shrink-0"
                  >
                    <svg
                      className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-white transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Carousel Image Container - Full Layout Fix */}
                  <div className="w-full aspect-video bg-white/10 backdrop-blur-md rounded-lg overflow-hidden flex-shrink-0 relative">
                    <div className="relative w-full h-full">
                      <img
                        src={
                          featuredContent[currentCarouselIndex]?.image_url ||
                          "/placeholder.svg"
                        }
                        alt={
                          featuredContent[currentCarouselIndex]?.title ||
                          "N8N Community Event"
                        }
                        className="w-full h-full object-cover"
                      />

                      {/* Custom Overlay Text - Gradient Black Box */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-3 px-3 md:pt-12 md:pb-4 md:px-4 lg:pt-16 lg:pb-5 lg:px-5 xl:pt-20 xl:pb-6 xl:px-6">
                        <div className="w-8 h-0.5 bg-white mb-3"></div>
                        <p className="text-white text-sm md:text-sm lg:text-base xl:text-lg leading-relaxed font-medium">
                          {featuredContent[currentCarouselIndex]?.excerpt ||
                            featuredContent[currentCarouselIndex]
                              ?.description ||
                            "1 juta orang lebih pengguna n8n di Indonesia menjadi alasan dibuatnya website community n8n Indonesia"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Navigation Arrow */}
                  <button
                    onClick={nextCarousel}
                    className="w-8 md:w-10 lg:w-12 h-16 md:h-20 lg:h-24 xl:h-32 bg-gradient-to-r from-transparent to-white/20 backdrop-blur-sm flex items-center justify-center hover:from-transparent hover:to-white/30 transition-all duration-200 group flex-shrink-0"
                  >
                    <svg
                      className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-white transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 h-80 lg:h-96 flex items-center justify-center">
                <p className="text-white/60">No featured content available</p>
              </div>
            )}
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
              {eventsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-white/10 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-white/20"></div>
                    <div className="p-6">
                      <div className="h-6 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded mb-3"></div>
                      <div className="h-3 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ))
              ) : eventsError ? (
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <p className="text-white/60">Error loading events</p>
                </div>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
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
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-gray-600 mb-3">{event.location}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        diadakan pada {formatDate(event.event_date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <p className="text-white/60">No upcoming events</p>
                </div>
              )}
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
              {newsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-white/10 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-white/20"></div>
                    <div className="p-6">
                      <div className="h-6 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded mb-3"></div>
                      <div className="h-3 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ))
              ) : newsError ? (
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <p className="text-white/60">Error loading news</p>
                </div>
              ) : news.length > 0 ? (
                news.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={newsItem.image_url || "/placeholder.svg"}
                        alt={newsItem.title}
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
                        {newsItem.title}
                      </h3>
                      {newsItem.excerpt && (
                        <p className="text-gray-600 mb-3">{newsItem.excerpt}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        diposting pada {formatDate(newsItem.published_date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <p className="text-white/60">No news available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
