"use client";

import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ui/image-upload";

interface ContentImageUploadProps {
  bucket: "events" | "news";
  onImageChange: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ContentImageUpload({
  bucket,
  onImageChange,
  currentImage,
  className,
}: ContentImageUploadProps) {
  const { toast } = useToast();

  const handleUploadComplete = (url: string, path: string) => {
    onImageChange(url);
    toast({
      title: "Upload successful",
      description: "Image uploaded successfully",
    });
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleRemove = () => {
    onImageChange("");
    toast({
      title: "Image removed",
      description: "Image has been removed",
    });
  };

  return (
    <ImageUpload
      bucket={bucket}
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      onRemove={handleRemove}
      currentImage={currentImage}
      className={className}
    />
  );
}
