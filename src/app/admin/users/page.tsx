"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Ban,
  MoreHorizontal,
  Check,
  X,
  Calendar,
  MapPin,
  Mail,
  Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  status: "draft" | "pending" | "approved" | "rejected";
  is_creator: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  total_users: number;
  active_users: number;
  creators: number;
  banned_users: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    creators: 0,
    banned_users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch profiles with user data (join)
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          user_id,
          name,
          bio,
          location,
          profile_image,
          status,
          created_at,
          updated_at,
          users (
            id,
            email,
            created_at
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // Transform data to match our interface
      const transformedUsers: User[] =
        profiles?.map((profile: any) => ({
          id: profile.user_id,
          email: profile.users?.email ?? "",
          full_name: profile.name,
          avatar_url: profile.profile_image,
          bio: profile.bio,
          location: profile.location,
          status: profile.status,
          is_creator: profile.status === "approved",
          created_at: profile.users?.created_at ?? "",
          updated_at: profile.updated_at,
        })) || [];

      setUsers(transformedUsers);

      // Calculate stats
      const totalUsers = transformedUsers.length;
      const activeUsers = transformedUsers.filter(
        (u) => u.status !== "rejected"
      ).length;
      const creators = transformedUsers.filter(
        (u) => u.status === "approved"
      ).length;
      const bannedUsers = transformedUsers.filter(
        (u) => u.status === "rejected"
      ).length;

      setStats({
        total_users: totalUsers,
        active_users: activeUsers,
        creators,
        banned_users: bannedUsers,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user status update
  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      setActionLoading(userId);

      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: newStatus as any,
                is_creator: newStatus === "approved",
              }
            : user
        )
      );

      // Refresh stats
      await fetchUsers();

      toast({
        title: "Status berhasil diupdate",
        description: `User status berhasil diubah menjadi ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (isCreator: boolean) => {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isCreator
            ? "bg-purple-100 text-purple-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {isCreator ? "Creator" : "User"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <p className="text-gray-600">Kelola pengguna dan akses sistem</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">Semua pengguna</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_users}</div>
            <p className="text-xs text-muted-foreground">Pengguna aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creators}</div>
            <p className="text-xs text-muted-foreground">Creator aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Users
            </CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.banned_users}</div>
            <p className="text-xs text-muted-foreground">User ditolak</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar User</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari user..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Bergabung
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        {searchTerm || filterStatus !== "all"
                          ? "Tidak ada user yang sesuai dengan filter"
                          : "Belum ada user terdaftar"}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4 align-middle">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.full_name}
                              </div>
                              {user.location && (
                                <div className="text-sm text-muted-foreground">
                                  {user.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{user.email}</td>
                        <td className="p-4 align-middle">
                          {getRoleBadge(user.is_creator)}
                        </td>
                        <td className="p-4 align-middle">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="p-4 align-middle text-sm text-muted-foreground">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center space-x-2">
                            {/* View Details */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detail User</DialogTitle>
                                  <DialogDescription>
                                    Informasi lengkap tentang user ini
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    {/* User Info */}
                                    <div className="flex items-center space-x-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarImage
                                          src={selectedUser.avatar_url}
                                        />
                                        <AvatarFallback>
                                          {selectedUser.full_name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">
                                          {selectedUser.full_name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                          {selectedUser.email}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-2">
                                          {getRoleBadge(
                                            selectedUser.is_creator
                                          )}
                                          {getStatusBadge(selectedUser.status)}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <span>
                                            Bergabung:{" "}
                                            {formatDateTime(
                                              selectedUser.created_at
                                            )}
                                          </span>
                                        </div>
                                        {selectedUser.location && (
                                          <div className="flex items-center space-x-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedUser.location}</span>
                                          </div>
                                        )}
                                        {selectedUser.bio && (
                                          <div className="text-sm">
                                            <p className="font-medium mb-1">
                                              Bio:
                                            </p>
                                            <p className="text-muted-foreground">
                                              {selectedUser.bio}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                                      {selectedUser.status === "pending" && (
                                        <>
                                          <Button
                                            onClick={() =>
                                              updateUserStatus(
                                                selectedUser.id,
                                                "approved"
                                              )
                                            }
                                            disabled={
                                              actionLoading === selectedUser.id
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            {actionLoading ===
                                            selectedUser.id ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <Check className="h-4 w-4 mr-2" />
                                            )}
                                            Approve
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              updateUserStatus(
                                                selectedUser.id,
                                                "rejected"
                                              )
                                            }
                                            disabled={
                                              actionLoading === selectedUser.id
                                            }
                                            variant="destructive"
                                          >
                                            {actionLoading ===
                                            selectedUser.id ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <X className="h-4 w-4 mr-2" />
                                            )}
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      {selectedUser.status === "approved" && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                              <Ban className="h-4 w-4 mr-2" />
                                              Revoke Creator
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                Revoke Creator Status
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Apakah Anda yakin ingin mencabut
                                                status creator dari user ini?
                                                User akan kembali menjadi user
                                                biasa.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                Cancel
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() =>
                                                  updateUserStatus(
                                                    selectedUser.id,
                                                    "draft"
                                                  )
                                                }
                                                className="bg-red-600 hover:bg-red-700"
                                              >
                                                Revoke
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* Quick Actions */}
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status !== "rejected" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reject User
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menolak user ini?
                                      User tidak akan bisa mengakses fitur
                                      creator.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        updateUserStatus(user.id, "rejected")
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Fitur Lanjutan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="mx-auto h-8 w-8 text-gray-400 mb-2">
              <AlertCircle className="h-8 w-8" />
            </div>
            <p className="text-sm text-gray-600">
              Fitur lanjutan seperti bulk actions, filter advanced, dan export
              data akan segera tersedia.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
