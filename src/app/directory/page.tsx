"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CreatorCard from "@/components/creator-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, MapPin, Star, Award } from "lucide-react";
import { DirectoryLoading } from "@/components/directory-loading";

interface Creator {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  experience_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  profile_image: string | null;
  hourly_rate: number | null;
  availability: "available" | "busy" | "unavailable" | null;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at?: string;
}

export default function DirectoryPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching creators:", error);
        return;
      }

      setCreators(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesExperience =
      filterExperience === "all" ||
      creator.experience_level === filterExperience;
    const matchesAvailability =
      filterAvailability === "all" ||
      creator.availability === filterAvailability;
    const matchesLocation =
      filterLocation === "all" ||
      creator.location?.toLowerCase().includes(filterLocation.toLowerCase());

    return (
      matchesSearch &&
      matchesExperience &&
      matchesAvailability &&
      matchesLocation
    );
  });

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "experience":
        const experienceOrder = {
          expert: 4,
          advanced: 3,
          intermediate: 2,
          beginner: 1,
        };
        const aLevel = a.experience_level || "intermediate";
        const bLevel = b.experience_level || "intermediate";
        return (
          (experienceOrder[bLevel as keyof typeof experienceOrder] || 0) -
          (experienceOrder[aLevel as keyof typeof experienceOrder] || 0)
        );
      case "rate":
        return (b.hourly_rate || 0) - (a.hourly_rate || 0);
      case "newest":
      default:
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
    }
  });

  const stats = {
    totalCreators: creators.length,
    availableCreators: creators.filter((c) => c.availability === "available")
      .length,
    expertCreators: creators.filter((c) => c.experience_level === "expert")
      .length,
    averageRating: 4.6, // Dummy data
  };

  const uniqueLocations = Array.from(
    new Set(creators.map((c) => c.location).filter(Boolean))
  );

  if (loading) {
    return <DirectoryLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">
          Directory Creator
        </h1>
        <p className="text-gray-600">
          Temukan dan hubungi creator automation terbaik dari seluruh Indonesia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Creator</p>
                <p className="text-2xl font-bold">{stats.totalCreators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tersedia</p>
                <p className="text-2xl font-bold">{stats.availableCreators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expert Level</p>
                <p className="text-2xl font-bold">{stats.expertCreators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 fill-current" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating Rata-rata</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari creator, skill, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterExperience}
              onValueChange={setFilterExperience}
            >
              <SelectTrigger>
                <SelectValue placeholder="Level Pengalaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterAvailability}
              onValueChange={setFilterAvailability}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status Ketersediaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="busy">Sibuk</SelectItem>
                <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="name">Nama A-Z</SelectItem>
                <SelectItem value="experience">Level Tertinggi</SelectItem>
                <SelectItem value="rate">Rate Tertinggi</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterExperience("all");
                setFilterAvailability("all");
                setFilterLocation("all");
                setSortBy("newest");
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Menampilkan {sortedCreators.length} dari {creators.length} creator
          </p>
          <Badge variant="secondary">{sortedCreators.length} hasil</Badge>
        </div>
      </div>

      {/* Creators Grid */}
      {sortedCreators.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Tidak ada creator ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterExperience("all");
                setFilterAvailability("all");
                setFilterLocation("all");
                setSortBy("newest");
              }}
            >
              Reset Filter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              variant="default"
              showStats={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
