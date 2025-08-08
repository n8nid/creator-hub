"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Calendar, Newspaper, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived" | "cancelled";
  created_at: string;
  updated_at: string;
}

interface News {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  published_date: string;
  image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export default function ContentManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "event" | "news" | null;
    id: string | null;
    title: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: null,
  });

  // Statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
  });

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "50");

      const response = await fetch(`/api/admin/content/events?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch events",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  };

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "50");

      const response = await fetch(`/api/admin/content/news?${params}`);
      const data = await response.json();

      if (response.ok) {
        setNews(data.news || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch news",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const [eventsResponse, newsResponse] = await Promise.all([
        fetch("/api/admin/content/events?limit=1000"),
        fetch("/api/admin/content/news?limit=1000"),
      ]);

      const eventsData = await eventsResponse.json();
      const newsData = await newsResponse.json();

      if (eventsResponse.ok && newsResponse.ok) {
        const events = eventsData.events || [];
        const news = newsData.news || [];

        setStats({
          totalEvents: events.length,
          publishedEvents: events.filter((e: Event) => e.status === "published")
            .length,
          draftEvents: events.filter((e: Event) => e.status === "draft").length,
          totalNews: news.length,
          publishedNews: news.filter((n: News) => n.status === "published")
            .length,
          draftNews: news.filter((n: News) => n.status === "draft").length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchNews(), fetchStats()]);
      setLoading(false);
    };

    fetchData();
  }, [activeTab, statusFilter, searchQuery]);

  const openDeleteDialog = (
    type: "event" | "news",
    id: string,
    title: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      type,
      id,
      title,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      type: null,
      id: null,
      title: null,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.type || !deleteDialog.id) return;

    try {
      const endpoint = deleteDialog.type === "news" ? "news" : "events";
      const response = await fetch(
        `/api/admin/content/${endpoint}/${deleteDialog.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "✅ Berhasil Dihapus",
          description: `"${deleteDialog.title}" telah berhasil dihapus secara permanen dari database.`,
        });
        if (deleteDialog.type === "event") {
          fetchEvents();
        } else {
          fetchNews();
        }
        fetchStats();
        closeDeleteDialog();
      } else {
        const data = await response.json();
        toast({
          title: "❌ Gagal Menghapus",
          description:
            data.error ||
            `Gagal menghapus "${deleteDialog.title}". Silakan coba lagi.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Gagal Menghapus",
        description: `Terjadi kesalahan saat menghapus "${deleteDialog.title}". Silakan coba lagi.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      published: "default",
      draft: "secondary",
      archived: "destructive",
      cancelled: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="admin-page-title">Content Management</h1>
            <p className="admin-page-subtitle">
              Manage events and news for your community
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="admin-card-title">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="animate-pulse text-gray-400">...</span>
              </div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="admin-card-title">Total News</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="animate-pulse text-gray-400">...</span>
              </div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="admin-card-title">Total Content</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="animate-pulse text-gray-400">...</span>
              </div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  News
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-48 mb-1"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Content Management</h1>
          <p className="admin-page-subtitle">
            Manage events and news for your community
          </p>
        </div>
        <Button
          onClick={() => router.push(`/admin/content/${activeTab}/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create {activeTab === "events" ? "Event" : "News"}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedEvents} published, {stats.draftEvents} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total News</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedNews} published, {stats.draftNews} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEvents + stats.totalNews}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedEvents + stats.publishedNews} published
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                News
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                {activeTab === "events" && (
                  <option value="cancelled">Cancelled</option>
                )}
              </select>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No events found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating your first event"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{event.title}</h3>
                          {event.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Date: {formatDate(event.event_date)}</span>
                          {event.location && (
                            <span>Location: {event.location}</span>
                          )}
                          <span>Created: {formatDate(event.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/content/events/${event.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog("event", event.id, event.title)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-4">
              {news.length === 0 ? (
                <div className="text-center py-8">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No news found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating your first news article"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {news.map((newsItem) => (
                    <div
                      key={newsItem.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{newsItem.title}</h3>
                          {newsItem.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          {getStatusBadge(newsItem.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {newsItem.excerpt || "No excerpt"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Published: {formatDate(newsItem.published_date)}
                          </span>
                          <span>
                            Created: {formatDate(newsItem.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/content/news/${newsItem.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog(
                              "news",
                              newsItem.id,
                              newsItem.title
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-foreground">
                "{deleteDialog.title}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
