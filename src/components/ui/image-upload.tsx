"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  className,
  placeholder = "Upload gambar workflow",
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        await handleFileUpload(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const file = files[0];
        await handleFileUpload(file);
      }
    },
    []
  );

  const handleFileUpload = async (file: File) => {
    if (disabled || isUploading) return;

    // File validation for security
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      console.error("ImageUpload: Invalid file type");
      toast.error("Hanya file gambar yang diizinkan (JPG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > maxSize) {
      console.error("ImageUpload: File too large");
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Try API route first
      console.log("ImageUpload: Trying API route...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-workflow-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("ImageUpload: API route success:", data);
        onChange(data.url);
        return;
      }

      // Fallback to upload utils
      console.log("ImageUpload: API route failed, trying upload utils...");
      const url = await onUpload(file);
      onChange(url);
    } catch (error) {
      console.error("ImageUpload: Upload failed:", error);
      toast.error("Upload gagal. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Workflow preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !disabled && !isUploading && fileInputRef.current?.click()
          }
        >
          <div className="flex flex-col items-center space-y-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? "Uploading..." : placeholder}
              </p>
              <p className="text-xs text-gray-500">
                {isUploading
                  ? "Please wait..."
                  : "Drag & drop gambar workflow atau klik untuk memilih"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
