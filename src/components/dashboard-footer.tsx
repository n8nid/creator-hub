import React from "react";
import { MessageCircle, Instagram, Github } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-300 px-2 sm:px-6 py-6 sm:py-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Konten utama */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16 lg:gap-16 xl:gap-0">
          {/* Kiri: Judul & Deskripsi */}
          <div className="flex items-start">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight pr-[7.813rem] text-gray-900">
              N8N Indonesia
              <br />
              <span className="font-light text-gray-600">Community</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-md">
              Komunitas automation terbesar di Indonesia. Bergabunglah dengan
              ribuan developer yang membangun workflow powerful.
            </p>
          </div>

          {/* Kanan: Menu */}
          <div className="flex flex-row gap-16 md:gap-24 mt-8 md:mt-0">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Explore</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a
                    href="/workflows"
                    className="hover:underline transition-colors"
                  >
                    Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="/creators"
                    className="hover:underline transition-colors"
                  >
                    Creator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">About Us</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:underline transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline transition-colors">
                    Service Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Garis horizontal */}
        <div className="w-full border-t border-gray-300 my-8"></div>

        {/* Bawah: copyright & ikon sosial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
            &copy; 2025 N8N Indonesia Creator Hub. Made with ❤️ by the
            community.
          </p>
          <div className="flex items-center gap-6 mt-2 md:mt-0">
            <a
              href="https://n8nid.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/programmer30an"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
