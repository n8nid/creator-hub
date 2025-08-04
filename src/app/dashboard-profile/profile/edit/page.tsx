"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Youtube,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { PROVINCES } from "@/data/indonesia-regions";
import { FaDiscord } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const defaultProfileForm = {
  name: "",
  bio: "",
  about_markdown: "",
  website: "",
  linkedin: "",
  twitter: "",
  github: "",
  experience_level: "",
  availability: "",
  location: "",
  instagram: "",
  threads: "",
  discord: "",
  youtube: "",
  whatsapp: "",
};

export default function EditProfilePage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(defaultProfileForm);
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error fetching profile:", error);
        }
        
        setProfile(data);
        
        if (data) {
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            about_markdown: data.about_markdown || "",
            website: data.website || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            github: data.github || "",
            experience_level: data.experience_level || "",
            availability: data.availability || "",
            location: data.location || "",
            instagram: data.instagram || "",
            threads: data.threads || "",
            discord: data.discord || "",
            youtube: data.youtube || "",
            whatsapp: data.Whatsapp || "",
          });
          setSkills(data.skills || []);
          setProfileImage(data.profile_image || "");
          
          // Parse location data
          if (data.location) {
            const locationParts = data.location.split(", ");
            if (locationParts.length >= 2) {
              setProvinsi(locationParts[0].trim());
              setKota(locationParts[1].trim());
            } else if (locationParts.length === 1) {
              setProvinsi(locationParts[0].trim());
              setKota("");
            }
          } else {
            setProvinsi("");
            setKota("");
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Helper function untuk memformat nomor WhatsApp
  const formatWhatsAppNumber = (number: string): string => {
    const cleanNumber = number.replace(/\s/g, '');
    
    // Jika sudah dalam format yang benar, return as is
    if (/^08[0-9]{8,12}$/.test(cleanNumber)) {
      return cleanNumber;
    }
    if (/^\+628[0-9]{8,12}$/.test(cleanNumber)) {
      return cleanNumber;
    }
    if (/^628[0-9]{8,12}$/.test(cleanNumber)) {
      return cleanNumber;
    }
    
    // Jika dimulai dengan 0, ubah ke format 62
    if (/^0[0-9]{8,12}$/.test(cleanNumber)) {
      return '62' + cleanNumber.substring(1);
    }
    
    return cleanNumber;
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = "Nama wajib diisi.";
    if (form.website && !/^https?:\/\//.test(form.website))
      errors.website = "Website harus diawali http(s)://";
    

    if (form.whatsapp) {
      const cleanNumber = form.whatsapp.replace(/\s/g, '');
      
      // Validasi format dan panjang nomor WhatsApp Indonesia
      let isValid = false;
      
      // Cek panjang total dan format
      const length = cleanNumber.length;
      
      // Format: 08xxx (10-13 digit total)
      if (/^08[0-9]+$/.test(cleanNumber) && length >= 10 && length <= 13) {
        isValid = true;
      }
      // Format: +628xxx (12-15 digit total)
      else if (/^\+628[0-9]+$/.test(cleanNumber) && length >= 12 && length <= 15) {
        isValid = true;
      }
      // Format: 628xxx (11-14 digit total)
      else if (/^628[0-9]+$/.test(cleanNumber) && length >= 11 && length <= 14) {
        isValid = true;
      }
      
      if (!isValid) {
      errors.whatsapp = "Format nomor Whatsapp tidak valid. Gunakan format: 08123456789 atau +628123456789";
      }
    }
    // Bisa tambah validasi lain jika perlu
    return errors;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file || !file.name) return;

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error(
        "Format file tidak valid. Hanya file gambar JPG, JPEG, atau PNG yang diperbolehkan."
      );
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setTempImageFile(file);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCropComplete = async () => {
    if (!tempImageFile || !user) return;

    try {
      console.log("Starting crop process...");
      console.log("Crop values:", crop);
      console.log("Temp image file:", tempImageFile.name);

      // Create canvas for cropping
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        console.error("Failed to get canvas context");
        toast.error("Gagal memproses gambar: Canvas context tidak tersedia");
        return;
      }

      const img = new Image();
      
      // Set up image loading with proper error handling
      img.onload = () => {
        console.log("Image loaded successfully");
        console.log("Image natural dimensions:", img.naturalWidth, "x", img.naturalHeight);
        
        // Set fixed output size for consistency (400x400 pixels)
        const outputSize = 400;

        // Calculate crop dimensions based on unit (px or %)
        let cropWidth, cropHeight, cropX, cropY;
        
        if (crop.unit === 'px') {
          // ReactCrop provides pixel values based on the preview image size
          // We need to scale these coordinates to match the original image dimensions
          
          // Get the preview image element to calculate scaling
          const previewImg = document.querySelector('.ReactCrop__image') as HTMLImageElement;
          let scaleX = 1, scaleY = 1;
          
          if (previewImg) {
            scaleX = img.naturalWidth / previewImg.width;
            scaleY = img.naturalHeight / previewImg.height;
            console.log("Scaling factors:", { scaleX, scaleY, previewWidth: previewImg.width, previewHeight: previewImg.height });
          } else {
            // Fallback: try to find the image in the crop modal
            const cropModalImg = document.querySelector('.w-96.h-96 img') as HTMLImageElement;
            if (cropModalImg) {
              scaleX = img.naturalWidth / cropModalImg.width;
              scaleY = img.naturalHeight / cropModalImg.height;
              console.log("Fallback scaling factors:", { scaleX, scaleY, modalImgWidth: cropModalImg.width, modalImgHeight: cropModalImg.height });
            } else {
              console.warn("Could not find preview image for scaling, using 1:1 scale");
            }
          }
          
          // Apply scaling to convert preview coordinates to original image coordinates
          cropWidth = Math.max(1, crop.width * scaleX);
          cropHeight = Math.max(1, crop.height * scaleY);
          cropX = Math.max(0, crop.x * scaleX);
          cropY = Math.max(0, crop.y * scaleY);
          
          // Validate scaling factors to prevent extreme values
          if (scaleX > 10 || scaleY > 10 || scaleX < 0.1 || scaleY < 0.1) {
            console.warn("Extreme scaling factors detected:", { scaleX, scaleY });
            console.warn("This might indicate incorrect preview image detection");
          }
          
          console.log("Scaled crop coordinates:", {
            originalCrop: { x: crop.x, y: crop.y, width: crop.width, height: crop.height },
            scaledCrop: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
            scaleFactors: { scaleX, scaleY }
          });
        } else {
          // Fallback to percentage calculation
          cropWidth = Math.max(1, (crop.width / 100) * img.naturalWidth);
          cropHeight = Math.max(1, (crop.height / 100) * img.naturalHeight);
          cropX = Math.max(0, (crop.x / 100) * img.naturalWidth);
          cropY = Math.max(0, (crop.y / 100) * img.naturalHeight);
        }

        console.log("Calculated crop dimensions:", {
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          outputSize,
          imageWidth: img.naturalWidth,
          imageHeight: img.naturalHeight,
          cropValues: crop,
          cropUnit: crop.unit
        });

        // Validate crop dimensions with tolerance for rounding errors
        if (cropWidth <= 0 || cropHeight <= 0) {
          console.error("Invalid crop dimensions:", { cropWidth, cropHeight });
          toast.error("Area crop tidak valid. Silakan coba lagi.");
          return;
        }

        // Check if crop area is too small (less than 50x50 pixels)
        const minCropSize = 50;
        if (cropWidth < minCropSize || cropHeight < minCropSize) {
          console.warn("Crop area is very small:", { cropWidth, cropHeight, minCropSize });
          // Don't show error, just log warning and continue
        }

        // Validate that crop area is reasonable (not larger than image)
        if (cropWidth > img.naturalWidth * 1.1 || cropHeight > img.naturalHeight * 1.1) {
          console.error("Crop area is unreasonably large:", { 
            cropWidth, 
            cropHeight, 
            imageWidth: img.naturalWidth, 
            imageHeight: img.naturalHeight 
          });
          toast.error("Area crop terlalu besar. Silakan pilih area yang lebih kecil.");
          return;
        }

        // Log the exact crop area being processed
        console.log("Crop area analysis:", {
          cropArea: cropWidth * cropHeight,
          imageArea: img.naturalWidth * img.naturalHeight,
          cropPercentage: ((cropWidth * cropHeight) / (img.naturalWidth * img.naturalHeight)) * 100,
          isReasonable: cropWidth <= img.naturalWidth && cropHeight <= img.naturalHeight
        });

        // Final validation: ensure crop coordinates are within image bounds
        const isCropValid = cropX >= 0 && cropY >= 0 && 
                           cropX + cropWidth <= img.naturalWidth && 
                           cropY + cropHeight <= img.naturalHeight;
        
        if (!isCropValid) {
          console.error("Invalid crop coordinates:", {
            cropX, cropY, cropWidth, cropHeight,
            imageWidth: img.naturalWidth, imageHeight: img.naturalHeight,
            isValid: isCropValid
          });
          
          // Try to adjust the crop area to fit within bounds
          const adjustedCropX = Math.max(0, Math.min(cropX, img.naturalWidth - cropWidth));
          const adjustedCropY = Math.max(0, Math.min(cropY, img.naturalHeight - cropHeight));
          const adjustedCropWidth = Math.min(cropWidth, img.naturalWidth - adjustedCropX);
          const adjustedCropHeight = Math.min(cropHeight, img.naturalHeight - adjustedCropY);
          
          console.log("Adjusted crop coordinates:", {
            original: { cropX, cropY, cropWidth, cropHeight },
            adjusted: { adjustedCropX, adjustedCropY, adjustedCropWidth, adjustedCropHeight }
          });
          
          // Use adjusted coordinates
          cropX = adjustedCropX;
          cropY = adjustedCropY;
          cropWidth = adjustedCropWidth;
          cropHeight = adjustedCropHeight;
        }

        console.log("Final crop coordinates:", {
          cropX, cropY, cropWidth, cropHeight,
          imageWidth: img.naturalWidth, imageHeight: img.naturalHeight,
          aspectRatio: cropWidth / cropHeight
        });

        // Add tolerance of 1 pixel for rounding errors
        const tolerance = 1;
        const maxAllowedX = img.naturalWidth + tolerance;
        const maxAllowedY = img.naturalHeight + tolerance;
        
        if (cropX + cropWidth > maxAllowedX || cropY + cropHeight > maxAllowedY) {
          console.error("Crop area exceeds image bounds (with tolerance):", {
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            imageWidth: img.naturalWidth,
            imageHeight: img.naturalHeight,
            maxAllowedX,
            maxAllowedY,
            exceedsX: cropX + cropWidth > maxAllowedX,
            exceedsY: cropY + cropHeight > maxAllowedY
          });
          
          // Instead of showing error, try to auto-adjust the crop area
          console.log("Attempting to auto-adjust crop area...");
          
          // If the excess is very small (within 5 pixels), auto-adjust
          const excessX = Math.max(0, cropX + cropWidth - img.naturalWidth);
          const excessY = Math.max(0, cropY + cropHeight - img.naturalHeight);
          
          if (excessX <= 5 && excessY <= 5) {
            console.log("Auto-adjusting crop area (excess within acceptable range)");
            // Continue with clamped values
          } else {
            toast.error("Area crop melebihi batas gambar. Silakan coba lagi.");
            return;
          }
        }

        // Clamp crop dimensions to image bounds to prevent any issues
        const clampedCropX = Math.min(cropX, img.naturalWidth - 1);
        const clampedCropY = Math.min(cropY, img.naturalHeight - 1);
        const clampedCropWidth = Math.min(cropWidth, img.naturalWidth - clampedCropX);
        const clampedCropHeight = Math.min(cropHeight, img.naturalHeight - clampedCropY);

        console.log("Clamped crop dimensions:", {
          clampedCropX,
          clampedCropY,
          clampedCropWidth,
          clampedCropHeight
        });

        // Handle case where crop is the full image (100% width and height or full pixel dimensions)
        // Make this detection more strict to avoid false positives
        const isFullImageCrop = (crop.unit === '%' && crop.width === 100 && crop.height === 100 && crop.x === 0 && crop.y === 0) ||
                               (crop.unit === 'px' && 
                                crop.width >= img.naturalWidth * 0.98 && 
                                crop.height >= img.naturalHeight * 0.98 && 
                                crop.x <= 2 && 
                                crop.y <= 2);
        
        if (isFullImageCrop) {
          console.log("Full image crop detected, using original image dimensions");
        } else {
          console.log("Specific crop area detected, using exact crop coordinates");
        }

        canvas.width = outputSize;
        canvas.height = outputSize;

        // Clear canvas first
        ctx.clearRect(0, 0, outputSize, outputSize);

        try {
          if (isFullImageCrop) {
            // For full image crop, use object-fit: cover approach
            const scale = Math.max(outputSize / img.naturalWidth, outputSize / img.naturalHeight);
            const scaledWidth = img.naturalWidth * scale;
            const scaledHeight = img.naturalHeight * scale;
            const offsetX = (outputSize - scaledWidth) / 2;
            const offsetY = (outputSize - scaledHeight) / 2;
            
            ctx.drawImage(
              img,
              offsetX,
              offsetY,
              scaledWidth,
              scaledHeight
            );
          } else {
            // Normal crop - use original crop coordinates, not clamped ones
            // Only clamp if absolutely necessary to prevent out-of-bounds
            const finalCropX = Math.max(0, Math.min(cropX, img.naturalWidth - cropWidth));
            const finalCropY = Math.max(0, Math.min(cropY, img.naturalHeight - cropHeight));
            const finalCropWidth = Math.min(cropWidth, img.naturalWidth - finalCropX);
            const finalCropHeight = Math.min(cropHeight, img.naturalHeight - finalCropY);
            
            console.log("Final crop coordinates for drawing:", {
              finalCropX,
              finalCropY,
              finalCropWidth,
              finalCropHeight,
              originalCropX: cropX,
              originalCropY: cropY,
              originalCropWidth: cropWidth,
              originalCropHeight: cropHeight,
              imageDimensions: { width: img.naturalWidth, height: img.naturalHeight }
            });
            
            // Validate that the final crop area is reasonable
            if (finalCropWidth < 10 || finalCropHeight < 10) {
              console.error("Final crop area is too small:", { finalCropWidth, finalCropHeight });
              toast.error("Area crop terlalu kecil. Silakan pilih area yang lebih besar.");
              return;
            }
            
            ctx.drawImage(
              img,
              finalCropX,
              finalCropY,
              finalCropWidth,
              finalCropHeight,
              0,
              0,
              outputSize,
              outputSize
            );
          }
          
          console.log("Image drawn to canvas successfully");
        } catch (drawError) {
          console.error("Error drawing image to canvas:", drawError);
          toast.error("Gagal memproses gambar: Error saat menggambar ke canvas");
          return;
        }

        // Convert canvas to blob with better error handling
        try {
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                console.error("Failed to create blob from canvas");
                toast.error("Gagal memproses gambar: Tidak dapat membuat file");
                return;
              }

              console.log("Blob created successfully, size:", blob.size);
              
              if (blob.size === 0) {
                console.error("Blob is empty");
                toast.error("Gagal memproses gambar: File hasil crop kosong");
                return;
              }

              const fileExt = tempImageFile.name
                .split(".")
                .pop()
                ?.toLowerCase() || "jpg";
              
              // Add timestamp to prevent cache issues
              const timestamp = Date.now();
              const filePath = `user-profiles/${user.id}-${timestamp}.${fileExt}`;

              console.log("Uploading to path:", filePath);

              const { error } = await supabase.storage
                .from("user-profiles")
                .upload(filePath, blob, { upsert: true });

              if (!error) {
                console.log("Upload successful");
                
                const { data: urlData } = supabase.storage
                  .from("user-profiles")
                  .getPublicUrl(filePath);
                
                // Add cache busting parameter
                const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`;
                setProfileImage(imageUrl);

                // Update profile_image in database
                const { error: updateError } = await supabase
                  .from("profiles")
                  .update({ profile_image: urlData.publicUrl })
                  .eq("user_id", user.id);

                if (updateError) {
                  console.error(
                    "Error updating profile image in database:",
                    updateError
                  );
                  toast.warning(
                    "Foto tersimpan di storage tapi gagal update database."
                  );
                }

                // Clean up old profile images (optional - to save storage)
                try {
                  const { data: oldFiles } = await supabase.storage
                    .from("user-profiles")
                    .list("", {
                      search: `${user.id}-`,
                      limit: 10,
                    });

                  if (oldFiles && oldFiles.length > 1) {
                    // Keep only the latest 2 files, delete the rest
                    const filesToDelete = oldFiles
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )
                      .slice(2)
                      .map((file) => `${user.id}-${file.name.split("-")[1]}`);

                    if (filesToDelete.length > 0) {
                      await supabase.storage
                        .from("user-profiles")
                        .remove(filesToDelete);
                    }
                  }
                } catch (cleanupError) {
                  console.log("Cleanup error (non-critical):", cleanupError);
                }

                toast.success("Foto profil berhasil diperbarui!");
                
                // Reset state after successful upload
                setShowCropModal(false);
                setCropImage("");
                setTempImageFile(null);
                setCrop({
                  unit: "%",
                  width: 100,
                  height: 100,
                  x: 0,
                  y: 0,
                });
              } else {
                console.error("Upload error:", error);
                toast.error(`Gagal menyimpan foto: ${error.message}`);
                
                // Reset state on upload error
                setShowCropModal(false);
                setCropImage("");
                setTempImageFile(null);
                setCrop({
                  unit: "%",
                  width: 100,
                  height: 100,
                  x: 0,
                  y: 0,
                });
              }
            },
            "image/jpeg",
            0.9
          );
        } catch (blobError) {
          console.error("Error creating blob:", blobError);
          toast.error("Gagal memproses gambar: Error saat membuat file");
          
          // Reset state on blob error
          setShowCropModal(false);
          setCropImage("");
          setTempImageFile(null);
          setCrop({
            unit: "%",
            width: 100,
            height: 100,
            x: 0,
            y: 0,
          });
        }
      };

      // Set up error handling for image loading
      img.onerror = () => {
        console.error("Failed to load image");
        toast.error("Gagal memuat gambar. Silakan coba lagi.");
        setShowCropModal(false);
        setCropImage("");
        setTempImageFile(null);
        setCrop({
          unit: "%",
          width: 100,
          height: 100,
          x: 0,
          y: 0,
        });
      };

      // Set image source AFTER setting up event handlers
      img.src = cropImage;
      
      // Don't reset state here, wait for the process to complete
      // setShowCropModal(false);
      // setCropImage("");
      // setTempImageFile(null);
    } catch (error) {
      console.error("Crop process error:", error);
      toast.error("Gagal memproses gambar.");
      // Reset state on error
      setShowCropModal(false);
      setCropImage("");
      setTempImageFile(null);
      setCrop({
        unit: "%",
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      });
    }
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setCropImage("");
    setTempImageFile(null);
    setCrop({
      unit: "%",
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      toast.error(`Validasi gagal: ${Object.values(errors).join(" ")}`);
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      const safeSkills = Array.isArray(skills)
        ? skills
        : skills
        ? [skills]
        : [];
      // Determine final location value
      let finalLocation = "";
      if (provinsi && kota) {
        finalLocation = `${provinsi}, ${kota}`;
      } else if (provinsi) {
        finalLocation = provinsi;
      } else if (form.location) {
        finalLocation = form.location;
      }
      
      // Log location data for debugging
      console.log("Location data:", {
        provinsi,
        kota,
        formLocation: form.location,
        finalLocation: finalLocation
      });
      const updateData: Record<string, any> = {
        name: form.name,
        bio: form.bio || null,
        about_markdown: form.about_markdown || null,
        website: form.website || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        github: form.github || null,
        experience_level: form.experience_level || null,
        availability: form.availability || null,
        location: finalLocation,
        skills: safeSkills,
        profile_image: profileImage || null,
        instagram: form.instagram || null,
        threads: form.threads || null,
        discord: form.discord || null,
        youtube: form.youtube || null,
        Whatsapp: form.whatsapp ? formatWhatsAppNumber(form.whatsapp) : null,
      };
      
      // Log the complete update data
      console.log("Complete update data:", updateData);
      // Check if profile exists first, then update
      console.log("Checking if profile exists for user:", user.id);
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking profile:", checkError);
        toast.error(`Error checking profile: ${checkError.message}`);
        setSubmitting(false);
        return;
      }
      
      let result;
      
      if (existingProfile) {
        // Profile exists, update it
        console.log("Profile exists, updating with ID:", existingProfile.id);
        result = await supabase
          .from("profiles")
          .update(updateData)
          .eq("user_id", user.id)
          .select();
      } else {
        // Profile doesn't exist, create new one
        console.log("Profile doesn't exist, creating new one");
        result = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            ...updateData
          })
          .select();
      }
      
      if (result.error) {
        console.error("Database error:", result.error);
        
        // Handle specific errors
        if (result.error.code === '42501') {
          toast.error("Akses ditolak. Pastikan Anda login dan memiliki izin untuk mengupdate profil.");
        } else if (result.error.code === '23505') {
          toast.error("Data duplikat. Silakan coba lagi.");
        } else if (result.error.code === '23503') {
          toast.error("Referensi tidak valid. Silakan coba lagi.");
        } else {
          toast.error(`Gagal menyimpan perubahan: ${result.error.message}`);
        }
        
        setSubmitting(false);
        return;
      }
      
      // Verify the data was saved successfully
      if (result.data && result.data.length > 0) {
        const savedProfile = result.data[0];
        console.log("Saved profile data:", savedProfile);
        console.log("Saved location:", savedProfile.location);
        console.log("Expected location:", finalLocation);
        
        if (savedProfile.location === finalLocation) {
          toast.success("Profil berhasil disimpan!");
        } else {
          console.warn("Location mismatch:", {
            expected: finalLocation,
            saved: savedProfile.location
          });
          toast.success("Profil berhasil disimpan!");
        }
      } else {
        console.warn("No data returned from operation");
        toast.success("Profil berhasil disimpan!");
      }
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/dashboard-profile");
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Gagal menyimpan perubahan.");
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk mengedit profil Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            {/* Avatar dan link sosial di sini */}
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                <div className="relative flex flex-col items-center">
                  <img
                    src={
                      profileImage
                        ? `${profileImage}?t=${Date.now()}`
                        : "/placeholder-user.jpg"
                    }
                    alt="Avatar"
                    className="h-32 w-32 rounded-full object-cover border mx-auto mb-2"
                  />
                  <button
                    type="button"
                    className="absolute bottom-4 right-1/2 translate-x-1/2 bg-white rounded-full p-1 border shadow hover:bg-gray-100"
                    onClick={handleAvatarClick}
                    title="Ubah Foto Profil"
                  >
                    <Pencil className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {/* Media sosial: ikon + input */}
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-700" />
                    <Input
                      name="website"
                      value={form.website || ""}
                      onChange={handleChange}
                      placeholder="Website"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  {formError.website && (
                    <p className="text-sm text-red-600 mt-1">
                      {formError.website}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-gray-700" />
                    <Input
                      name="linkedin"
                      value={form.linkedin || ""}
                      onChange={handleChange}
                      placeholder="LinkedIn"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-gray-700" />
                    <Input
                      name="twitter"
                      value={form.twitter || ""}
                      onChange={handleChange}
                      placeholder="Twitter"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-gray-700" />
                    <Input
                      name="github"
                      value={form.github || ""}
                      onChange={handleChange}
                      placeholder="GitHub"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-gray-700" />
                    <Input
                      name="instagram"
                      value={form.instagram || ""}
                      onChange={handleChange}
                      placeholder="Instagram"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Threads pakai SVG manual */}
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18.5A8.5 8.5 0 1 1 12 3.5a8.5 8.5 0 0 1 0 17Zm.25-13.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm-2.5 2.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm5 0a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm-2.5 8.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                    <Input
                      name="threads"
                      value={form.threads || ""}
                      onChange={handleChange}
                      placeholder="Threads"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDiscord className="h-5 w-5 text-gray-700" />
                    <Input
                      name="discord"
                      value={form.discord || ""}
                      onChange={handleChange}
                      placeholder="Discord"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="h-5 w-5 text-gray-700" />
                    <Input
                      name="whatsapp"
                      value={form.whatsapp || ""}
                      onChange={handleChange}
                      placeholder="Whatsapp"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                  {formError.whatsapp && (
                    <p className="text-sm text-red-600 mt-1">
                      {formError.whatsapp}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-gray-700" />
                    <Input
                      name="youtube"
                      value={form.youtube || ""}
                      onChange={handleChange}
                      placeholder="YouTube"
                      className="flex-1"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Nama
                  </label>
                  <Input
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {formError.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {formError.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Bio
                  </label>
                  <Textarea
                    name="bio"
                    value={form.bio || ""}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Bio singkat untuk ditampilkan di profil"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Tentang Creator (Markdown)
                  </label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={form.about_markdown || ""}
                      onChange={(value) =>
                        setForm({ ...form, about_markdown: value || "" })
                      }
                      preview="edit"
                      height={300}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Gunakan Markdown untuk memformat teks. Contoh: **tebal**,
                    *miring*, [link](url), dll.
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Lokasi
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="provinsi"
                      className="w-1/2 border rounded px-2 py-2 text-sm"
                      value={provinsi}
                      onChange={(e) => {
                        const selectedProvinsi = e.target.value;
                        setProvinsi(selectedProvinsi);
                        setKota("");
                        // Update form location when provinsi changes
                        const newLocation = selectedProvinsi ? selectedProvinsi : "";
                        setForm(prev => ({ ...prev, location: newLocation }));
                      }}
                      disabled={submitting}
                    >
                      <option value="">Pilih Provinsi</option>
                      {PROVINCES.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="kota"
                      className="w-1/2 border rounded px-2 py-2 text-sm"
                      value={kota}
                      onChange={(e) => {
                        const selectedKota = e.target.value;
                        setKota(selectedKota);
                        // Update form location when kota changes
                        const newLocation = provinsi && selectedKota ? `${provinsi}, ${selectedKota}` : provinsi || "";
                        setForm(prev => ({ ...prev, location: newLocation }));
                      }}
                      disabled={!provinsi || submitting}
                    >
                      <option value="">Pilih Kota/Kabupaten</option>
                      {PROVINCES.find((p) => p.name === provinsi)?.cities.map(
                        (k, idx) => (
                          <option key={`${provinsi}-${k}-${idx}`} value={k}>
                            {k}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>
                {/*
                <div>
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Skills
                  </label>
                  <TagInput
                    value={skills}
                    onChange={setSkills}
                    placeholder="Tambah skill..."
                  />
                </div>
                */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-semibold text-gray-900 mb-1 block">
                      Level Pengalaman
                    </label>
                    <select
                      name="experience_level"
                      className="w-full border rounded px-2 py-2 text-sm"
                      value={form.experience_level || ""}
                      onChange={handleSelect}
                      disabled={submitting}
                    >
                      <option value="">Pilih</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-gray-900 mb-1 block">
                      Status (Availability)
                    </label>
                    <select
                      name="availability"
                      className="w-full border rounded px-2 py-2 text-sm"
                      value={form.availability || ""}
                      onChange={handleSelect}
                      disabled={submitting}
                    >
                      <option value="">Pilih</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="submit"
                    className="bg-purple-900 hover:bg-purple-800 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => router.push("/dashboard-profile")}
                    disabled={submitting}
                  >
                    Batalkan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Atur Foto Profil</h3>
            <p className="text-sm text-gray-600 mb-4">
              Foto akan disimpan dengan ukuran 400x400 pixel
            </p>
            <div className="mb-4 flex justify-center">
              <div className="w-96 h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => {
                    console.log("Crop changed:", c);
                    setCrop(c);
                  }}
                  aspect={1}
                  circularCrop
                  minWidth={50}
                  minHeight={50}
                  keepSelection
                  ruleOfThirds
                >
                  <img
                    src={cropImage}
                    alt="Crop preview"
                    className="w-full h-full object-contain"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      console.log("Crop preview image loaded:", {
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight,
                        displayWidth: img.width,
                        displayHeight: img.height
                      });
                    }}
                  />
                </ReactCrop>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancelCrop}>
                Batal
              </Button>
              <Button
                onClick={handleCropComplete}
                className="bg-purple-900 hover:bg-purple-800 text-white"
              >
                Simpan Foto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
