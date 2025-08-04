"use client";

import { useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import { useUpcomingEvents } from "@/hooks/use-upcoming-events";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

export default function UpcomingEventsPage() {
  const router = useRouter();
  const { 
    upcomingEvents, 
    loading: eventsLoading, 
    error: eventsError,
    totalEvents,
    featuredEvents
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
              <h1 className="hero-title-main">Upcoming</h1>
              <h2 className="hero-title-sub">Events</h2>
            </div>

            {/* Garis Horizontal */}
            <div className="w-24 h-0.5 bg-white mb-8"></div>

            {/* Deskripsi */}
            <div className="hero-description max-w-lg">
              Temukan dan ikuti event-event menarik dari komunitas N8N Indonesia. 
              Bergabunglah dengan meetup, workshop, dan acara networking untuk 
              meningkatkan skill automation Anda!
            </div>
          </div>

          {/* KOLOM KANAN: Event Stats */}
          <div className="flex-1 lg:max-w-[55%] w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {upcomingEvents.length}
                  </div>
                  <div className="text-white/80 text-sm">Event Mendatang</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {featuredEvents}
                  </div>
                  <div className="text-white/80 text-sm">Event Featured</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80 text-sm text-center">
                  Bergabunglah dengan komunitas dan jangan lewatkan event menarik!
                </p>
              </div>
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
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'published' 
                          ? 'bg-green-500 text-white' 
                          : event.status === 'draft'
                          ? 'bg-gray-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {event.status === 'published' ? 'Published' : 
                         event.status === 'draft' ? 'Draft' : 
                         event.status === 'cancelled' ? 'Cancelled' : 'Archived'}
                      </span>
                    </div>
                    {/* View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => router.push(`/events/${event.id}`)}
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
                          {formatDate(event.event_date)} • {formatTime(event.event_date)}
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
                          {event.is_featured ? 'Featured Event' : 'Community Event'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                      >
                        Daftar Event
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-white/60 text-lg mb-2">Belum ada event mendatang</p>
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