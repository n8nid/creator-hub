"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Database, Bell, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password baru dan konfirmasi harus sama.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // Supabase Auth: update password
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Berhasil ganti password",
          description: "Password berhasil diubah.",
          variant: "default",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Gagal ganti password",
          description: data.error || "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Gagal ganti password",
        description: "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      toast({
        title: "Format email tidak valid",
        description: "Masukkan email yang benar.",
        variant: "destructive",
      });
      return;
    }
    if (!emailPassword) {
      toast({
        title: "Password harus diisi",
        description: "Masukkan password untuk konfirmasi.",
        variant: "destructive",
      });
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Berhasil ganti email",
          description:
            "Email berhasil diubah. Silakan login ulang jika diminta.",
          variant: "default",
        });
        setNewEmail("");
        setEmailPassword("");
      } else {
        toast({
          title: "Gagal ganti email",
          description: data.error || "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Gagal ganti email",
        description: "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-gray-600">Konfigurasi sistem dan keamanan</p>
        </div>
      </div>

      {/* Info Akun Admin */}
      <Card>
        <CardHeader>
          <CardTitle>Info Akun Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            Email: <span className="font-mono">{user?.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Form Ganti Password */}
      <Card>
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1 text-sm">Password Lama</label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password Baru</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Konfirmasi Password Baru
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Form Ganti Email */}
      <Card>
        <CardHeader>
          <CardTitle>Ganti Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1 text-sm">Email Baru</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Password (Konfirmasi)
              </label>
              <Input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={emailLoading} className="mt-2">
              {emailLoading ? "Menyimpan..." : "Simpan Email Baru"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Konfigurasi umum sistem
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keamanan</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Pengaturan keamanan dan akses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Konfigurasi database dan backup
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifikasi</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Pengaturan notifikasi sistem
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Fitur Sedang Dalam Pengembangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Panel Pengaturan
            </h3>
            <p className="text-gray-600 mb-4">
              Fitur untuk mengkonfigurasi sistem, keamanan, database, dan
              pengaturan platform akan segera tersedia.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Konfigurasi sistem umum</p>
              <p>• Pengaturan keamanan dan akses</p>
              <p>• Manajemen database dan backup</p>
              <p>• Konfigurasi notifikasi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
