"use client";

import { useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import { useNews } from "@/hooks/use-news";
import { FileText, Calendar, Clock, TrendingUp, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function NewsReportPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedNews, setDisplayedNews] = useState(9);
  const [hasMore, setHasMore] = useState(false);
  const { news, loading: newsLoading, error: newsError } = useNews();

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

  // Filter news based on search term
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.excerpt?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.content?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Get visible news based on displayed count
  const visibleNews = filteredNews.slice(0, displayedNews);

  // Check if there are more news to show
  useEffect(() => {
    const filteredCount = filteredNews.length;
    setHasMore(filteredCount > displayedNews);
  }, [filteredNews, displayedNews]);

  // Handle load more
  const handleLoadMore = () => {
    setDisplayedNews((prev) => prev + 9);
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
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-32 md:pt-64 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading */}
            <div className="flex flex-col items-start flex-shrink-0">
              <h1 className="hero-title-main">News</h1>
              <h2 className="hero-title-sub">& Report</h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi dan Search */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl mb-6">
                Dapatkan berita terbaru dan laporan mendalam seputar N8N
                Indonesia. Ikuti perkembangan teknologi automation dan komunitas
                developer yang terus berkembang!
              </div>
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari Berita"
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
              Dapatkan berita terbaru dan laporan mendalam seputar N8N
              Indonesia. Ikuti perkembangan teknologi automation dan komunitas
              developer yang terus berkembang!
            </div>
            {/* Search Bar Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari Berita"
                className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
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
              Array.from({ length: 9 }).map((_, index) => (
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
            ) : visibleNews.length > 0 ? (
              visibleNews.map((newsItem) => (
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
                    {/* View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() =>
                          router.push(`/news/news-report/${newsItem.slug}`)
                        }
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
                          {newsItem.is_featured
                            ? "Berita Utama"
                            : "Berita Komunitas"}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(`/news/news-report/${newsItem.slug}`)
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                      >
                        Baca Berita
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : searchTerm ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-white/60 text-lg mb-2">
                  Tidak ada berita yang ditemukan
                </p>
                <p className="text-white/40 text-sm">
                  Coba kata kunci lain atau hapus pencarian
                </p>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-white/60 text-lg mb-2">
                  Belum ada berita tersedia
                </p>
                <p className="text-white/40 text-sm">
                  Nantikan berita menarik dari komunitas N8N Indonesia!
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-10 py-4 rounded-full font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <span>Lihat Semua Berita</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17l9.2-9.2M17 17V7H7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
