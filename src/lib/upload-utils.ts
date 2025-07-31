import { supabase } from "./supabase";

export async function uploadWorkflowImage(file: File): Promise<string> {
  try {
    // Try API route first (bypasses RLS)
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-workflow-image", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    }

    // Fallback to direct upload if API route fails
    console.log("API route failed, trying direct upload...");

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("workflow-preview")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("workflow-preview")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function deleteWorkflowImage(url: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      throw new Error("Invalid URL format");
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("workflow-preview")
      .remove([fileName]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
