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
  role: "user" | "creator" | "admin";
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

  // Process profile data
  const processProfile = (
    profile: any,
    usersMap: Map<string, any>,
    joinedUser?: any,
    creatorMap?: Map<string, string>,
    adminMap?: Set<string>
  ) => {
    // Determine role based on logic
    let role: "user" | "creator" | "admin" = "user";

    if (adminMap?.has(profile.user_id)) {
      role = "admin";
    } else if (creatorMap?.get(profile.user_id) === "approved") {
      role = "creator";
    }

    // Get user data from joined data or map
    const userData = joinedUser || usersMap.get(profile.user_id);

    console.log(`🔍 Processing profile: ${profile.name}`);
    console.log(`   Profile user_id: ${profile.user_id}`);
    console.log(`   User data found: ${!!userData}`);
    console.log(`   User data:`, userData);
    console.log(`   Email from user data: ${userData?.email}`);

    // Fallback: If no user data, try to extract email from profile name
    let finalEmail = userData?.email || "Email tidak tersedia";
    let finalCreatedAt = userData?.created_at || profile.created_at || "";

    // If no user data and profile name looks like an email, use it
    if (!userData && profile.name && profile.name.includes("@")) {
      finalEmail = profile.name;
      console.log(`   Using email from profile name: ${finalEmail}`);
    }

    console.log(`   Final email: ${finalEmail}`);
    console.log(`   Final created_at: ${finalCreatedAt}`);

    return {
      id: profile.user_id,
      email: finalEmail,
      full_name: profile.name,
      avatar_url: profile.profile_image,
      bio: profile.bio,
      location: profile.location,
      status: profile.status,
      role,
      created_at: finalCreatedAt,
      updated_at: profile.updated_at,
    };
  };

  // Calculate stats
  const calculateStats = async (transformedUsers: User[]) => {
    const totalUsers = transformedUsers.length;
    const activeUsers = transformedUsers.filter(
      (u) => u.status !== "rejected"
    ).length;

    // Get creators count from creator_applications table
    const { count: creators } = await supabase
      .from("creator_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");

    const bannedUsers = transformedUsers.filter(
      (u) => u.status === "rejected"
    ).length;

    setStats({
      total_users: totalUsers,
      active_users: activeUsers,
      creators: creators ?? 0,
      banned_users: bannedUsers,
    });
  };

  // Fetch users data
  const fetchUsers = async () => {
    console.log("🚀 fetchUsers function called");

    try {
      setLoading(true);
      console.log("✅ setLoading(true) called");

      console.log("=== STARTING FETCH USERS ===");

      // Create users lookup map
      const usersMap = new Map<string, any>();

      // SOLUSI ALTERNATIF: Try multiple approaches to get users data
      console.log("🔍 Trying multiple approaches to get users data...");

      // Approach 1: Direct query with service role
      console.log("🔍 Approach 1: Direct query...");
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, created_at");

      console.log("=== APPROACH 1 RESULT ===");
      console.log("Users data:", usersData);
      console.log("Users error:", usersError);
      console.log("Users count:", usersData?.length);

      // Approach 2: Try with auth context
      if (usersError || !usersData || usersData.length === 0) {
        console.log("❌ Approach 1 failed, trying Approach 2...");

        // Try to get current user first to test connection
        const {
          data: { user: currentUser },
          error: currentUserError,
        } = await supabase.auth.getUser();
        console.log("Current user:", currentUser);
        console.log("Current user error:", currentUserError);

        // Try different query pattern
        const { data: altUsers, error: altError } = await supabase
          .from("users")
          .select("*")
          .limit(10);

        console.log("=== APPROACH 2 RESULT ===");
        console.log("Alternative users data:", altUsers);
        console.log("Alternative error:", altError);
        console.log("Alternative count:", altUsers?.length);

        if (altUsers && altUsers.length > 0) {
          altUsers.forEach((user: any) => {
            usersMap.set(user.id, user);
            console.log(`✅ Added user to map: ${user.id} -> ${user.email}`);
          });
        }

        // Approach 3: Try API endpoint
        if (!altUsers || altUsers.length === 0) {
          console.log(
            "❌ Approach 2 failed, trying Approach 3 (API endpoint)..."
          );

          try {
            const response = await fetch("/api/admin/users");
            if (response.ok) {
              const { users: apiUsers } = await response.json();
              console.log("=== APPROACH 3 RESULT (API) ===");
              console.log("API users data:", apiUsers);
              console.log("API users count:", apiUsers?.length);

              if (apiUsers && apiUsers.length > 0) {
                apiUsers.forEach((user: any) => {
                  usersMap.set(user.id, user);
                  console.log(
                    `✅ Added user to map via API: ${user.id} -> ${user.email}`
                  );
                });
              }
            } else {
              console.log(
                "❌ API endpoint failed:",
                response.status,
                response.statusText
              );
            }
          } catch (apiError) {
            console.log("❌ API endpoint error:", apiError);
          }
        }
      } else {
        // Approach 1 successful
        usersData.forEach((user: any) => {
          usersMap.set(user.id, user);
          console.log(`✅ Added user to map: ${user.id} -> ${user.email}`);
        });
      }

      // Approach 3: If both failed, try to get users from profiles with email-like names
      if (usersMap.size === 0) {
        console.log(
          "❌ Both approaches failed, using email extraction from profiles..."
        );
      }

      console.log("=== USERS MAP STATUS ===");
      console.log("Users map size:", usersMap.size);
      console.log("Users map keys:", Array.from(usersMap.keys()));

      // Fetch profiles
      console.log("🔍 Fetching profiles...");
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("=== PROFILES TABLE QUERY ===");
      console.log("Profiles data:", profilesData);
      console.log("Profiles error:", profilesError);
      console.log("Profiles count:", profilesData?.length);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      // Get creator and admin data
      console.log("🔍 Fetching creator and admin data...");
      const { data: creatorApps } = await supabase
        .from("creator_applications")
        .select("user_id, status");

      const { data: adminUsers } = await supabase
        .from("admin_users")
        .select("user_id");

      // Create lookup maps
      const creatorMap = new Map<string, string>();
      creatorApps?.forEach((app: any) => {
        creatorMap.set(app.user_id, app.status);
      });

      const adminMap = new Set<string>();
      adminUsers?.forEach((admin: any) => {
        adminMap.add(admin.user_id as string);
      });

      // Process profiles with enhanced email detection
      console.log("🔍 Processing profiles with enhanced email detection...");
      const transformedUsers: User[] =
        profilesData?.map((profile: any) => {
          // Get user data from map
          const userData = usersMap.get(profile.user_id);

          console.log(`🔍 Processing profile: ${profile.name}`);
          console.log(`   Profile user_id: ${profile.user_id}`);
          console.log(`   User data found: ${!!userData}`);
          console.log(`   User data:`, userData);
          console.log(`   Email from user data: ${userData?.email}`);

          // Determine role
          let role: "user" | "creator" | "admin" = "user";
          if (adminMap.has(profile.user_id)) {
            role = "admin";
          } else if (creatorMap.get(profile.user_id) === "approved") {
            role = "creator";
          }

          // Enhanced email detection
          let finalEmail = "Email tidak tersedia";
          let finalCreatedAt = profile.created_at || "";

          // Priority 1: Use email from users table
          if (userData && userData.email) {
            finalEmail = userData.email;
            finalCreatedAt = userData.created_at || profile.created_at || "";
            console.log(`   ✅ Using email from users table: ${finalEmail}`);
          }
          // Priority 2: Use profile name if it looks like email
          else if (
            profile.name &&
            profile.name.includes("@") &&
            profile.name.includes(".")
          ) {
            finalEmail = profile.name;
            console.log(`   ✅ Using email from profile name: ${finalEmail}`);
          }
          // Priority 3: Try to construct email from profile name
          else if (profile.name && !profile.name.includes(" ")) {
            // If name is single word, might be username
            finalEmail = `${profile.name}@example.com`;
            console.log(`   ⚠️ Constructed email from username: ${finalEmail}`);
          }
          // Priority 4: Use created_at from users table if available
          else if (userData && userData.created_at) {
            finalCreatedAt = userData.created_at;
            console.log(
              `   ⚠️ Using created_at from users table: ${finalCreatedAt}`
            );
          }

          console.log(`   Final email: ${finalEmail}`);
          console.log(`   Final created_at: ${finalCreatedAt}`);

          return {
            id: profile.user_id,
            email: finalEmail,
            full_name: profile.name,
            avatar_url: profile.profile_image,
            bio: profile.bio,
            location: profile.location,
            status: profile.status,
            role,
            created_at: finalCreatedAt,
            updated_at: profile.updated_at,
          };
        }) || [];

      console.log("=== FINAL TRANSFORMED USERS ===");
      console.log("Transformed users:", transformedUsers);
      console.log("Transformed users count:", transformedUsers.length);

      setUsers(transformedUsers);
      calculateStats(transformedUsers);
    } catch (error) {
      console.error("❌ Error in fetchUsers:", error);
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "Unknown",
      });
    } finally {
      console.log("🏁 fetchUsers finally block - setting loading to false");
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
                role: newStatus === "approved" ? "creator" : "user",
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: `Gagal mengupdate status user: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect triggered - calling fetchUsers");
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

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      user: { label: "User", className: "bg-gray-100 text-gray-800" },
      creator: { label: "Creator", className: "bg-purple-100 text-purple-800" },
      admin: { label: "Admin", className: "bg-blue-100 text-blue-800" },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.user;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    console.log("formatDate input:", dateString); // Debug log

    if (!dateString || dateString === "" || dateString === "Invalid Date") {
      return "-";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log("Invalid date:", dateString);
        return "-";
      }
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "-";
    }
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
          <h1 className="admin-page-title">Manajemen User</h1>
          <p className="admin-page-subtitle">
            Kelola pengguna dan akses sistem
          </p>
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
            <CardTitle className="admin-card-title">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">Semua pengguna</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_users}</div>
            <p className="text-xs text-muted-foreground">Pengguna aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Creators</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creators}</div>
            <p className="text-xs text-muted-foreground">Creator aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Rejected Users</CardTitle>
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
            <CardTitle className="admin-section-title">Daftar User</CardTitle>
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
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{user.email}</td>
                        <td className="p-4 align-middle">
                          {getRoleBadge(user.role)}
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
                                          {getRoleBadge(selectedUser.role)}
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
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* Reject User */}
                            {user.status !== "rejected" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    disabled={actionLoading === user.id}
                                  >
                                    {actionLoading === user.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Ban className="h-4 w-4" />
                                    )}
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
                                      creator dan statusnya akan berubah menjadi
                                      rejected.
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
                                      disabled={actionLoading === user.id}
                                    >
                                      {actionLoading === user.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      ) : (
                                        <X className="h-4 w-4 mr-2" />
                                      )}
                                      Reject User
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
    </div>
  );
}
