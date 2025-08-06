import React from "react";
import { Github } from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="footer-transparent container-box relative w-full text-white overflow-hidden mt-[15rem]">
      <div className="relative w-full pt-8 pb-12 flex flex-col">
        {/* Konten utama */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-0">
          {/* Kiri: Judul & Deskripsi */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-0">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight md:pr-[7.813rem]">
              N8N Indonesia
              <br />
              <span className="font-light">Community</span>
            </h2>
            <p className="paragraph-17-regulertext-white/80 max-w-md md:max-w-lg">
              Komunitas automation terbesar di Indonesia. Bergabunglah dengan
              ribuan developer yang membangun workflow powerful.
            </p>
          </div>
          {/* Kanan: Menu */}
          <div className="flex flex-row gap-16 md:gap-20 lg:gap-24 mt-8 md:mt-0">
            <div>
              <h4 className="font-semibold mb-3">Explore</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="/workflows" className="hover:underline">
                    Workflow
                  </a>
                </li>
                <li>
                  <a href="/creators" className="hover:underline">
                    Creator
                  </a>
                </li>
                <li>
                  <a href="/news/upcoming-events" className="hover:underline">
                    Upcoming Events
                  </a>
                </li>
                <li>
                  <a href="/news/news-report" className="hover:underline">
                    News & Report
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About Us</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#" className="hover:underline">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Service Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Garis horizontal */}
        <div className="w-full border-t border-white/20 my-8"></div>
        {/* Bawah: copyright & ikon sosial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-white/60 text-center md:text-left">
            &copy; 2025 N8N Indonesia Creator Hub. Made with by the community.
          </p>
          <div className="flex items-center gap-6 mt-2 md:mt-0">
            <a
              href="https://discord.gg/n8nindonesia"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9460CD] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <a
              href="https://x.com/n8n_io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9460CD] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com/n8nid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9460CD] transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
