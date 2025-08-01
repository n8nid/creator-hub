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

export default function CreateNewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published_date: "",
    image_url: "",
    is_featured: false,
    status: "draft",
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
      const response = await fetch("/api/admin/content/news", {
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
          description: "News article created successfully",
        });
        router.push("/admin/content");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create news article",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create news article",
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
          <h1 className="text-3xl font-bold">Create News Article</h1>
          <p className="text-muted-foreground">
            Add a new news article to your community
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>News Article Details</CardTitle>
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
                placeholder="Enter news title"
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
                placeholder="news-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly version of the title
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Enter a brief excerpt of the article"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                A short summary that will appear in previews
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter the full article content"
                rows={8}
              />
            </div>

            {/* Published Date */}
            <div className="space-y-2">
              <Label htmlFor="published_date">Published Date *</Label>
              <Input
                id="published_date"
                type="datetime-local"
                value={formData.published_date}
                onChange={(e) =>
                  handleInputChange("published_date", e.target.value)
                }
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>News Image</Label>
              <ContentImageUpload
                bucket="news"
                onImageChange={(url) => handleInputChange("image_url", url)}
                currentImage={formData.image_url}
              />
              <p className="text-sm text-muted-foreground">
                Upload an image for your news article. Supports JPG, PNG, WebP
                up to 5MB.
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
              <Label htmlFor="is_featured">Featured Article</Label>
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
                </SelectContent>
              </Select>
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
                Create News Article
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
