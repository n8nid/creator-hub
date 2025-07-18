import React from "react";
import { MessageCircle, Instagram, Github } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-300 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Konten utama */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0">
          {/* Kiri: Judul & Deskripsi */}
          <div className="flex-1 min-w-[260px]">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              N8N Indonesia
              <br />
              <span className="font-light text-gray-600">Community</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-md mt-2">
              Komunitas automation terbesar di Indonesia. Bergabunglah dengan
              ribuan developer yang membangun workflow powerful.
            </p>
          </div>

          {/* Kanan: Menu */}
          <div className="flex flex-row gap-16 md:gap-24">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                Explore
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/workflows"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="/directory"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Creator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                About Us
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Service Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Garis horizontal */}
        <div className="w-full border-t border-gray-300 my-6"></div>

        {/* Bawah: copyright & ikon sosial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; 2025 N8N Indonesia Creator Hub. Made with ❤️ by the
            community.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://n8nid.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/programmer30an"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
