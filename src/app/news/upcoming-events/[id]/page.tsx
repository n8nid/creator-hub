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
  User,
  Tag,
  CalendarDays,
  ArrowRight,
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
  pendaftaran_link?: string;
  nomor_penyelenggara?: string;
  instagram_penyelenggara?: string;
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

  const [timeUntilEvent, setTimeUntilEvent] = useState<string>("");
  const [shareSuccess, setShareSuccess] = useState(false);

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

  // Handle registration
  const handleRegistration = () => {
    if (event?.pendaftaran_link) {
      window.open(event.pendaftaran_link, "_blank");
    } else if (event?.registration_url) {
      window.open(event.registration_url, "_blank");
    }
  };

  // Handle WhatsApp contact
  const handleWhatsApp = () => {
    if (event?.nomor_penyelenggara) {
      const phoneNumber = event.nomor_penyelenggara.replace(/\D/g, "");
      const message = `Halo! Saya tertarik dengan event "${event.title}". Bisa saya tanya lebih lanjut?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  // Handle Instagram contact
  const handleInstagram = () => {
    if (event?.instagram_penyelenggara) {
      const instagramUrl = `https://instagram.com/${event.instagram_penyelenggara.replace(
        "@",
        ""
      )}`;
      window.open(instagramUrl, "_blank");
    }
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

  // Get status color

  if (loading) {
    return (
      <div className="text-white content-above-gradient relative min-h-screen">
        <div className="w-full container-box relative z-10 pt-32">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-6 event-detail-skeleton-bg rounded w-24 mb-8"></div>

            {/* Header skeleton */}
            <div className="h-8 event-detail-skeleton-bg rounded w-1/3 mb-4"></div>
            <div className="h-12 event-detail-skeleton-bg rounded w-2/3 mb-4"></div>
            <div className="h-6 event-detail-skeleton-bg rounded w-3/4 mb-8"></div>

            {/* Meta skeleton */}
            <div className="flex gap-6 mb-8">
              <div className="h-4 event-detail-skeleton-bg rounded w-32"></div>
              <div className="h-4 event-detail-skeleton-bg rounded w-40"></div>
              <div className="h-4 event-detail-skeleton-bg rounded w-24"></div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-10 event-detail-skeleton-bg rounded w-24"></div>
              <div className="h-10 event-detail-skeleton-bg rounded w-32"></div>
            </div>

            {/* Image skeleton */}
            <div className="h-96 event-detail-skeleton-bg rounded-2xl mb-8"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 event-detail-skeleton-bg rounded w-full"></div>
              <div className="h-4 event-detail-skeleton-bg rounded w-5/6"></div>
              <div className="h-4 event-detail-skeleton-bg rounded w-4/5"></div>
              <div className="h-4 event-detail-skeleton-bg rounded w-full"></div>
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
            <div className="w-16 h-16 event-detail-error-bg rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl event-detail-error-icon">📅</span>
            </div>
            <h1 className="event-detail-title mb-2">Event Tidak Ditemukan</h1>
            <p className="event-detail-description mb-6">
              {error ||
                "Event yang Anda cari tidak ditemukan atau telah dihapus."}
            </p>
            <button
              onClick={() => router.push("/news/upcoming-events")}
              className="px-6 py-3 rounded-lg event-detail-button-primary"
            >
              Kembali ke Daftar Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEventUpcoming = new Date(event.event_date) > new Date();
  const hasRegistrationLink = event.pendaftaran_link || event.registration_url;
  const isRegistrationAvailable = hasRegistrationLink && isEventUpcoming;

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
            className="flex items-center gap-2 event-detail-back-button group"
          >
            <ArrowLeft className="w-5 h-5 event-detail-back-button-icon group-hover:-translate-x-1" />
            Kembali
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto aspect-video bg-white/10 rounded-2xl overflow-hidden">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          {/* Title with Vertical Line */}
          <div className="mb-6">
            <div className="flex gap-4 items-stretch">
              {/* Vertical Line - follows title height */}
              <div className="w-1 bg-white rounded-full flex-shrink-0"></div>
              {/* Title */}
              <h1 className="article-title">{event.title}</h1>
            </div>
          </div>

          {/* Description */}
          <p className="event-detail-description max-w-4xl text-white/80">
            {event.description}
          </p>
        </div>

        {/* Countdown for upcoming events */}
        {isEventUpcoming && timeUntilEvent && (
          <div className="mb-8 p-4 rounded-lg event-detail-countdown-bg">
            <div className="flex items-center gap-2">
              <CalendarDays className="event-detail-countdown-icon" />
              <span className="event-detail-countdown">{timeUntilEvent}</span>
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8 event-detail-layout">
            {/* Left Column - Detail Event */}
            <div className="lg:col-span-2 event-detail-left-column">
              <div className="event-detail-card-bg rounded-2xl p-8 event-detail-card-padding">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Detail Event
                </h2>

                <div className="space-y-6">
                  {/* Event Description */}
                  <div>
                    <h3 className="event-detail-section-title mb-3">
                      Deskripsi
                    </h3>
                    <p className="event-detail-section-text leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Jadwal & Lokasi */}
                  <div>
                    <h3 className="event-detail-section-title mb-3">
                      Jadwal & Lokasi
                    </h3>
                    <div className="space-y-3">
                      {event.organizer_name && (
                        <div className="flex items-center gap-3">
                          <User className="event-detail-section-icon" />
                          <span className="event-detail-section-text">
                            {event.organizer_name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="event-detail-section-icon" />
                        <span className="event-detail-section-text">
                          {formatDate(event.event_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="event-detail-section-icon" />
                        <span className="event-detail-section-text">
                          {formatTime(event.event_date)} WIB
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="event-detail-section-icon" />
                        <span className="event-detail-section-text">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Registration & Contact */}
            <div className="space-y-6 event-detail-right-column">
              {/* Registration Card */}
              <div className="event-detail-registration-card rounded-2xl p-6 event-detail-card-padding">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Pendaftaran
                </h3>
                <p className="event-detail-section-text mb-4">
                  {isEventUpcoming
                    ? "Tertarik? Buruan daftar sebelum kuota habis"
                    : "Event telah berakhir, tetapi Anda masih bisa melihat informasi pendaftaran"}
                </p>
                {hasRegistrationLink ? (
                  <button
                    onClick={handleRegistration}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg event-detail-button-full ${
                      isEventUpcoming
                        ? "event-detail-button-primary"
                        : "event-detail-button-secondary"
                    }`}
                    disabled={!isEventUpcoming}
                  >
                    <span>Link Pendaftaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg event-detail-button-placeholder event-detail-button-full">
                    <span>Link Pendaftaran Belum Tersedia</span>
                  </div>
                )}
              </div>

              {/* Contact Information Card */}
              <div className="event-detail-contact-card rounded-2xl p-6 event-detail-card-padding">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Informasi Kontak
                </h3>
                <p className="event-detail-section-text mb-4">
                  Informasi lebih lanjut? hubungi kontak dibawah ini
                </p>
                <div className="space-y-3">
                  {event.nomor_penyelenggara && (
                    <button
                      onClick={handleWhatsApp}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg event-detail-whatsapp-button event-detail-button-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      <span>WhatsApp</span>
                    </button>
                  )}
                  {event.instagram_penyelenggara && (
                    <button
                      onClick={handleInstagram}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg event-detail-instagram-button event-detail-button-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Footer */}
        <div className="mt-12 pt-8 event-detail-footer-border border-t">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="event-detail-footer-text">
              <p>Terakhir diperbarui: {formatDate(event.updated_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareSuccess ? "Link Disalin!" : "Bagikan Event"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
