"use client";

import { useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import { useUpcomingEvents } from "@/hooks/use-upcoming-events";
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react";
import { useState } from "react";

export default function UpcomingEventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    upcomingEvents,
    loading: eventsLoading,
    error: eventsError,
    totalEvents,
    featuredEvents,
  } = useUpcomingEvents(20);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter events based on search term
  const filteredEvents = upcomingEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (event.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

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
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-32 md:pt-64 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading */}
            <div className="flex flex-col items-start flex-shrink-0">
              <h1 className="hero-title-main">Upcoming</h1>
              <h2 className="hero-title-sub">Events</h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi dan Search */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl mb-6">
                Temukan dan ikuti event-event menarik dari komunitas N8N
                Indonesia. Bergabunglah dengan meetup, workshop, dan acara
                networking untuk meningkatkan skill automation Anda!
              </div>
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari Event"
                  className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Mobile: Deskripsi dan Search */}
          <div className="md:hidden flex flex-col items-start w-full mt-6">
            <div className="hero-description max-w-3xl mb-4">
              Temukan dan ikuti event-event menarik dari komunitas N8N
              Indonesia. Bergabunglah dengan meetup, workshop, dan acara
              networking untuk meningkatkan skill automation Anda!
            </div>
            {/* Search Bar Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari Event"
                className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS SECTION */}
        <div className="mt-28 md:mt-32">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Jadwal Event Selanjutnya
          </h2>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-white/20"></div>
                  <div className="p-6">
                    <div className="h-6 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded mb-3"></div>
                    <div className="h-3 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                  </div>
                </div>
              ))
            ) : eventsError ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <p className="text-white/60">Error loading events</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Featured Badge */}
                    {event.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === "published"
                            ? "bg-green-500 text-white"
                            : event.status === "draft"
                            ? "bg-gray-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {event.status === "published"
                          ? "Published"
                          : event.status === "draft"
                          ? "Draft"
                          : event.status === "cancelled"
                          ? "Cancelled"
                          : "Archived"}
                      </span>
                    </div>
                    {/* View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() =>
                          router.push(`/news/upcoming-events/${event.id}`)
                        }
                        className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200"
                      >
                        <span>Lihat Detail</span>
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
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {/* Event Details */}
                    <div className="space-y-2">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          {formatDate(event.event_date)} •{" "}
                          {formatTime(event.event_date)}
                        </span>
                      </div>

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}

                      {/* Event Type Indicator */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          {event.is_featured
                            ? "Featured Event"
                            : "Community Event"}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(`/news/upcoming-events/${event.id}`)
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                      >
                        Daftar Event
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : searchTerm ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-white/60 text-lg mb-2">
                  Tidak ada event yang ditemukan
                </p>
                <p className="text-white/40 text-sm">
                  Coba kata kunci lain atau hapus pencarian
                </p>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-white/60 text-lg mb-2">
                  Belum ada event mendatang
                </p>
                <p className="text-white/40 text-sm">
                  Nantikan event menarik dari komunitas N8N Indonesia!
                </p>
              </div>
            )}
          </div>

          {/* Load More Button (if needed) */}
          {upcomingEvents.length > 6 && (
            <div className="flex justify-center mt-12">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium">
                Lihat Semua Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
