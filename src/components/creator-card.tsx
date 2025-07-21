import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, DollarSign, Users } from "lucide-react";
import Link from "next/link";

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

interface CreatorCardProps {
  creator: Creator;
  variant?: "default" | "compact" | "featured";
  showStats?: boolean;
}

export default function CreatorCard({
  creator,
  variant = "default",
  showStats = false,
}: CreatorCardProps) {
  const getExperienceColor = (level: string | null) => {
    switch (level) {
      case "expert":
        return "bg-purple-100 text-purple-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "intermediate":
        return "bg-green-100 text-green-800";
      case "beginner":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (status: string | null) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (status: string | null) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "busy":
        return "Sibuk";
      case "unavailable":
        return "Tidak Tersedia";
      default:
        return "Tidak Diketahui";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Styling untuk variant featured
  const getCardStyle = () => {
    if (variant === "featured") {
      return "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300";
    }
    return "bg-white hover:shadow-lg transition-shadow duration-200";
  };

  const getTextStyle = () => {
    if (variant === "featured") {
      return "text-white";
    }
    return "text-gray-900";
  };

  const getSubTextStyle = () => {
    if (variant === "featured") {
      return "text-gray-300";
    }
    return "text-gray-600";
  };

  return (
    <Card
      className={`h-full transition-all duration-200 ${
        variant !== "compact" ? "hover:shadow-xl hover:scale-[1.03]" : ""
      } ${getCardStyle()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={creator.profile_image || undefined}
              alt={creator.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
              {getInitials(creator.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-lg truncate ${getTextStyle()}`}
                >
                  {creator.name}
                </h3>
                {creator.location && (
                  <div
                    className={`flex items-center gap-1 text-sm mt-1 ${getSubTextStyle()}`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{creator.location}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <Badge className={getExperienceColor(creator.experience_level)}>
                  {creator.experience_level || "Intermediate"}
                </Badge>
                <Badge
                  variant="outline"
                  className={getAvailabilityColor(creator.availability)}
                >
                  {getAvailabilityText(creator.availability)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {creator.bio && (
          <p className={`text-sm mb-3 line-clamp-2 ${getSubTextStyle()}`}>
            {creator.bio}
          </p>
        )}

        {creator.skills && creator.skills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {creator.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {creator.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{creator.skills.length - 3} lagi
                </Badge>
              )}
            </div>
          </div>
        )}

        {showStats && (
          <div
            className={`grid grid-cols-3 gap-2 mb-3 text-xs ${getSubTextStyle()}`}
          >
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>4.8</span>
            </div>
            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-gray-500" />
              <span>1.2k</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-green-500" />
              <span>24h</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {creator.hourly_rate && (
            <div className="flex items-center gap-1 text-sm font-medium">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className={getTextStyle()}>
                Rp {creator.hourly_rate.toLocaleString()}/jam
              </span>
            </div>
          )}

          <Link href={`/talent/${creator.id}`}>
            <Button
              size="sm"
              variant={variant === "featured" ? "secondary" : "outline"}
              className={
                variant === "featured"
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  : ""
              }
            >
              Lihat Profil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
