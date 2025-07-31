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
    };
  };
};
