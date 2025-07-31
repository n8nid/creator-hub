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
          <h1 className="admin-page-title">Pengaturan</h1>
          <p className="admin-page-subtitle">Konfigurasi sistem dan keamanan</p>
        </div>
      </div>

      {/* Info Akun Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="admin-section-title">Info Akun Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            Email: <span className="font-mono">{user?.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sisakan hanya info admin (email) di halaman. */}
      {/* Hapus form ganti password dan fitur lain. */}
      {/* Tambahkan card/keterangan di bawah: */}
      {/* <div className="mt-8"> */}
      {/*   <div className="bg-gray-50 border rounded p-6 text-center text-gray-500"> */}
      {/*     <div className="text-lg font-semibold mb-2">Fitur Sedang Dalam Pengembangan</div> */}
      {/*     <div>Fitur panel pengaturan sistem, keamanan, database, dan konfigurasi platform akan segera tersedia.</div> */}
      {/*   </div> */}
      {/* </div> */}
      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Fitur panel pengaturan sistem, keamanan, database, dan konfigurasi
          platform akan segera tersedia.
        </p>
      </div>
    </div>
  );
}
