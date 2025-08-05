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

            {/* Image skeleton - 16:9 aspect ratio, not full width */}
            <div className="max-w-4xl mx-auto aspect-video bg-white/20 rounded-2xl mb-8"></div>

            {/* Title skeleton */}
            <div className="flex gap-4 mb-6">
              <div className="w-1 bg-white/20 rounded"></div>
              <div className="h-8 bg-white/20 rounded w-3/4"></div>
            </div>

            {/* Meta skeleton */}
            <div className="flex gap-6 mb-8">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-40"></div>
            </div>

            {/* Content skeleton */}
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/5"></div>
                <div className="h-4 bg-white/20 rounded w-full"></div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/20 rounded w-48"></div>
                <div className="h-10 bg-white/20 rounded w-32"></div>
              </div>
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
            onClick={() => router.push("/news/news-report")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>

        {/* Featured Image - 16:9 aspect ratio, not full width */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto aspect-video bg-white/10 rounded-2xl overflow-hidden">
            <img
              src={news.image_url || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title with Vertical Line */}
        <div className="mb-6">
          <div className="flex gap-4 items-stretch">
            {/* Vertical Line - follows title height */}
            <div className="w-1 bg-white rounded-full flex-shrink-0"></div>
            {/* Title */}
            <h1 className="article-title">{news.title}</h1>
          </div>
        </div>

        {/* Author and Date Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-white/60">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {news.author_name || "n8n Indonesia"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(news.published_date)}</span>
          </div>
        </div>

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
                {shareSuccess ? "Link Disalin!" : "Bagikan Artikel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
