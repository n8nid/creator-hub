"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, DollarSign, Search, Filter, Workflow } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export function TalentDirectory() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [experienceFilter, setExperienceFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [skillFilter, setSkillFilter] = useState<string>("all")

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesExperience = experienceFilter === "all" || profile.experience_level === experienceFilter
    const matchesAvailability = availabilityFilter === "all" || profile.availability === availabilityFilter
    const matchesSkill = skillFilter === "all" || profile.skills?.includes(skillFilter)

    return matchesSearch && matchesExperience && matchesAvailability && matchesSkill
  })

  const allSkills = Array.from(new Set(profiles.flatMap((p) => p.skills || [])))

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Automation Talent Directory</h1>
            <p className="text-gray-600">Discover skilled automation experts and workflow specialists</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Workflow className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search talents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredProfiles.length} of {profiles.length} talents
        </div>
      </div>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_image || undefined} />
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{profile.name}</h3>
                  {profile.location && (
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    {profile.experience_level && (
                      <Badge variant="secondary" className="text-xs">
                        {profile.experience_level}
                      </Badge>
                    )}
                    {profile.availability && (
                      <Badge variant={profile.availability === "available" ? "default" : "outline"} className="text-xs">
                        {profile.availability}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{profile.bio}</p>

              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {profile.hourly_rate && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <DollarSign className="h-3 w-3 mr-1" />${profile.hourly_rate}/hr
                  </div>
                )}
                <Button asChild size="sm">
                  <Link href={`/talent/${profile.id}`}>View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No talents found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
