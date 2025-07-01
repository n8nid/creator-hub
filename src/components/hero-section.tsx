import React from "react";
import { ArrowRight, Zap, Users, ExternalLink } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen animated-gradient text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float-reverse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float-delayed"></div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-10 lg:flex lg:items-center lg:min-h-screen">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-purple-300 px-6 py-3 rounded-full text-sm font-medium mb-8 hover:bg-white/15 transition-all duration-300">
            <Zap className="w-4 h-4" />
            Automation Community Indonesia
          </div>

          {/* Main heading with staggered animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-none">
            <span className="block mb-2">
              {'N8N Indonesia'.split('').map((char, index) => (
                <span
                  key={index}
                  className="sparkle-letter inline-block bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 bg-clip-text text-transparent relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
            <span className="block text-white text-4xl md:text-5xl lg:text-6xl font-light hover:text-purple-200 transition-colors duration-300">
              Community
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-3xl text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
            Temukan dan bagikan workflow automation yang powerful.
            <br className="hidden md:block" />
            Bergabunglah dengan komunitas N8N Indonesia dan tingkatkan
            produktivitas Anda.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400 text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">150+</div>
              <div className="text-gray-400 text-sm">Workflows Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Community Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-6">
            <a
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              href="/workflows"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Jelajahi Workflow</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              className="group relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              href="/directory"
            >
              <Users className="w-5 h-5" />
              <span>Temukan Creator</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              href="https://n8nid.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <Users className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Join Discord</span>
              <ExternalLink className="w-4 h-4 relative z-10" />
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto">
              <div className="w-1 h-3 bg-white/50 rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
