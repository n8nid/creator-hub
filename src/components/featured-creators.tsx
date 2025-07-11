"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, Award, Users } from "lucide-react";

const FeaturedCreators = () => {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/creators");
        const json = await res.json();
        if (res.ok) {
          setCreators(json.creators || []);
        } else {
          setError(json.error || "Gagal memuat data creator");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data creator");
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Creator Terbaik
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Creator{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unggulan
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Temui para ahli automation terbaik yang telah menciptakan workflow
            inovatif untuk komunitas
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-3 text-center text-white">Loading...</div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-400">{error}</div>
          ) : creators.length === 0 ? (
            <div className="col-span-3 text-center text-gray-300">
              Belum ada creator terdaftar.
            </div>
          ) : (
            creators.slice(0, 3).map((creator: any, index: number) => (
              <div
                key={creator.id}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                {/* Rank badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Avatar with glow effect */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Avatar className="w-28 h-28 mx-auto relative border-4 border-white/20 shadow-xl">
                    <AvatarImage
                      src={creator.profile_image || undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                      {creator.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Creator info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-purple-300 text-sm font-medium mb-4 bg-purple-500/20 px-3 py-1 rounded-full inline-block">
                    {creator.experience_level || "-"}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white font-semibold text-sm">
                          -
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-white font-semibold text-sm">
                          -
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">Workflows</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-white font-semibold text-sm">
                          -
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">Followers</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <a href="/directory" className="inline-flex items-center gap-2">
              <Users className="w-5 h-5" />
              Lihat Semua Creator
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
