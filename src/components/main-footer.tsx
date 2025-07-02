import React from "react";
import {
  MessageCircle,
  Users,
  Heart,
  Mail,
  Instagram,
  Github,
  ExternalLink,
} from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden border-t border-gray-200">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366F1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                N8N Indonesia
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Komunitas automation terbesar di Indonesia. Bergabunglah dengan
                ribuan developer yang membangun workflow powerful.
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="https://n8nid.com/"
                className="group p-3 bg-white border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              </a>
              <a
                href="https://instagram.com/programmer30an"
                className="group p-3 bg-white border border-gray-200 rounded-xl hover:bg-pink-50 hover:border-pink-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-pink-600 group-hover:text-pink-700" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
              </a>
            </div>
          </div>

          {/* Community section */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-purple-600" />
              Community
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://n8nid.com/"
                  className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Discord</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="/workflows"
                  className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-all duration-200"
                >
                  <span>Browse Workflows</span>
                </a>
              </li>
              <li>
                <a
                  href="/directory"
                  className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-all duration-200"
                >
                  <span>Find Creators</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contributors section */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Heart className="w-5 h-5 text-red-500" />
              Contributors
            </h3>
            {/* Compact grid layout for scalability */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href="https://instagram.com/programmer30an"
                className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
                title="Faris Adlin"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  F
                </div>
                <span className="text-sm truncate">Faris Adlin</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </a>
              {/* Placeholder for future contributors */}
              <div className="flex items-center gap-2 text-gray-400 p-2 rounded-lg border-2 border-dashed border-gray-300">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                  +
                </div>
                <span className="text-sm">Join us!</span>
              </div>
            </div>
            {/* Show more link for when there are many contributors */}
            <a
              href="/contributors"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              View all contributors
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Sponsors Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-blue-500" />
              Sponsors
            </h3>
            {/* Grid layout for sponsor logos/cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Placeholder sponsor cards */}
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Your Logo
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full h-8 bg-gradient-to-r from-green-100 to-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Your Logo
                  </span>
                </div>
              </div>
            </div>
            {/* Call to action */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm mb-3">
                Support our mission to empower creators
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:sponsor@creatorhub.com"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  Become a Sponsor
                </a>
                <a
                  href="/sponsors"
                  className="text-xs text-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  View all sponsors
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} N8N Indonesia Creator Hub. Made
              with <Heart className="w-4 h-4 inline text-red-500" /> by the
              community.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
