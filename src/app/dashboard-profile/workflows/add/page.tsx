"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";

export default function AddWorkflowPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [workflowForm, setWorkflowForm] = useState<{
    title: string;
    description: string;
    tags: string[];
    category: string;
    complexity: string;
    json_n8n: string;
    screenshot_url: string;
  }>({
    title: "",
    description: "",
    tags: [],
    category: "",
    complexity: "",
    json_n8n: "",
    screenshot_url: "",
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
      toast.error(`Validasi gagal: ${Object.values(errors).join(" ")}`);
      return;
    }
    if (!profile?.id) return;
    setSubmitting(true);
    try {
      const { data: newWorkflow, error } = await supabase
        .from("workflows")
        .insert({
          profile_id: profile.id,
          title: workflowForm.title,
          description: workflowForm.description,
          tags: workflowForm.tags,
          category: workflowForm.category,
          complexity: workflowForm.complexity,
          json_n8n: workflowForm.json_n8n,
          screenshot_url: workflowForm.screenshot_url,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        toast.error(`Gagal menambah workflow: ${error.message}`);
        setSubmitting(false);
        return;
      }

      toast.success("Workflow berhasil ditambahkan dan menunggu approval!");
      router.push("/dashboard-profile/workflows");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambah workflow.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Not Logged In
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login untuk menambah workflow.
          </p>
          <Button
            onClick={() => router.push("/auth")}
            className="bg-purple-900 hover:bg-purple-800"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard-profile/workflows")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="workflow-page-title">
            <div className="workflow-page-title-line-1">Buat dan Kirim</div>
            <div className="workflow-page-title-line-2">Workflow Anda</div>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Buat workflow baru dan kirim untuk review
          </p>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">
            Sebelum mengirim, pastikan mengikuti panduan berikut:
          </h2>
          <div className="space-y-2 sm:space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-700 text-xs font-bold">1</span>
              </div>
              <p className="text-sm">
                <strong>Workflow harus berfungsi dengan baik</strong> - Pastikan
                workflow Anda sudah diuji dan berjalan dengan sempurna
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-700 text-xs font-bold">2</span>
              </div>
              <p className="text-sm">
                <strong>Gunakan Markdown untuk deskripsi</strong> - Format teks
                dengan **tebal**, *miring*, [link](url), dan ## heading untuk
                struktur yang baik
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-700 text-xs font-bold">3</span>
              </div>
              <p className="text-sm">
                <strong>Jangan gunakan API key hardcoded</strong> - Gunakan
                environment variables atau parameter yang aman
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-700 text-xs font-bold">4</span>
              </div>
              <p className="text-sm">
                <strong>Pilih kategori dan tags yang tepat</strong> - Ini akan
                membantu workflow Anda ditemukan oleh pengguna lain
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-700 text-xs font-bold">5</span>
              </div>
              <p className="text-sm">
                <strong>Jangan menyalin workflow orang lain</strong> - Buat
                workflow original atau berikan kredit yang tepat
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddWorkflow} className="space-y-6 sm:space-y-8">
        {/* Judul dan Kategori - Side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Judul Workflow
            </label>
            <Input
              name="title"
              value={workflowForm.title || ""}
              onChange={handleWorkflowInput}
              placeholder="Masukkan judul workflow..."
              required
              disabled={submitting}
              className="text-base sm:text-lg"
            />
            {formError.title && (
              <p className="text-sm text-red-600 mt-1">{formError.title}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Kategori
            </label>
            <Select
              value={workflowForm.category || ""}
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
              <p className="text-sm text-red-600 mt-1">{formError.category}</p>
            )}
          </div>
        </div>

        {/* Complexity */}
        <div>
          <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
            Complexity
          </label>
          <Select
            value={workflowForm.complexity || ""}
            onValueChange={(val) =>
              setWorkflowForm((f) => ({ ...f, complexity: val }))
            }
            disabled={submitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih complexity..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deskripsi dengan Markdown */}
        <div>
          <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
            Deskripsi
          </label>
          <div data-color-mode="light">
            <MDEditor
              value={workflowForm.description || ""}
              onChange={(value) =>
                setWorkflowForm({ ...workflowForm, description: value || "" })
              }
              preview="edit"
              height={300}
            />
          </div>
          {formError.description && (
            <p className="text-sm text-red-600 mt-1">{formError.description}</p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Gunakan Markdown untuk memformat teks. Contoh: **tebal**, *miring*,
            [link](url), ## heading, dll.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
            Tags
          </label>
          <TagInput
            value={workflowForm.tags || []}
            onChange={(tags) => setWorkflowForm((f) => ({ ...f, tags }))}
            placeholder="Tambah tag untuk workflow..."
          />
          <p className="text-sm text-gray-600 mt-2">
            Input bebas, tekan enter untuk menambah tag
          </p>
        </div>

        {/* JSON n8n Workflow */}
        <div>
          <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
            JSON n8n Workflow
          </label>
          <Textarea
            name="json_n8n"
            value={workflowForm.json_n8n || ""}
            onChange={handleWorkflowInput}
            placeholder="Paste JSON workflow dari n8n di sini"
            rows={8}
            disabled={submitting}
            className="font-mono text-sm"
          />
        </div>

        {/* Upload Gambar Workflow */}
        <div>
          <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
            Gambar Workflow
          </label>
          <ImageUpload
            bucket="workflow"
            currentImage={workflowForm.screenshot_url}
            onUploadComplete={(url: string, path: string) => {
              setWorkflowForm({ ...workflowForm, screenshot_url: url });
            }}
            onUploadError={(error: string) => {
              toast.error(`Gagal mengupload gambar: ${error}`);
            }}
            onRemove={() => {
              setWorkflowForm({ ...workflowForm, screenshot_url: "" });
            }}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">
            Upload screenshot atau gambar workflow untuk preview di card
            workflow
          </p>
        </div>

        {/* Preview Workflow */}
        {workflowForm.json_n8n && (
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Preview Workflow
            </label>
            <div className="border rounded-lg bg-gray-50 p-4 overflow-x-auto">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-purple-800 hover:bg-purple-900 flex-1 sm:flex-none"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
                <span className="hidden sm:inline">Mengirim Workflow...</span>
                <span className="sm:hidden">Mengirim...</span>
              </span>
            ) : (
              "Kirim Workflow"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard-profile/workflows")}
            disabled={submitting}
            className="flex-1 sm:flex-none"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
