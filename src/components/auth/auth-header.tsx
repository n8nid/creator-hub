import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between px-6 md:border-0">
      {/* Logo dan Brand di Kiri */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-200"
        >
          {/* N8N Logo - Node yang saling terhubung */}
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Node 1 - Left */}
              <circle cx="2" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 2 - Left Center */}
              <circle cx="7" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 3 - Center */}
              <circle cx="12" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 4 - Right Top */}
              <circle cx="17" cy="6" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 5 - Right Bottom */}
              <circle cx="17" cy="18" r="1.8" fill="currentColor" opacity="1" />

              {/* Koneksi antar node - garis tipis tapi panjang dan jelas */}
              <path
                d="M3.8 12L5.2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="1"
                strokeLinecap="round"
              />
              <path
                d="M8.8 12L10.2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="1"
                strokeLinecap="round"
              />
              <path
                d="M13.8 12L15.2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="1"
                strokeLinecap="round"
              />
              <path
                d="M15.2 12L17 6"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="1"
                strokeLinecap="round"
              />
              <path
                d="M15.2 12L17 18"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="1"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Teks N8N ID */}
          <span className="text-lg font-semibold tracking-wide">n8n ID</span>
        </Link>
      </div>

      {/* Elemen di Kanan - bisa ditambahkan nanti jika diperlukan */}
      <div className="flex items-center gap-4">
        {/* Placeholder untuk elemen tambahan seperti help, docs, dll */}
      </div>
    </header>
  );
}
