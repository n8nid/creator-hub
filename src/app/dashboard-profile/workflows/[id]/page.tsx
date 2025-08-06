"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Trash, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
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

export default function WorkflowDetailUserPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const workflowId = params?.id as string;
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [editForm, setEditForm] = useState<any>({
    title: "",
    description: "",
    tags: [],
    category: "",
    complexity: "",
    json_n8n: "",
    screenshot_url: "",
  });

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) return;
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();
      setWorkflow(data);
      setLoading(false);
      if (data && user) {
        // Cek apakah user adalah owner
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
        setIsOwner(profile?.id === data.profile_id);
        setEditForm({
          title: data.title || "",
          description: data.description || "",
          tags: data.tags || [],
          category: data.category || "",
          complexity: data.complexity || "",
          json_n8n: data.json_n8n || "",
          screenshot_url: data.screenshot_url || "",
        });
      }
    };
    fetchWorkflow();
  }, [workflowId, user]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!editForm.title.trim()) errors.title = "Judul wajib diisi.";
    if (!editForm.description.trim())
      errors.description = "Deskripsi wajib diisi.";
    if (!editForm.category) errors.category = "Kategori wajib dipilih.";
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formError[e.target.name]) {
      setFormError({ ...formError, [e.target.name]: "" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      toast.error(`Validasi gagal: ${Object.values(errors).join(" ")}`);
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("workflows")
        .update({
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
          category: editForm.category,
          complexity: editForm.complexity,
          json_n8n: editForm.json_n8n,
          screenshot_url: editForm.screenshot_url,
        })
        .eq("id", workflowId);
      if (error) {
        toast.error(`Gagal menyimpan perubahan: ${error.message}`);
        setSaving(false);
        return;
      }
      toast.success("Perubahan berhasil disimpan!");
      // Redirect ke halaman workflow saya
      router.push("/dashboard-profile/workflows");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!workflowId) return;
    if (!confirm("Yakin ingin menghapus workflow ini?")) return;
    try {
      const { error } = await supabase
        .from("workflows")
        .delete()
        .eq("id", workflowId);
      if (error) {
        toast.error(`Gagal menghapus workflow: ${error.message}`);
        return;
      }
      toast.success("Workflow berhasil dihapus!");
      router.push("/dashboard-profile/workflows");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus workflow.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin border-4 border-purple-200 border-t-purple-900 rounded-full w-8 h-8"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Workflow Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Workflow yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button
            onClick={() => router.push("/dashboard-profile/workflows")}
            className="bg-purple-900 hover:bg-purple-800"
          >
            Kembali ke Workflow Saya
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
            <div className="workflow-page-title-line-1">Ubah dan Simpan</div>
            <div className="workflow-page-title-line-2">
              Workflow Terbaru Anda
            </div>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {isOwner ? "Edit dan kelola workflow Anda" : "Detail workflow"}
          </p>
        </div>
      </div>

      {/* Guidelines Section - Only show for owners */}
      {isOwner && (
        <div className="mb-6 sm:mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-amber-900 mb-3">
              Tips untuk mengedit workflow:
            </h2>
            <div className="space-y-2 sm:space-y-3 text-sm text-amber-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">1</span>
                </div>
                <p className="text-sm">
                  <strong>Periksa perubahan sebelum simpan</strong> - Pastikan
                  semua field sudah benar dan workflow masih berfungsi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">2</span>
                </div>
                <p className="text-sm">
                  <strong>Update deskripsi jika diperlukan</strong> - Gunakan
                  Markdown untuk menjelaskan perubahan yang dibuat
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">3</span>
                </div>
                <p className="text-sm">
                  <strong>Periksa JSON workflow</strong> - Pastikan JSON masih
                  valid dan tidak ada error syntax
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">4</span>
                </div>
                <p className="text-sm">
                  <strong>Update tags dan kategori</strong> - Sesuaikan jika ada
                  perubahan pada fungsi workflow
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">5</span>
                </div>
                <p className="text-sm">
                  <strong>Test preview workflow</strong> - Gunakan preview untuk
                  memastikan workflow masih berjalan dengan baik
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOwner ? (
        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {/* Judul */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Judul Workflow
            </label>
            <Input
              name="title"
              value={editForm.title || ""}
              onChange={handleChange}
              required
              disabled={saving}
              className="text-base sm:text-lg"
              placeholder="Masukkan judul workflow..."
            />
            {formError.title && (
              <p className="text-sm text-red-600 mt-1">{formError.title}</p>
            )}
          </div>

          {/* Deskripsi dengan Markdown */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Deskripsi
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={editForm.description || ""}
                onChange={(value) =>
                  setEditForm({ ...editForm, description: value || "" })
                }
                preview="edit"
                height={300}
              />
            </div>
            {formError.description && (
              <p className="text-sm text-red-600 mt-1">
                {formError.description}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Gunakan Markdown untuk memformat teks. Contoh: **tebal**,
              *miring*, [link](url), ## heading, dll.
            </p>
          </div>

          {/* Kategori dan Complexity - Side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
                Kategori
              </label>
              <Select
                value={editForm.category || ""}
                onValueChange={(val) =>
                  setEditForm((f: typeof editForm) => ({
                    ...f,
                    category: val,
                  }))
                }
                disabled={saving}
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

            <div>
              <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
                Complexity
              </label>
              <Select
                value={editForm.complexity || ""}
                onValueChange={(val) =>
                  setEditForm((f: typeof editForm) => ({
                    ...f,
                    complexity: val,
                  }))
                }
                disabled={saving}
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
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
              Tags
            </label>
            <TagInput
              value={editForm.tags || []}
              onChange={(tags) =>
                setEditForm((f: typeof editForm) => ({ ...f, tags }))
              }
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
              value={editForm.json_n8n || ""}
              onChange={handleChange}
              placeholder="Paste JSON workflow dari n8n di sini"
              rows={8}
              disabled={saving}
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
              currentImage={editForm.screenshot_url}
              onUploadComplete={(url: string, path: string) => {
                setEditForm({ ...editForm, screenshot_url: url });
              }}
              onUploadError={(error: string) => {
                toast.error(`Gagal mengupload gambar: ${error}`);
              }}
              onRemove={() => {
                setEditForm({ ...editForm, screenshot_url: "" });
              }}
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload screenshot atau gambar workflow untuk preview di card
              workflow
            </p>
          </div>

          {/* Preview JSON */}
          {editForm.json_n8n && (
            <div>
              <label className="block font-medium mb-2 text-gray-900 text-sm sm:text-base">
                Preview Workflow
              </label>
              <div className="border rounded-lg bg-gray-50 p-4 overflow-x-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<n8n-demo workflow='${editForm.json_n8n.replace(
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
              disabled={saving}
              className="bg-purple-900 hover:bg-purple-800 flex-1 sm:flex-none"
            >
              {saving ? (
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
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 sm:flex-none"
            >
              <Trash className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Hapus Workflow</span>
              <span className="sm:hidden">Hapus</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full">
              {workflow.complexity || "-"}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                workflow.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : workflow.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : workflow.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {workflow.status}
            </span>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: workflow.description }} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(workflow.tags || []).map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Created Date */}
          <div className="text-sm text-gray-500">
            Created: {workflow.created_at?.slice(0, 10)}
          </div>

          {/* Preview n8n workflow jika ada json_n8n */}
          {workflow.json_n8n && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Preview Workflow</h3>
              <div className="border rounded-lg bg-gray-50 p-4 overflow-x-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                      /'/g,
                      "&#39;"
                    )}' frame="true"></n8n-demo>`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
