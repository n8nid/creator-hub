import Link from "next/link";
import { XCircle } from "lucide-react";

export default function NotFound() {
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
          <Link
            href="/news/news-report"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
