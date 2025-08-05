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
  Bookmark,
  Eye,
  User,
  FileText,
  Tag,
} from "lucide-react";

interface News {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  published_date: string;
  image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
  author_name?: string;
  read_time?: number;
  views?: number;
  tags?: string[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClientComponentClient();

        // Fetch news data from database based on slug
        const { data: newsData, error: fetchError } = await supabase
          .from("news")
          .select("*")
          .eq("slug", params.slug)
          .eq("status", "published")
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // No rows returned - news not found
            setError("Berita tidak ditemukan");
          } else {
            console.error("Error fetching news:", fetchError);
            setError("Gagal memuat detail berita");
          }
          return;
        }

        if (!newsData) {
          setError("Berita tidak ditemukan");
          return;
        }

        setNews(newsData);

        // Update view count (optional)
        try {
          await supabase
            .from("news")
            .update({ views: (newsData.views || 0) + 1 })
            .eq("id", newsData.id);
        } catch (viewError) {
          console.error("Error updating view count:", viewError);
          // Don't show error to user for view count update
        }

        // Check if user has bookmarked this news
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: bookmarkData } = await supabase
              .from("bookmarks")
              .select("*")
              .eq("user_id", user.id)
              .eq("news_id", newsData.id)
              .single();

            setIsBookmarked(!!bookmarkData);
          }
        } catch (bookmarkError) {
          console.error("Error checking bookmark status:", bookmarkError);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Terjadi kesalahan saat memuat berita");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchNews();
    }
  }, [params.slug]);

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

  // Handle bookmark
  const handleBookmark = async () => {
    try {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If not logged in, just toggle local state
        setIsBookmarked(!isBookmarked);
        return;
      }

      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("news_id", news?.id);
      } else {
        // Add bookmark
        await supabase.from("bookmarks").insert({
          user_id: user.id,
          news_id: news?.id,
          created_at: new Date().toISOString(),
        });
      }

      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Error handling bookmark:", err);
      // Fallback to local state toggle
      setIsBookmarked(!isBookmarked);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title || "",
          text: news?.excerpt || "",
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
              <div className="h-10 bg-white/20 rounded w-24"></div>
            </div>

            {/* Image skeleton */}
            <div className="h-96 bg-white/20 rounded-2xl mb-8"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-white content-above-gradient relative min-h-screen">
        <div className="w-full container-box relative z-10 pt-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Berita Tidak Ditemukan</h1>
            <p className="text-white/60 mb-6">
              {error ||
                "Berita yang Anda cari tidak ditemukan atau telah dihapus."}
            </p>
            <button
              onClick={() => router.push("/news/news-report")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kembali ke Daftar Berita
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
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {news.is_featured && (
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                news.status === "published"
                  ? "bg-green-500 text-white"
                  : news.status === "draft"
                  ? "bg-gray-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {news.status === "published"
                ? "Published"
                : news.status === "draft"
                ? "Draft"
                : "Archived"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {news.title}
          </h1>
          <p className="text-xl text-white/80 max-w-4xl leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-white/60">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {news.author_name || "N8N Indonesia"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(news.published_date)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {formatTime(news.published_date)} WIB
            </span>
          </div>

          {/* Read Time */}
          {news.read_time && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{news.read_time} menit baca</span>
            </div>
          )}

          {/* Views */}
          {news.views && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                {news.views.toLocaleString()} views
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {shareSuccess ? "Link Disalin!" : "Bagikan"}
          </button>
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Tersimpan" : "Simpan"}
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="bg-white/10 rounded-2xl overflow-hidden">
            <img
              src={news.image_url || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Tag className="w-4 h-4 text-purple-400 mt-1" />
            {news.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-strong:text-white prose-a:text-purple-400 prose-a:hover:text-purple-300 prose-ul:text-white/80 prose-ol:text-white/80 prose-li:text-white/80 prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg"
              dangerouslySetInnerHTML={{ __html: news.content || "" }}
            />
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              <p>Terakhir diperbarui: {formatDate(news.updated_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Bagikan Artikel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
