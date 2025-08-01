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
            {featuredLoading ? (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 h-80 lg:h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : featuredError ? (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 h-80 lg:h-96 flex items-center justify-center">
                <p className="text-white/60">Error loading featured content</p>
              </div>
            ) : featuredContent.length > 0 ? (
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
                {/* Carousel Image */}
                <div className="relative h-80 lg:h-96">
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

                  {/* Overlay Text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="w-8 h-0.5 bg-white mb-3"></div>
                    <p className="text-white text-sm lg:text-base leading-relaxed">
                      {featuredContent[currentCarouselIndex]?.excerpt ||
                        featuredContent[currentCarouselIndex]?.description ||
                        "1 juta orang lebih pengguna n8n di Indonesia menjadi alasan dibuatnya website community n8n Indonesia"}
                    </p>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevCarousel}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                  >
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

                  <button
                    onClick={nextCarousel}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                  >
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
                  {featuredContent.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentCarouselIndex
                          ? "bg-white"
                          : "bg-white/40"
                      }`}
                    ></div>
                  ))}
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
