import React from "react";
import { MessageCircle, Instagram, Github } from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="footer-container relative w-full text-white overflow-hidden">
      <div className="relative z-10 w-full flex flex-col">
        {/* Konten utama */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:justify-between">
          {/* Kolom 1 & 2: Brand + Deskripsi (didekatkan) */}
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-24">
            {/* Kolom 1: Brand */}
            <div>
              <h2 className="footer-brand-title mb-2">
                N8N Indonesia
                <br />
                <span className="footer-brand-subtitle">Community</span>
              </h2>
            </div>
            {/* Kolom 2: Deskripsi */}
            <div>
              <p className="footer-description max-w-md">
                Komunitas automation terbesar di Indonesia. Bergabunglah dengan
                ribuan developer yang membangun workflow powerful.
              </p>
            </div>
          </div>
          {/* Kolom 3: Menu */}
          <div className="flex flex-row gap-16 md:gap-24">
            <div>
              <h4 className="footer-section-title mb-3">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/workflows" className="footer-link">
                    Workflow
                  </a>
                </li>
                <li>
                  <a href="/directory" className="footer-link">
                    Creator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="footer-section-title mb-3">About Us</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="footer-link">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Service Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Garis horizontal */}
        <div className="footer-separator"></div>
        {/* Bawah: copyright & ikon sosial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="footer-copyright text-center md:text-left">
            &copy; 2025 N8N Indonesia Creator Hub. Made with by the community.
          </p>
          <div className="flex items-center gap-6 mt-2 md:mt-0">
            <a
              href="https://n8nid.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
            >
              <MessageCircle className="w-full h-full" />
            </a>
            <a
              href="https://instagram.com/programmer30an"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
            >
              <Instagram className="w-full h-full" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
            >
              <Github className="w-full h-full" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
