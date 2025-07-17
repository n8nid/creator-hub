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
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  if (!workflow) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        Workflow tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard-profile/workflows")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {workflow.title}
        </h1>
        <p className="text-gray-600">Edit workflow template Anda</p>
      </div>

      {isOwner ? (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Judul */}
          <div>
            <label className="block font-medium mb-2">Judul</label>
            <Input
              name="title"
              value={editForm.title || ""}
              onChange={handleChange}
              required
              disabled={saving}
              className="text-lg"
            />
            {formError.title && (
              <p className="text-sm text-red-600 mt-1">{formError.title}</p>
            )}
          </div>

          {/* Deskripsi dengan Markdown */}
          <div>
            <label className="block font-medium mb-2">Deskripsi</label>
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
              *miring*, [link](url), dll.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <label className="block font-medium mb-2">Kategori</label>
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
              <p className="text-sm text-red-600 mt-1">{formError.category}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium mb-2">Tags</label>
            <TagInput
              value={editForm.tags || []}
              onChange={(tags) =>
                setEditForm((f: typeof editForm) => ({ ...f, tags }))
              }
              placeholder="Tambah tag..."
            />
            <p className="text-sm text-gray-600 mt-2">
              Input bebas, tekan enter untuk menambah tag
            </p>
          </div>

          {/* Complexity */}
          <div>
            <label className="block font-medium mb-2">Complexity</label>
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

          {/* JSON n8n Workflow */}
          <div>
            <label className="block font-medium mb-2">JSON n8n Workflow</label>
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

          {/* Preview JSON */}
          {editForm.json_n8n && (
            <div>
              <label className="block font-medium mb-2">Preview JSON</label>
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
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
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
            >
              <Trash className="w-4 h-4 mr-2" />
              Hapus Workflow
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2">
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

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: workflow.description }} />
          </div>

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
