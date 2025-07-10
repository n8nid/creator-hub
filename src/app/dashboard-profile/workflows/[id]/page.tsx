"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow, Trash } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function WorkflowDetailUserPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const workflowId = params?.id as string;
  const { toast } = useToast();
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
    screenshot_url: "",
    video_url: "",
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
          screenshot_url: data.screenshot_url || "",
          video_url: data.video_url || "",
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
    if (
      editForm.screenshot_url &&
      !/^https?:\/\//.test(editForm.screenshot_url)
    ) {
      errors.screenshot_url = "Screenshot URL harus diawali http(s)://";
    }
    if (editForm.video_url && !/^https?:\/\//.test(editForm.video_url)) {
      errors.video_url = "Video URL harus diawali http(s)://";
    }
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
  const handleTags = (tags: string[]) => {
    setEditForm({ ...editForm, tags });
  };

  const handleSave = async (e: React.FormEvent) => {
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
    setSaving(true);
    try {
      const { error } = await supabase
        .from("workflows")
        .update({
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
          category: editForm.category,
          screenshot_url: editForm.screenshot_url,
          video_url: editForm.video_url,
          complexity: editForm.complexity,
          json_n8n: editForm.json_n8n,
        })
        .eq("id", workflowId);
      if (error) {
        toast({
          title: "Gagal menyimpan perubahan",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      toast({
        title: "Perubahan berhasil disimpan",
        description: "Workflow berhasil diperbarui!",
        variant: "default",
      });
      // Refresh data
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();
      setWorkflow(data);
    } catch (err: any) {
      toast({
        title: "Terjadi error",
        description: err?.message || "Gagal menyimpan perubahan.",
        variant: "destructive",
      });
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
        toast({
          title: "Gagal menghapus workflow",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Workflow berhasil dihapus",
        description: "Workflow telah dihapus dari sistem.",
        variant: "default",
      });
      router.push("/dashboard-profile/workflows");
    } catch (err: any) {
      toast({
        title: "Terjadi error",
        description: err?.message || "Gagal menghapus workflow.",
        variant: "destructive",
      });
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {workflow.title}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          {isOwner ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Judul</label>
                <Input
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
                {formError.title && (
                  <p className="text-sm text-red-600 mt-1">{formError.title}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Deskripsi</label>
                <Textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
                {formError.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Kategori</label>
                <Select
                  value={editForm.category}
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
                <div className="text-xs text-gray-500 mt-1">
                  Pilih satu kategori
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Tags</label>
                <TagInput
                  value={editForm.tags}
                  onChange={(tags) =>
                    setEditForm((f: typeof editForm) => ({ ...f, tags }))
                  }
                  placeholder="Tambah tag..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  Input bebas, tekan enter untuk menambah tag
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Screenshot URL</label>
                <Input
                  name="screenshot_url"
                  value={editForm.screenshot_url}
                  onChange={handleChange}
                  disabled={saving}
                />
                {formError.screenshot_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.screenshot_url}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Video URL</label>
                <Input
                  name="video_url"
                  value={editForm.video_url}
                  onChange={handleChange}
                  disabled={saving}
                />
                {formError.video_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {formError.video_url}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Complexity</label>
                <Input
                  name="complexity"
                  value={editForm.complexity}
                  onChange={handleChange}
                  placeholder="simple/medium/complex"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  JSON n8n Workflow
                </label>
                <Textarea
                  name="json_n8n"
                  value={editForm.json_n8n}
                  onChange={handleChange}
                  placeholder="Paste JSON workflow dari n8n di sini"
                  rows={6}
                  disabled={saving}
                />
              </div>
              {/* Live preview n8n demo */}
              {editForm.json_n8n && (
                <div className="mt-4 border rounded bg-gray-50 p-2 overflow-x-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<n8n-demo workflow='${editForm.json_n8n.replace(
                        /'/g,
                        "&#39;"
                      )}' frame="true"></n8n-demo>`,
                    }}
                  />
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={saving}>
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
                  <Trash className="w-4 h-4 mr-1" /> Hapus
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard-profile/workflows")}
                  disabled={saving}
                >
                  Kembali
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-4">
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full mr-2">
                  {workflow.complexity || "-"}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
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
              <div className="mb-4 text-gray-600">{workflow.description}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(workflow.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-4">
                Created: {workflow.created_at?.slice(0, 10)}
              </div>
              {/* Preview n8n workflow jika ada json_n8n */}
              {workflow.json_n8n && (
                <div className="mt-4 border rounded bg-gray-50 p-2 overflow-x-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                        /'/g,
                        "&#39;"
                      )}' frame="true"></n8n-demo>`,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
