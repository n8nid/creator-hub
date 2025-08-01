import { Metadata } from "next";
import GradientCircle from "@/components/GradientCircle";

export const metadata: Metadata = {
  title: "Berita - N8N Indonesia Community",
  description: "Berita terbaru dan informasi seputar N8N Indonesia Community",
};

export default function NewsPage() {
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
          top: "75vh",
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
              <h1 className="hero-title-main">Berita &</h1>
              <h2 className="hero-title-sub">Informasi</h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl">
                Dapatkan informasi terbaru seputar N8N, workflow automation, dan komunitas Indonesia
              </div>
            </div>
          </div>

          {/* Mobile: Deskripsi */}
          <div className="md:hidden flex flex-col items-start w-full mt-6">
            <div className="hero-description max-w-3xl">
              Dapatkan informasi terbaru seputar N8N, workflow automation, dan komunitas Indonesia
            </div>
          </div>
        </div>

        {/* News Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-28 md:mt-32">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
                <span className="text-white text-sm">2 jam yang lalu</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                N8N Indonesia Community Resmi Diluncurkan!
              </h2>
              <p className="text-white mb-6 leading-relaxed">
                Komunitas N8N Indonesia telah resmi diluncurkan sebagai platform untuk berbagi workflow automation yang powerful. 
                Bergabunglah dengan ribuan developer dan automation enthusiast di Indonesia.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N8N</span>
                </div>
                <div>
                  <p className="text-white font-medium">N8N Indonesia Team</p>
                  <p className="text-white text-sm">Official Community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regular News Items */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Tutorial
              </span>
                              <span className="text-white text-sm">1 hari yang lalu</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Cara Membuat Workflow Automation Pertama Anda
            </h3>
            <p className="text-white mb-4 leading-relaxed">
              Panduan lengkap untuk pemula dalam membuat workflow automation menggunakan N8N. 
              Mulai dari setup hingga deployment.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <p className="text-white font-medium text-sm">Tech Writer</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Update
              </span>
                              <span className="text-white text-sm">3 hari yang lalu</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              N8N v1.0.0 - Fitur Baru yang Menarik
            </h3>
            <p className="text-white mb-4 leading-relaxed">
              Rilis terbaru N8N membawa fitur-fitur baru yang akan meningkatkan produktivitas 
              workflow automation Anda.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <p className="text-white font-medium text-sm">Update Team</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Event
              </span>
                              <span className="text-white text-sm">1 minggu yang lalu</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Webinar: Advanced N8N Workflows
            </h3>
            <p className="text-white mb-4 leading-relaxed">
              Bergabung dengan webinar gratis untuk mempelajari teknik advanced dalam 
              membuat workflow automation yang kompleks.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <p className="text-white font-medium text-sm">Event Team</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Community
              </span>
                              <span className="text-white text-sm">2 minggu yang lalu</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Meetup Jakarta: N8N Community Gathering
            </h3>
            <p className="text-white mb-4 leading-relaxed">
              Pertemuan komunitas N8N Indonesia di Jakarta. Networking, sharing session, 
              dan demo workflow terbaik.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <p className="text-white font-medium text-sm">Community Manager</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Tips
              </span>
                              <span className="text-white text-sm">3 minggu yang lalu</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              10 Tips Optimasi Workflow N8N
            </h3>
            <p className="text-white mb-4 leading-relaxed">
              Kumpulan tips dan trik untuk mengoptimalkan performa workflow N8N Anda 
              agar berjalan lebih efisien.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <p className="text-white font-medium text-sm">Expert Contributor</p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-8 border border-purple-400/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tetap Terinformasi
            </h2>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Dapatkan berita terbaru dan tips workflow automation langsung ke email Anda. 
              Bergabung dengan newsletter kami untuk tidak ketinggalan informasi penting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                Berlangganan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 