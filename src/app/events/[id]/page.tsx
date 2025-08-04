"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  status: string;
  is_featured: boolean;
  max_participants?: number;
  current_participants?: number;
  registration_url?: string;
  event_type?: string;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // Simulasi fetch data event berdasarkan ID
        // Dalam implementasi nyata, ini akan mengambil data dari API
        const mockEvent: Event = {
          id: params.id as string,
          title: "Advanced n8n Workflow Optimization",
          description: "Workshop lanjutan untuk mengoptimasi workflow n8n. Pelajari teknik advanced seperti error handling, performance optimization, dan best practices untuk workflow yang scalable. Workshop ini cocok untuk developer yang sudah familiar dengan dasar-dasar n8n dan ingin meningkatkan skill automation mereka ke level berikutnya.",
          event_date: "2025-11-08T13:00:00Z",
          location: "Bandung Digital Valley, Jl. Asia Afrika No. 100, Bandung",
          image_url: "/placeholder.svg",
          status: "published",
          is_featured: true,
          max_participants: 50,
          current_participants: 35,
          registration_url: "https://forms.google.com/event-registration",
          event_type: "Workshop",
          organizer: "N8N Indonesia Community",
          contact_email: "events@n8nindonesia.com",
          contact_phone: "+62 812-3456-7890"
        };
        
        setEvent(mockEvent);
      } catch (err) {
        setError("Gagal memuat detail event");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

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
  const handleRegistration = async () => {
    if (!event) return;
    
    setIsRegistering(true);
    
    try {
      // Simulasi proses pendaftaran
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (event.registration_url) {
        // Redirect ke form pendaftaran eksternal
        window.open(event.registration_url, '_blank');
      }
      
      setRegistrationSuccess(true);
    } catch (err) {
      setError("Gagal melakukan pendaftaran");
    } finally {
      setIsRegistering(false);
    }
  };

  // Check if event is full
  const isEventFull = event && event.max_participants && event.current_participants 
    ? event.current_participants >= event.max_participants 
    : false;

  // Check if event has passed
  const isEventPassed = event ? new Date(event.event_date) < new Date() : false;

  if (loading) {
    return (
      <div className="text-white content-above-gradient relative min-h-screen">
        <div className="w-full container-box relative z-10 pt-32">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-white/20 rounded mb-8"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
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
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2">Event Tidak Ditemukan</h1>
            <p className="text-white/60 mb-6">Event yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <button 
              onClick={() => router.push('/upcoming-events')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kembali ke Daftar Event
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {event.is_featured && (
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured Event
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
          <p className="text-xl text-white/80 max-w-3xl">{event.description}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Image */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 rounded-2xl overflow-hidden">
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Right Column - Event Details & Registration */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Detail Event</h3>
              
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{formatDate(event.event_date)}</p>
                    <p className="text-white/60 text-sm">{formatTime(event.event_date)} WIB</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-white/60 text-sm">{event.location}</p>
                  </div>
                </div>

                {/* Event Type */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Tipe Event</p>
                    <p className="text-white/60 text-sm">{event.event_type || 'Community Event'}</p>
                  </div>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Penyelenggara</p>
                      <p className="text-white/60 text-sm">{event.organizer}</p>
                    </div>
                  </div>
                )}

                {/* Participants */}
                {event.max_participants && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-400 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Peserta</p>
                      <p className="text-white/60 text-sm">
                        {event.current_participants || 0} / {event.max_participants} terdaftar
                      </p>
                      {/* Progress bar */}
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((event.current_participants || 0) / event.max_participants) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Pendaftaran</h3>
              
              {registrationSuccess ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium mb-2">Pendaftaran Berhasil!</p>
                  <p className="text-white/60 text-sm mb-4">
                    Anda akan diarahkan ke form pendaftaran eksternal untuk melengkapi data.
                  </p>
                  <button 
                    onClick={() => setRegistrationSuccess(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Daftar Lagi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {isEventPassed ? (
                    <div className="text-center py-4">
                      <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                      <p className="text-red-400 font-medium">Event Telah Berakhir</p>
                      <p className="text-white/60 text-sm">Event ini telah selesai dilaksanakan.</p>
                    </div>
                  ) : isEventFull ? (
                    <div className="text-center py-4">
                      <XCircle className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                      <p className="text-orange-400 font-medium">Event Penuh</p>
                      <p className="text-white/60 text-sm">Kuota peserta telah terpenuhi.</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-white/80 text-sm">
                        Daftar sekarang untuk mengikuti event ini. Pendaftaran gratis dan terbuka untuk semua member komunitas.
                      </p>
                      
                      <button
                        onClick={handleRegistration}
                        disabled={isRegistering}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isRegistering ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Memproses...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-5 h-5" />
                            Daftar Event
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            {(event.contact_email || event.contact_phone) && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Kontak</h3>
                <div className="space-y-3">
                  {event.contact_email && (
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a 
                        href={`mailto:${event.contact_email}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        {event.contact_email}
                      </a>
                    </div>
                  )}
                  {event.contact_phone && (
                    <div>
                      <p className="font-medium text-sm">Telepon</p>
                      <a 
                        href={`tel:${event.contact_phone}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        {event.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6">Deskripsi Lengkap</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">
                {event.description}
              </p>
              
              <h4 className="text-xl font-bold mt-8 mb-4">Yang Akan Anda Pelajari</h4>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Teknik advanced error handling dalam workflow n8n</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Optimasi performa workflow untuk data besar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Best practices untuk workflow yang scalable</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Integrasi dengan berbagai external APIs</span>
                </li>
              </ul>

              <h4 className="text-xl font-bold mt-8 mb-4">Persiapan yang Diperlukan</h4>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Laptop dengan koneksi internet stabil</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Akun n8n (gratis) yang sudah dibuat sebelumnya</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Pemahaman dasar workflow automation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 