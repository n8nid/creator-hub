"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ContentImageUpload from "@/components/admin/content-image-upload";

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    event_date: "",
    location: "",
    image_url: "",
    is_featured: false,
    status: "draft",
    pendaftaran_link: "",
    nomor_penyelenggara: "",
    instagram_penyelenggara: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange("title", title);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      handleInputChange("slug", generateSlug(title));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/content/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        router.push("/admin/content");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create event",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="admin-page-header-title">Create Event</h1>
          <p className="text-muted-foreground">
            Add a new event to your community
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="event-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly version of the title
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) =>
                  handleInputChange("event_date", e.target.value)
                }
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter event location"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              <ContentImageUpload
                bucket="events"
                onImageChange={(url) => handleInputChange("image_url", url)}
                currentImage={formData.image_url}
              />
              <p className="text-sm text-muted-foreground">
                Upload an image for your event. Supports JPG, PNG, WebP up to
                5MB.
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  handleInputChange("is_featured", checked)
                }
              />
              <Label htmlFor="is_featured">Featured Event</Label>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Registration & Contact Section */}
            <div className="space-y-6 pt-6 border-t">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Event Registration & Contact
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fill in the event registration and contact information
                  (optional)
                </p>
              </div>

              {/* Link Pendaftaran */}
              <div className="space-y-2">
                <Label htmlFor="pendaftaran_link">
                  Link Pendaftaran (Google Form)
                </Label>
                <Input
                  id="pendaftaran_link"
                  type="url"
                  value={formData.pendaftaran_link}
                  onChange={(e) =>
                    handleInputChange("pendaftaran_link", e.target.value)
                  }
                  placeholder="https://forms.google.com/..."
                />
                <p className="text-sm text-muted-foreground">
                  Link Google Form untuk pendaftaran event
                </p>
              </div>

              {/* Nomor WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="nomor_penyelenggara">
                  Nomor WhatsApp Penyelenggara
                </Label>
                <Input
                  id="nomor_penyelenggara"
                  value={formData.nomor_penyelenggara}
                  onChange={(e) =>
                    handleInputChange("nomor_penyelenggara", e.target.value)
                  }
                  placeholder="6281234567890"
                />
                <p className="text-sm text-muted-foreground">
                  Nomor WhatsApp penyelenggara event (format: 6281234567890)
                </p>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor="instagram_penyelenggara">
                  Instagram Penyelenggara
                </Label>
                <Input
                  id="instagram_penyelenggara"
                  value={formData.instagram_penyelenggara}
                  onChange={(e) =>
                    handleInputChange("instagram_penyelenggara", e.target.value)
                  }
                  placeholder="@username atau username"
                />
                <p className="text-sm text-muted-foreground">
                  Username Instagram penyelenggara event (dengan atau tanpa @)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Create Event
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
