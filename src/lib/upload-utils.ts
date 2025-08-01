import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface UploadConfig {
  bucket: "events" | "news";
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
}

export const UPLOAD_CONFIGS: Record<string, UploadConfig> = {
  events: {
    bucket: "events",
    maxSize: 2 * 1024 * 1024, // 2MB (reduced for compatibility)
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxWidth: 1920,
    maxHeight: 1080,
  },
  news: {
    bucket: "news",
    maxSize: 2 * 1024 * 1024, // 2MB (reduced for compatibility)
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxWidth: 1920,
    maxHeight: 1080,
  },
};

export function validateFile(
  file: File,
  config: UploadConfig
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${config.maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${config.allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

export function generateFileName(originalName: string, bucket: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();

  return `${bucket}-${timestamp}-${randomId}.${extension}`;
}

export async function uploadImage(
  file: File,
  bucket: "events" | "news",
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  const supabase = createClientComponentClient();
  const config = UPLOAD_CONFIGS[bucket];

  // Validate file
  const validation = validateFile(file, config);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate unique filename
  const fileName = generateFileName(file.name, bucket);
  const filePath = `public/${fileName}`;

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    throw new Error(
      `Upload failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function deleteImage(
  path: string,
  bucket: "events" | "news"
): Promise<void> {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    throw new Error(
      `Delete failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
