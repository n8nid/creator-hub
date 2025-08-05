"use client";

import { useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import { useNews } from "@/hooks/use-news";
import { FileText, Calendar, Clock, TrendingUp } from "lucide-react";

export default function NewsReportPage() {
  const router = useRouter();
  const { 
    news, 
    loading: newsLoading, 
    error: newsError 
  } = useNews(20);

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
              <h1 className="hero-title-main">News</h1>
              <h2 className="hero-title-sub">& Report</h2>
            </div>

            {/* Garis Horizontal */}
            <div className="w-24 h-0.5 bg-white mb-8"></div>

            {/* Deskripsi */}
            <div className="hero-description max-w-lg">
              Dapatkan berita terbaru dan laporan mendalam seputar N8N Indonesia. 
              Ikuti perkembangan teknologi automation dan komunitas developer 
              yang terus berkembang!
            </div>
          </div>

          {/* KOLOM KANAN: News Stats */}
          <div className="flex-1 lg:max-w-[55%] w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {news.length}
                  </div>
                  <div className="text-white/80 text-sm">Total Berita</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {news.filter(item => item.is_featured).length}
                  </div>
                  <div className="text-white/80 text-sm">Berita Featured</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80 text-sm text-center">
                  Tetap terhubung dengan komunitas N8N Indonesia!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BERITA SECTION */}
        <div className="mt-28 md:mt-32">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Berita
          </h2>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsLoading ? (
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
            ) : newsError ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <p className="text-white/60">Error loading news</p>
              </div>
            ) : news.length > 0 ? (
              news.map((newsItem) => (
                <div
                  key={newsItem.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img
                      src={newsItem.image_url || "/placeholder.svg"}
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Featured Badge */}
                    {newsItem.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        newsItem.status === 'published' 
                          ? 'bg-green-500 text-white' 
                          : newsItem.status === 'draft'
                          ? 'bg-gray-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {newsItem.status === 'published' ? 'Published' : 
                         newsItem.status === 'draft' ? 'Draft' : 'Archived'}
                      </span>
                    </div>
                    {/* View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => router.push(`/news/news-report/${newsItem.slug}`)}
                        className="bg-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/90 transition-all duration-200"
                      >
                        <span>Baca Selengkapnya</span>
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
                      {newsItem.title}
                    </h3>
                    
                    {newsItem.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {newsItem.excerpt}
                      </p>
                    )}

                    {/* News Details */}
                    <div className="space-y-2">
                      {/* Published Date */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          {formatDate(newsItem.published_date)}
                        </span>
                      </div>

                      {/* Published Time */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          {formatTime(newsItem.published_date)}
                        </span>
                      </div>

                      {/* News Type */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          {newsItem.is_featured ? 'Berita Utama' : 'Berita Komunitas'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => router.push(`/news/news-report/${newsItem.slug}`)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                      >
                        Baca Berita
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-white/60 text-lg mb-2">Belum ada berita tersedia</p>
                <p className="text-white/40 text-sm">
                  Nantikan berita menarik dari komunitas N8N Indonesia!
                </p>
              </div>
            )}
          </div>

          {/* Load More Button (if needed) */}
          {news.length > 6 && (
            <div className="flex justify-center mt-12">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium">
                Lihat Semua Berita
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 