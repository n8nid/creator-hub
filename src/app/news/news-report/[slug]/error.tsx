"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("News detail error:", error);
  }, [error]);

  return (
    <div className="text-white content-above-gradient relative min-h-screen">
      <div className="w-full container-box relative z-10 pt-32">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
          <p className="text-white/60 mb-6">
            Maaf, terjadi kesalahan saat memuat berita. Silakan coba lagi.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
