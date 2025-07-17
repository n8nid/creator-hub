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
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
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
        });
        setSkills(data.skills || []);
        // Set profile image without cache busting for database-stored URL
        setProfileImage(data.profile_image || "");
        if (data.location) {
          const [prov, city] = data.location.split(", ");
          setProvinsi(prov || "");
          setKota(city || "");
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = "Nama wajib diisi.";
    if (form.website && !/^https?:\/\//.test(form.website))
      errors.website = "Website harus diawali http(s)://";
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
      // Create canvas for cropping
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set fixed output size for consistency (400x400 pixels)
        const outputSize = 400;

        // Calculate crop dimensions based on percentage
        const cropWidth = (crop.width / 100) * img.naturalWidth;
        const cropHeight = (crop.height / 100) * img.naturalHeight;
        const cropX = (crop.x / 100) * img.naturalWidth;
        const cropY = (crop.y / 100) * img.naturalHeight;

        canvas.width = outputSize;
        canvas.height = outputSize;

        if (ctx) {
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            outputSize,
            outputSize
          );
        }

        // Convert canvas to blob
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const fileExt = tempImageFile.name
                .split(".")
                .pop()
                ?.toLowerCase();
              // Add timestamp to prevent cache issues
              const timestamp = Date.now();
              const filePath = `user-profiles/${user.id}-${timestamp}.${fileExt}`;

              const { error } = await supabase.storage
                .from("user-profiles")
                .upload(filePath, blob, { upsert: true });

              if (!error) {
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
              } else {
                toast.error(`Gagal menyimpan foto: ${error.message}`);
              }
            }
          },
          "image/jpeg",
          0.9
        );
      };

      img.src = cropImage;
      setShowCropModal(false);
      setCropImage("");
      setTempImageFile(null);
    } catch (error) {
      toast.error("Gagal memproses gambar.");
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
      const location =
        provinsi && kota ? `${provinsi}, ${kota}` : form.location;
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
        location,
        skills: safeSkills,
        profile_image: profileImage || null,
        instagram: form.instagram || null,
        threads: form.threads || null,
        discord: form.discord || null,
        youtube: form.youtube || null,
      };
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", user.id);
      if (error) {
        toast.error(`Gagal menyimpan perubahan: ${error.message}`);
        setSubmitting(false);
        return;
      }
      toast.success("Profil berhasil disimpan!");
      router.push("/dashboard-profile");
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
                        setProvinsi(e.target.value);
                        setKota("");
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
                      onChange={(e) => setKota(e.target.value)}
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
                  onChange={(c) => setCrop(c)}
                  aspect={1}
                  circularCrop
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    src={cropImage}
                    alt="Crop preview"
                    className="w-full h-full object-contain"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
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
