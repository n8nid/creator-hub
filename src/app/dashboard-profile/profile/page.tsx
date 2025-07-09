"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Globe, Linkedin, Twitter, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { PROVINCES } from "@/data/indonesia-regions";

const defaultProfileForm = {
  name: "",
  bio: "",
  website: "",
  linkedin: "",
  twitter: "",
  github: "",
  experience_level: "",
  availability: "",
  location: "",
};

export default function ProfileSubPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(defaultProfileForm);
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");

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
          website: data.website || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          github: data.github || "",
          experience_level: data.experience_level || "",
          availability: data.availability || "",
          location: data.location || "",
        });
        setSkills(data.skills || []);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      setProfileImage(urlData.publicUrl);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const safeSkills = Array.isArray(skills) ? skills : skills ? [skills] : [];
    const location = provinsi && kota ? `${provinsi}, ${kota}` : form.location;
    const updateData: Record<string, any> = {
      name: form.name,
      bio: form.bio || null,
      website: form.website || null,
      linkedin: form.linkedin || null,
      twitter: form.twitter || null,
      github: form.github || null,
      experience_level: form.experience_level || null,
      availability: form.availability || null,
      location,
      skills: safeSkills,
      profile_image: profileImage || null,
      status: "approved",
    };
    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", user.id);
    if (error) {
      alert("Gagal menyimpan perubahan: " + error.message);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    setProfile(data);
    alert("Perubahan profil berhasil disimpan!");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat profil Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Profil</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar dan link sosial di sini */}
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
              <div className="relative flex flex-col items-center">
                <img
                  src={profileImage || "/placeholder-user.jpg"}
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
                  <Globe className="h-5 w-5 text-blue-600" />
                  <Input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="Website"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <Input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-600" />
                  <Input
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                    placeholder="Twitter"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-blue-600" />
                  <Input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="GitHub"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="font-semibold text-gray-900 mb-1 block">
                  Nama
                </label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="font-semibold text-gray-900 mb-1 block">
                  Bio
                </label>
                <Textarea name="bio" value={form.bio} onChange={handleChange} />
              </div>
              <div>
                <label className="font-semibold text-gray-900 mb-1 block">
                  Lokasi
                </label>
                <div className="flex gap-2">
                  <select
                    name="provinsi"
                    className="w-1/2 border rounded px-2 py-2"
                    value={provinsi}
                    onChange={(e) => {
                      setProvinsi(e.target.value);
                      setKota("");
                    }}
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
                    className="w-1/2 border rounded px-2 py-2"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    disabled={!provinsi}
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
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-semibold text-gray-900 mb-1 block">
                    Level Pengalaman
                  </label>
                  <select
                    name="experience_level"
                    className="w-full border rounded px-2 py-2"
                    value={form.experience_level}
                    onChange={handleSelect}
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
                    className="w-full border rounded px-2 py-2"
                    value={form.availability}
                    onChange={handleSelect}
                  >
                    <option value="">Pilih</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
