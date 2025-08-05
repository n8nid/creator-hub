"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GradientCircle from "@/components/GradientCircle";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Eye,
  User,
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Simulasi fetch data news berdasarkan slug
        // Dalam implementasi nyata, ini akan mengambil data dari API
        const mockNews: News = {
          id: "1",
          title: "N8N Indonesia Community Meluncurkan Platform Creator Hub",
          slug: params.slug as string,
          content: `
            <p>Komunitas N8N Indonesia dengan bangga mengumumkan peluncuran platform Creator Hub yang akan menjadi pusat pembelajaran dan kolaborasi untuk para developer automation di Indonesia.</p>
            
            <h2>Fitur Utama Creator Hub</h2>
            <p>Platform ini dirancang dengan mempertimbangkan kebutuhan komunitas automation Indonesia yang terus berkembang. Beberapa fitur utama yang tersedia:</p>
            
            <ul>
              <li><strong>Workflow Library:</strong> Koleksi workflow n8n yang dapat digunakan dan dimodifikasi sesuai kebutuhan</li>
              <li><strong>Learning Center:</strong> Tutorial dan dokumentasi lengkap untuk berbagai level skill</li>
              <li><strong>Community Forum:</strong> Tempat diskusi dan berbagi pengalaman antar member</li>
              <li><strong>Event Management:</strong> Sistem manajemen event untuk meetup dan workshop</li>
              <li><strong>Creator Directory:</strong> Direktori para expert dan creator n8n di Indonesia</li>
            </ul>
            
            <h2>Manfaat untuk Komunitas</h2>
            <p>Dengan adanya Creator Hub, komunitas N8N Indonesia berharap dapat:</p>
            
            <ol>
              <li>Meningkatkan skill automation para developer Indonesia</li>
              <li>Memperluas jaringan dan kolaborasi antar member</li>
              <li>Mendorong inovasi dalam pengembangan workflow</li>
              <li>Membuat automation lebih mudah diakses oleh berbagai kalangan</li>
            </ol>
            
            <h2>Roadmap Pengembangan</h2>
            <p>Tim pengembang Creator Hub telah menyusun roadmap pengembangan yang ambisius:</p>
            
            <h3>Phase 1 (Q1 2025)</h3>
            <ul>
              <li>Peluncuran platform dasar</li>
              <li>Workflow library dengan 100+ template</li>
              <li>Sistem user management</li>
            </ul>
            
            <h3>Phase 2 (Q2 2025)</h3>
            <ul>
              <li>Integrasi dengan marketplace n8n</li>
              <li>Sistem gamification dan achievement</li>
              <li>Mobile app development</li>
            </ul>
            
            <h3>Phase 3 (Q3-Q4 2025)</h3>
            <ul>
              <li>AI-powered workflow suggestions</li>
              <li>Advanced analytics dan reporting</li>
              <li>Integration dengan platform third-party</li>
            </ul>
            
            <h2>Bagaimana Bergabung</h2>
            <p>Untuk bergabung dengan Creator Hub, Anda dapat:</p>
            
            <ol>
              <li>Mengunjungi website resmi: <a href="https://creator-hub.n8nindonesia.com" class="text-purple-400 hover:text-purple-300">creator-hub.n8nindonesia.com</a></li>
              <li>Mendaftar sebagai member baru</li>
              <li>Mengikuti onboarding session</li>
              <li>Mulai berkolaborasi dengan komunitas</li>
            </ol>
            
            <h2>Kesimpulan</h2>
            <p>Peluncuran Creator Hub menandai tonggak penting dalam perjalanan komunitas N8N Indonesia. Platform ini tidak hanya akan menjadi tempat belajar, tetapi juga menjadi ekosistem yang mendukung pertumbuhan dan inovasi dalam dunia automation di Indonesia.</p>
            
            <p>Kami mengundang semua developer, automation enthusiast, dan siapa saja yang tertarik dengan n8n untuk bergabung dan berkontribusi dalam membangun masa depan automation yang lebih baik di Indonesia.</p>
          `,
          excerpt:
            "Komunitas N8N Indonesia meluncurkan platform Creator Hub yang akan menjadi pusat pembelajaran dan kolaborasi untuk para developer automation di Indonesia.",
          published_date: "2025-01-15T10:30:00Z",
          image_url: "/placeholder.svg",
          is_featured: true,
          status: "published",
          created_at: "2025-01-15T10:30:00Z",
          updated_at: "2025-01-15T10:30:00Z",
          published_at: "2025-01-15T10:30:00Z",
          created_by: "user-123",
          author_name: "Tim N8N Indonesia",
          read_time: 8,
          views: 1247,
          tags: ["Platform", "Community", "Automation", "n8n"],
        };

        setNews(mockNews);
      } catch (err) {
        setError("Gagal memuat detail berita");
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
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Dalam implementasi nyata, ini akan menyimpan ke database
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title,
          text: news?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berita telah disalin ke clipboard!");
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
              Berita yang Anda cari tidak ditemukan atau telah dihapus.
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
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
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
              <Eye className="w-4 h-4" />
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
            Bagikan
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
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-strong:text-white prose-a:text-purple-400 prose-a:hover:text-purple-300 prose-ul:text-white/80 prose-ol:text-white/80 prose-li:text-white/80"
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
