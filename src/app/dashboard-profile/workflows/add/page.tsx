"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Workflow } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { workflowCategories } from "@/data/category-workflows";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/hooks/use-toast";

export default function AddWorkflowPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [workflowForm, setWorkflowForm] = useState<{
    title: string;
    description: string;
    tags: string[];
    category: string;
    screenshot_url: string;
    video_url: string;
    complexity: string;
    json_n8n: string;
  }>({
    title: "",
    description: "",
    tags: [],
    category: "",
    screenshot_url: "",
    video_url: "",
    complexity: "",
    json_n8n: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!workflowForm.title.trim()) errors.title = "Judul wajib diisi.";
    if (!workflowForm.description.trim())
      errors.description = "Deskripsi wajib diisi.";
    if (!workflowForm.category) errors.category = "Kategori wajib dipilih.";
    if (
      workflowForm.screenshot_url &&
      !/^https?:\/\//.test(workflowForm.screenshot_url)
    ) {
      errors.screenshot_url = "Screenshot URL harus diawali http(s)://";
    }
    if (
      workflowForm.video_url &&
      !/^https?:\/\//.test(workflowForm.video_url)
    ) {
      errors.video_url = "Video URL harus diawali http(s)://";
    }
    return errors;
  };

  const handleWorkflowInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setWorkflowForm({ ...workflowForm, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formError[e.target.name]) {
      setFormError({ ...formError, [e.target.name]: "" });
    }
  };

  const handleAddWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      toast({
        title: "Validasi gagal",
        description: Object.values(errors).join(" "),
        variant: "destructive",
      });
      return;
    }
    if (!profile?.id) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("workflows").insert({
        profile_id: profile.id,
        title: workflowForm.title,
        description: workflowForm.description,
        tags: workflowForm.tags,
        category: workflowForm.category,
        screenshot_url: workflowForm.screenshot_url,
        video_url: workflowForm.video_url,
        complexity: workflowForm.complexity,
        json_n8n: workflowForm.json_n8n,
        status: "pending",
      });
      if (error) {
        toast({
          title: "Gagal menambah workflow",
          description: error.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      toast({
        title: "Workflow berhasil ditambahkan",
        description: "Workflow baru telah ditambahkan dan menunggu approval.",
        variant: "default",
      });
      router.push("/dashboard-profile/workflows");
    } catch (err: any) {
      toast({
        title: "Terjadi error",
        description: err?.message || "Gagal menambah workflow.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk menambah workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Workflow Baru
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard-profile/workflows")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Workflow Saya
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Form Tambah Workflow
              </h2>
              <p className="text-sm text-gray-600">
                Isi detail workflow Anda di bawah ini
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddWorkflow} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-900">
                  Judul Workflow
                </label>
                <Input
                  name="title"
                  value={workflowForm.title}
                  onChange={handleWorkflowInput}
                  placeholder="Masukkan judul workflow..."
                  required
                  disabled={submitting}
                />
                {formError.title && (
                  <p className="text-sm text-red-600 mt-1">{formError.title}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-900">
                  Kategori
                </label>
                <Select
                  value={workflowForm.category}
                  onValueChange={(val) =>
                    setWorkflowForm((f) => ({ ...f, category: val }))
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formError.category && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.category}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-900">
                Deskripsi
              </label>
              <Textarea
                name="description"
                value={workflowForm.description}
                onChange={handleWorkflowInput}
                placeholder="Jelaskan workflow Anda secara detail..."
                rows={4}
                required
                disabled={submitting}
              />
              {formError.description && (
                <p className="text-sm text-red-600 mt-1">
                  {formError.description}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-900">
                Tags
              </label>
              <TagInput
                value={workflowForm.tags}
                onChange={(tags) => setWorkflowForm((f) => ({ ...f, tags }))}
                placeholder="Tambah tag untuk workflow..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Tekan Enter untuk menambah tag, klik X untuk menghapus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-900">
                  Screenshot URL
                </label>
                <Input
                  name="screenshot_url"
                  value={workflowForm.screenshot_url}
                  onChange={handleWorkflowInput}
                  placeholder="https://example.com/screenshot.jpg"
                  disabled={submitting}
                />
                {formError.screenshot_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.screenshot_url}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  URL gambar screenshot workflow (opsional)
                </p>
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-900">
                  Video URL
                </label>
                <Input
                  name="video_url"
                  value={workflowForm.video_url}
                  onChange={handleWorkflowInput}
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={submitting}
                />
                {formError.video_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.video_url}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  URL video demo workflow (opsional)
                </p>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-900">
                Complexity Level
              </label>
              <Select
                value={workflowForm.complexity}
                onValueChange={(val) =>
                  setWorkflowForm((f) => ({ ...f, complexity: val }))
                }
                disabled={submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level kompleksitas..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Pilih tingkat kompleksitas workflow
              </p>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-900">
                JSON n8n Workflow
              </label>
              <Textarea
                name="json_n8n"
                value={workflowForm.json_n8n}
                onChange={handleWorkflowInput}
                placeholder="Paste JSON workflow dari n8n di sini..."
                rows={8}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste JSON workflow dari n8n untuk preview otomatis
              </p>
            </div>

            {/* Live preview n8n demo */}
            {workflowForm.json_n8n && (
              <div className="border rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium mb-2 text-gray-900">
                  Preview Workflow
                </h3>
                <div className="overflow-x-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<n8n-demo workflow='${workflowForm.json_n8n.replace(
                        /'/g,
                        "&#39;"
                      )}' frame="true"></n8n-demo>`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
                    Menyimpan Workflow...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Workflow
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard-profile/workflows")}
                disabled={submitting}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
