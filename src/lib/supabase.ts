import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bio: string | null;
          about_markdown: string | null;
          location: string | null;
          website: string | null;
          linkedin: string | null;
          twitter: string | null;
          github: string | null;
          skills: string[] | null;
          experience_level:
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert"
            | null;
          hourly_rate: number | null;
          availability: "available" | "busy" | "unavailable" | null;
          profile_image: string | null;
          status: "draft" | "pending" | "approved" | "rejected";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          instagram: string | null;
          threads: string | null;
          discord: string | null;
          youtube: string | null;
          Whatsapp: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          bio?: string | null;
          about_markdown?: string | null;
          location?: string | null;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          github?: string | null;
          skills?: string[] | null;
          experience_level?:
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert"
            | null;
          hourly_rate?: number | null;
          availability?: "available" | "busy" | "unavailable" | null;
          profile_image?: string | null;
          status?: "draft" | "pending" | "approved" | "rejected";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          instagram?: string | null;
          threads?: string | null;
          discord?: string | null;
          youtube?: string | null;
          Whatsapp?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          bio?: string | null;
          about_markdown?: string | null;
          location?: string | null;
          website?: string | null;
          linkedin?: string | null;
          twitter?: string | null;
          github?: string | null;
          skills?: string[] | null;
          experience_level?:
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert"
            | null;
          hourly_rate?: number | null;
          availability?: "available" | "busy" | "unavailable" | null;
          profile_image?: string | null;
          status?: "draft" | "pending" | "approved" | "rejected";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          instagram?: string | null;
          threads?: string | null;
          discord?: string | null;
          youtube?: string | null;
          Whatsapp?: string | null;
        };
      };
      workflows: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string;
          tags: string[] | null;
          screenshot_url: string | null;
          video_url: string | null;
          complexity: "simple" | "medium" | "complex" | null;
          status: "draft" | "pending" | "approved" | "rejected";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description: string;
          tags?: string[] | null;
          screenshot_url?: string | null;
          video_url?: string | null;
          complexity?: "simple" | "medium" | "complex" | null;
          status?: "draft" | "pending" | "approved" | "rejected";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          description?: string;
          tags?: string[] | null;
          screenshot_url?: string | null;
          video_url?: string | null;
          complexity?: "simple" | "medium" | "complex" | null;
          status?: "draft" | "pending" | "approved" | "rejected";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      creator_applications: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          tanggal_pengajuan: string;
          tanggal_approval: string | null;
          alasan_penolakan: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "approved" | "rejected";
          tanggal_pengajuan?: string;
          tanggal_approval?: string | null;
          alasan_penolakan?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "approved" | "rejected";
          tanggal_pengajuan?: string;
          tanggal_approval?: string | null;
          alasan_penolakan?: string | null;
        };
      };
      events: {
        Row: {
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
          published_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          event_date: string;
          location?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published" | "archived" | "cancelled";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          event_date?: string;
          location?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published" | "archived" | "cancelled";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
      };
      news: {
        Row: {
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
          published_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          published_date: string;
          image_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          excerpt?: string | null;
          published_date?: string;
          image_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type:
            | "creator_application_pending"
            | "creator_application_approved"
            | "creator_application_rejected"
            | "workflow_submission_pending"
            | "workflow_approved"
            | "workflow_rejected"
            | "user_registration"
            | "content_moderation";
          title: string;
          message: string;
          related_id: string | null;
          related_type: string | null;
          priority: "low" | "medium" | "high";
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type:
            | "creator_application_pending"
            | "creator_application_approved"
            | "creator_application_rejected"
            | "workflow_submission_pending"
            | "workflow_approved"
            | "workflow_rejected"
            | "user_registration"
            | "content_moderation";
          title: string;
          message: string;
          related_id?: string | null;
          related_type?: string | null;
          priority?: "low" | "medium" | "high";
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?:
            | "creator_application_pending"
            | "creator_application_approved"
            | "creator_application_rejected"
            | "workflow_submission_pending"
            | "workflow_approved"
            | "workflow_rejected"
            | "user_registration"
            | "content_moderation";
          title?: string;
          message?: string;
          related_id?: string | null;
          related_type?: string | null;
          priority?: "low" | "medium" | "high";
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Utility types for notifications
export type NotificationType =
  Database["public"]["Tables"]["notifications"]["Row"]["type"];
export type NotificationPriority =
  Database["public"]["Tables"]["notifications"]["Row"]["priority"];
export type NotificationRow =
  Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert =
  Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate =
  Database["public"]["Tables"]["notifications"]["Update"];

// Notification type constants for easy reference
export const NOTIFICATION_TYPES = {
  CREATOR_APPLICATION_PENDING: "creator_application_pending" as const,
  CREATOR_APPLICATION_APPROVED: "creator_application_approved" as const,
  CREATOR_APPLICATION_REJECTED: "creator_application_rejected" as const,
  WORKFLOW_SUBMISSION_PENDING: "workflow_submission_pending" as const,
  WORKFLOW_APPROVED: "workflow_approved" as const,
  WORKFLOW_REJECTED: "workflow_rejected" as const,
  USER_REGISTRATION: "user_registration" as const,
  CONTENT_MODERATION: "content_moderation" as const,
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
} as const;

export const RELATED_TYPES = {
  CREATOR_APPLICATION: "creator_application" as const,
  WORKFLOW: "workflow" as const,
  USER: "user" as const,
  CONTENT: "content" as const,
} as const;
