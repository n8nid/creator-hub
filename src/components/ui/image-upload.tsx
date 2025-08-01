"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Upload,
  Image,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/upload-utils";

interface ImageUploadProps {
  bucket: "events" | "news";
  onUploadComplete: (url: string, path: string) => void;
  onUploadError: (error: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUpload({
  bucket,
  onUploadComplete,
  onUploadError,
  onRemove,
  currentImage,
  className,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    currentImage || null
  );
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    []
  );

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload to API
      const response = await fetch(`/api/admin/upload/${bucket}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setUploadProgress(100);
      setUploadedImage(data.url);
      setUploadedPath(data.path);

      onUploadComplete(data.url, data.path);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (uploadedPath) {
      try {
        await fetch(
          `/api/admin/upload/${bucket}?path=${encodeURIComponent(
            uploadedPath
          )}`,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    setUploadedImage(null);
    setUploadedPath(null);
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = uploadedImage || currentImage;

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {displayImage ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={displayImage}
                alt="Uploaded image"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleClick}
                  disabled={isUploading}
                  className="bg-white/90 hover:bg-white"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="bg-white/90 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className="p-8 text-center">
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading image...</p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, WebP up to 5MB
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
