"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GradientCircle from "@/components/GradientCircle";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  MapPin,
  Users,
  ExternalLink,
  User,
  Tag,
  CalendarDays,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string | null;
  status: "draft" | "published" | "upcoming" | "completed" | "cancelled";
  is_featured: boolean;
  max_participants?: number;
  current_participants?: number;
  registration_url?: string;
  event_type?: string;
  organizer_name?: string;
  organizer_email?: string;
  created_at: string;
  updated_at: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [timeUntilEvent, setTimeUntilEvent] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClientComponentClient();

        // Fetch event data from database based on ID
        const { data: eventData, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .eq("id", params.id)
          .in("status", ["published", "upcoming"])
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // No rows returned - event not found
            setError("Event tidak ditemukan");
          } else {
            console.error("Error fetching event:", fetchError);
            setError("Gagal memuat detail event");
          }
          return;
        }

        if (!eventData) {
          setError("Event tidak ditemukan");
          return;
        }

        setEvent(eventData);

        // Update view count (optional)
        try {
          await supabase
            .from("events")
            .update({ views: (eventData.views || 0) + 1 })
            .eq("id", eventData.id);
        } catch (viewError) {
          console.error("Error updating view count:", viewError);
          // Don't show error to user for view count update
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Terjadi kesalahan saat memuat event");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  // Calculate time until event
  useEffect(() => {
    if (!event) return;

    const calculateTimeUntil = () => {
      const now = new Date();
      const eventDate = new Date(event.event_date);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilEvent("Event telah berakhir");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntilEvent(`${days} hari ${hours} jam lagi`);
      } else if (hours > 0) {
        setTimeUntilEvent(`${hours} jam ${minutes} menit lagi`);
      } else {
        setTimeUntilEvent(`${minutes} menit lagi`);
      }
    };

    calculateTimeUntil();
    const interval = setInterval(calculateTimeUntil, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
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

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "",
          text: event?.description || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  // Handle registration
  const handleRegistration = () => {
    if (event?.registration_url) {
      window.open(event.registration_url, "_blank");
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Published";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Draft";
    }
  };

  if (loading) {
    return (
      <div className="text-white content-above-gradient relative min-h-screen">
        <div className="w-full container-box relative z-10 pt-32">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-6 bg-white/20 rounded w-24 mb-8"></div>

            {/* Header skeleton */}
            <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/20 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mb-8"></div>

            {/* Meta skeleton */}
            <div className="flex gap-6 mb-8">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-40"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-10 bg-white/20 rounded w-24"></div>
              <div className="h-10 bg-white/20 rounded w-32"></div>
            </div>

            {/* Image skeleton */}
            <div className="h-96 bg-white/20 rounded-2xl mb-8"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-white content-above-gradient relative min-h-screen">
        <div className="w-full container-box relative z-10 pt-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Event Tidak Ditemukan</h1>
            <p className="text-white/60 mb-6">
              {error ||
                "Event yang Anda cari tidak ditemukan atau telah dihapus."}
            </p>
            <button
              onClick={() => router.push("/news/upcoming-events")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kembali ke Daftar Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEventUpcoming = new Date(event.event_date) > new Date();
  const isRegistrationAvailable = event.registration_url && isEventUpcoming;

  return (
    <div className="text-white content-above-gradient relative">
      {/* Gradient circles */}
      <GradientCircle
        type="hero"
        style={{
          top: "10vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />
      <GradientCircle
        type="hero"
        style={{
          top: "60vh",
          left: "80vw",
          transform: "translateX(50%)",
          zIndex: -1,
        }}
      />

      <div className="w-full container-box relative z-10 mb-32">
        {/* Back Button */}
        <div className="pt-32 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {event.is_featured && (
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                event.status
              )}`}
            >
              {getStatusText(event.status)}
            </span>
            {event.event_type && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                {event.event_type}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {event.title}
          </h1>
          <p className="text-xl text-white/80 max-w-4xl leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Event Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-white/60">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(event.event_date)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(event.event_date)} WIB</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>

          {/* Organizer */}
          {event.organizer_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{event.organizer_name}</span>
            </div>
          )}

          {/* Participants */}
          {(event.max_participants || event.current_participants) && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {event.current_participants || 0}
                {event.max_participants && ` / ${event.max_participants}`}{" "}
                peserta
              </span>
            </div>
          )}
        </div>

        {/* Countdown for upcoming events */}
        {isEventUpcoming && timeUntilEvent && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-600/30">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">
                {timeUntilEvent}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {shareSuccess ? "Link Disalin!" : "Bagikan"}
          </button>
          {isRegistrationAvailable && (
            <button
              onClick={handleRegistration}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Daftar Event
            </button>
          )}
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="bg-white/10 rounded-2xl overflow-hidden">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-white">Detail Event</h2>

            <div className="space-y-6">
              {/* Event Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Deskripsi
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Informasi Event
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-white/80">
                        {formatDate(event.event_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-white/80">
                        {formatTime(event.event_date)} WIB
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-white/80">{event.location}</span>
                    </div>
                    {event.event_type && (
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">
                          {event.event_type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Pendaftaran
                  </h3>
                  <div className="space-y-3">
                    {event.organizer_name && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">
                          {event.organizer_name}
                        </span>
                      </div>
                    )}
                    {(event.max_participants || event.current_participants) && (
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">
                          {event.current_participants || 0}
                          {event.max_participants &&
                            ` / ${event.max_participants}`}{" "}
                          peserta
                        </span>
                      </div>
                    )}
                    {isRegistrationAvailable && (
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">
                          Pendaftaran tersedia
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration CTA */}
              {isRegistrationAvailable && (
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-600/30">
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Daftar Sekarang!
                  </h3>
                  <p className="text-white/80 mb-4">
                    Jangan lewatkan kesempatan untuk bergabung dalam event ini.
                    Daftar sekarang untuk mengamankan tempat Anda.
                  </p>
                  <button
                    onClick={handleRegistration}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Daftar Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Footer */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              <p>Terakhir diperbarui: {formatDate(event.updated_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Bagikan Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
